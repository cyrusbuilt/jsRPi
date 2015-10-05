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

var util = require('util');
var inherits = require('util').inherits;
var FireplaceBase = require('./FireplaceBase.js');
var FireplaceState = require('./FireplaceState.js');
var FireplacePilotLightException = require('./FireplacePilotLightException.js');
var FireplaceStateChangeEvent = require('./FireplaceStateChangedEvent.js');
var FireplacePilotLightEvent = require('./FireplacePilotLightEvent.js');
var Relay = require('../../Components/Relays/Relay.js');
var RelayState = require('../../Components/Relays/RelayState.js');
var Sensor = require('../../Components/Sensors/Sensor.js');
var SensorState = require('../../Components/Sensors/SensorState.js');
var ArgumentNullException = require('../../ArgumentNullException.js');

/**
 * @classdesc A device that is an abstraction of a gas fireplace. This in an
 * implementation of FireplaceBase.
 * @param {Relay} controlRelay          The control relay.
 * @param {RelayState} onRelayState     The relay state used to consider the
 * fireplace to be "on".
 * @param {Sensor} pilotLightSensor     The pilot light sensor (optional).
 * @param {SensorState} pilotOnState    The pilot light state used to consider
 * the pilot light to be "on".
 * @throws {ArgumentNullException} if controlRelay is null or undefined.
 * @constructor
 * @extends {FireplaceBase}
 */
function FireplaceDevice(controlRelay, onRelayState, pilotLightSensor, pilotOnState) {
  FireplaceBase.call(this);

  if (util.isNullOrUndefined(controlRelay)) {
    throw new ArgumentNullException("'controlRelay' cannot be null or undefined.");
  }

  var self = this;
  var _controlRelay = controlRelay;
  var _fireplaceOnRelayState = onRelayState || RelayState.Closed;
  var _pilotLightSensor = pilotLightSensor;
  var _pilotLightOnSensorState = pilotOnState || SensorState.Closed;

  /**
   * Internal event handler for the relay state changed event.
	 * This fires the fireplace state changed event when the
	 * relay's state changes.
   * @param  {RelayStateChangeEvent} relayStateChangeEvent The event object.
   * @private
   */
  var internalHandleRelayStateChange = function(relayStateChangeEvent) {
    var stateChangeEvent = null;
    if (relayStateChangeEvent.getNewState() === _fireplaceOnRelayState) {
      stateChangeEvent = new FireplaceStateChangeEvent(FireplaceState.Off, FireplaceState.On);
    }
    else {
      stateChangeEvent = new FireplaceStateChangeEvent(FireplaceState.On, FireplaceState.Off);
    }

    FireplaceBase.prototype.onFireplaceStateChange.call(this, stateChangeEvent);
  };

  _controlRelay.on(Relay.EVENT_STATE_CHANGED, internalHandleRelayStateChange);

  /**
   * Gets a value indicating whether the pilot light is on.
   * @return {Boolean} true if the pilot light is lit; Otherwise, false.
   * @override
   */
  this.isPilotLightOn = function() {
    if (util.isNullOrUndefined(_pilotLightSensor)) {
      return false;
    }
    return _pilotLightSensor.isState(_pilotLightOnSensorState);
  };

  /**
   * Gets a value indicating whether pilot light is off.
   * @return {Boolean} true if the pilot light is off; Otherwise, false.
   * @override
   */
  this.isPilotLightOff = function() {
    return !self.isPilotLightOn();
  };

  /**
   * Gets the fireplace state.
   * @return {FireplaceState} The current state.
   * @override
   */
  this.getState = function() {
    if (_controlRelay.getState() === _fireplaceOnRelayState) {
      return FireplaceState.On;
    }
    return FireplaceState.Off;
  };

  /**
   * Sets the fireplace state.
   * @param  {FireplaceState} state The fireplace state.
   * @override
   */

  this.setState = function(state) {
    if (state === FireplaceState.Off) {
      if (_controlRelay.getState() === _fireplaceOnRelayState) {
        _controlRelay.toggle();
      }
    }
    else {
      if ((!util.isNullOrUndefined(_pilotLightSensor)) && self.isPilotLightOff()) {
        throw new FireplacePilotLightException();
      }

      if (_controlRelay.getState() !== _fireplaceOnRelayState) {
        _controlRelay.setState(_fireplaceOnRelayState);
      }
    }
  };

  /**
   * Internal handler for the pilot light sensor state changed event.
	 * This fires pilot light state changed event when the pilot light's
	 * state changes.
   * @param  {SensorStateChangeEvent} stateChangeEvent The event object.
   * @private
   */
  var internalHandleSensorStateChange = function(stateChangeEvent) {
    if (stateChangeEvent.getNewState() === _pilotLightOnSensorState) {
      self.turnOff();
    }

    var evt = new FireplacePilotLightEvent(self.isPilotLightOn());
    FireplaceBase.prototype.onPilotLightStateChange.call(this, evt);
  };

  if (!util.isNullOrUndefined(_pilotLightSensor)) {
    _pilotLightSensor.on(Sensor.EVENT_STATE_CHANGED, internalHandleSensorStateChange);
  }

  /**
   * Releases all resources used by the FireplaceDevice object.
   * @override
   */
  this.dispose = function() {
    if (FireplaceBase.prototype.isDisposed.call(this)) {
      return;
    }

    if (!util.isNullOrUndefined(_controlRelay)) {
      _controlRelay.dispose();
      _controlRelay = undefined;
    }

    if (!util.isNullOrUndefined(_pilotLightSensor)) {
      _pilotLightSensor.dispose();
      _pilotLightSensor = undefined;
    }

    FireplaceBase.prototype.dispose.call(this);
  };
}

FireplaceDevice.prototype.constructor = FireplaceDevice;
inherits(FireplaceDevice, FireplaceBase);

module.exports = FireplaceDevice;
