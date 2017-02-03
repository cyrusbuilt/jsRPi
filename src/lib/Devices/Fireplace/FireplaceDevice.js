"use strict";
//
//  FireplaceDevice.js
//
//  Author:
//       Chris Brunner <cyrusbuilt at gmail dot com>
//
//  Copyright (c) 2015 CyrusBuilt
//
//  This program is free software; you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation; either version 2 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program; if not, write to the Free Software
//  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA

const util = require('util');
const FireplaceBase = require('./FireplaceBase.js');
const FireplaceState = require('./FireplaceState.js');
const FireplacePilotLightException = require('./FireplacePilotLightException.js');
const FireplaceStateChangeEvent = require('./FireplaceStateChangedEvent.js');
const FireplacePilotLightEvent = require('./FireplacePilotLightEvent.js');
const Relay = require('../../Components/Relays/Relay.js');
const RelayState = require('../../Components/Relays/RelayState.js');
const Sensor = require('../../Components/Sensors/Sensor.js');
const SensorState = require('../../Components/Sensors/SensorState.js');
const ArgumentNullException = require('../../ArgumentNullException.js');

/**
* @classdesc A device that is an abstraction of a gas fireplace. This in an
* implementation of FireplaceBase.
* @extends {FireplaceBase}
*/
class FireplaceDevice extends FireplaceBase {
  /**
   * Initializes a new instance of the jsrpi.Devices.Fireplace.FireplaceDevice
   * class with the control relay, pilot light sensor, the relay state to
   * consider the fireplace to be 'on' and the sensor state to consider the
   * pilot light 'on'.
   * @param {Relay} controlRelay          The control relay.
   * @param {RelayState} onRelayState     The relay state used to consider the
   * fireplace to be "on".
   * @param {Sensor} pilotLightSensor     The pilot light sensor (optional).
   * @param {SensorState} pilotOnState    The pilot light state used to consider
   * the pilot light to be "on".
   * @throws {ArgumentNullException} if controlRelay is null or undefined.
   * @constructor
   */
  constructor(controlRelay, onRelayState, pilotLightSensor, pilotOnState) {
    super();

    if (util.isNullOrUndefined(controlRelay)) {
      throw new ArgumentNullException("'controlRelay' cannot be null or undefined.");
    }

    this._controlRelay = controlRelay;
    this._pilotLightSensor = pilotLightSensor;
    this._fireplaceOnRelayState = onRelayState;
    if (util.isNullOrUndefined(this._fireplaceOnRelayState)) {
      this._fireplaceOnRelayState = RelayState.Closed;
    }

    this._pilotLightOnSensorState = pilotOnState;
    if (util.isNullOrUndefined(this._pilotLightOnSensorState)) {
      this._pilotLightOnSensorState = SensorState.Closed;
    }

    this._controlRelay.on(Relay.EVENT_STATE_CHANGED, (evt) => {
        this._internalHandleRelayStateChange(evt);
    });

    if (!util.isNullOrUndefined(this._pilotLightSensor)) {
      this._pilotLightSensor.on(Sensor.EVENT_STATE_CHANGED, (evt) => {
          this._internalHandleSensorStateChange(evt);
      });
    }
  }

  /**
  * Gets the pilot light sensor used to detect the pilot light state.
  * @property {Sensor} pilotLightSensor - The pilot light sensor.
  * @readonly
  */
  get pilotLightSensor() {
    return this._pilotLightSensor;
  }

  /**
  * Gets the relay being used to control ignition.
  * @property {Relay} controlRelay - The control relay.
  * @readonly
  */
  get controlRelay() {
    return this._controlRelay;
  }

  /**
  * Internal event handler for the relay state changed event.
  * This fires the fireplace state changed event when the
  * relay's state changes.
  * @param  {RelayStateChangeEvent} relayStateChangeEvent The event object.
  * @private
  */
  _internalHandleRelayStateChange(relayStateChangeEvent) {
    let stateChangeEvent = null;
    if (relayStateChangeEvent.newState === this._fireplaceOnRelayState) {
      stateChangeEvent = new FireplaceStateChangeEvent(FireplaceState.Off, FireplaceState.On);
    }
    else {
      stateChangeEvent = new FireplaceStateChangeEvent(FireplaceState.On, FireplaceState.Off);
    }

    this.onFireplaceStateChange(stateChangeEvent);
  }

  /**
  * Gets a value indicating whether the pilot light is on.
  * @property {Boolean} isPilotLightOn - true if the pilot light is lit;
  * Otherwise, false.
  * @readonly
  * @override
  */
  get isPilotLightOn() {
    if (util.isNullOrUndefined(this._pilotLightSensor)) {
      return false;
    }
    return this._pilotLightSensor.isState(this._pilotLightOnSensorState);
  }

  /**
  * Gets a value indicating whether pilot light is off.
  * @property {Boolean} isPilotLightOff - true if the pilot light is off;
  * Otherwise, false.
  * @readonly
  * @override
  */
  get isPilotLightOff() {
    return !this.isPilotLightOn;
  }

  /**
  * Gets or sets the fireplace state.
  * @property {FireplaceState} state - The fireplace state.
  * @throws {FireplacePilotLightException} if no pilot light sensor is present.
  * @override
  */
  get state() {
    if (this._controlRelay.state === this._fireplaceOnRelayState) {
      return FireplaceState.On;
    }
    return FireplaceState.Off;
  }

  set state(s) {
    if (this.state !== s) {
      if (s === FireplaceState.Off) {
        if (this._controlRelay.state === this._fireplaceOnRelayState) {
          this._controlRelay.toggle();
        }
      }
      else {
        if ((!util.isNullOrUndefined(this._pilotLightSensor)) && this.isPilotLightOff) {
          throw new FireplacePilotLightException();
        }

        if (this._controlRelay.state !== this._fireplaceOnRelayState) {
          this._controlRelay.state = this._fireplaceOnRelayState;
        }
      }

      super.state = s;
    }
  }

  /**
  * Gets a value indicating whether the fireplace is on.
  * @property {Boolean} isOn - true if the fireplace is on; Otherwise, false.
  * @readonly
  * @override
  */
  get isOn() {
    return (this.state === FireplaceState.On);
  }

  /**
  * Gets a value indicating whether the fireplace is off.
  * @property {Boolean} isOff - true if the fireplace is off; Otherwise, false.
  * @readonly
  * @override
  */
  get isOff() {
    return (this.state === FireplaceState.Off);
  }

  /**
  * Turns the fireplace off.
  * @override
  */
  turnOff() {
    this.state = FireplaceState.Off;
  }

  /**
  * Internal handler for the pilot light sensor state changed event.
  * This fires pilot light state changed event when the pilot light's
  * state changes.
  * @param  {SensorStateChangeEvent} stateChangeEvent The event object.
  * @private
  */
  _internalHandleSensorStateChange(stateChangeEvent) {
    if (stateChangeEvent.newState === this._pilotLightOnSensorState) {
      this.turnOff();
    }

    let evt = new FireplacePilotLightEvent(this.isPilotLightOn);
    this.onPilotLightStateChange(evt);
  }

  /**
  * Turns the fireplace on with the specified timeout. If the operation is not
  * successful within the allotted time, the operation is cancelled for safety
  * reasons.
  * @param  {Number} timeoutDelay   The timeout delay. If not specified or less
  * than or equal to zero, then the fireplace is turned on without any saftey
  * delay (not recommended).
  * @param  {TimeUnit} timeoutUnit  The time unit of measure for the timeout.
  * If not specified, TimeUnit.Seconds is assumed.
  * @override
  */
  turnOn(timeoutDelay, timeoutUnit) {
    this.state = FireplaceState.On;
    if (util.isNullOrUndefined(timeoutUnit)) {
      timeoutUnit = this.getTimeoutUnit();
    }

    if (!util.isNullOrUndefined(timeoutDelay)) {
      if (timeoutDelay > 0) {
        this.setTimeoutDelay(timeoutDelay, timeoutUnit);
      }
    }
  }

  /**
  * Shutdown the fireplace.
  * @override
  */
  shutdown() {
    super.cancelTimeout();
    this.turnOff();
  }

  /**
  * Releases all resources used by the FireplaceDevice object.
  * @override
  */
  dispose() {
    if (this.isDisposed) {
      return;
    }

    if (!util.isNullOrUndefined(this._controlRelay)) {
      this._controlRelay.dispose();
      this._controlRelay = undefined;
    }

    if (!util.isNullOrUndefined(this._pilotLightSensor)) {
      this._pilotLightSensor.dispose();
      this._pilotLightSensor = undefined;
    }

    super.dispose();
  }
}

module.exports = FireplaceDevice;
