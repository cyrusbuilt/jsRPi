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
  var _base = new FireplaceBase();
  var _controlRelay = controlRelay;
  var _pilotLightSensor = pilotLightSensor;
  var _fireplaceOnRelayState = onRelayState;
  if (util.isNullOrUndefined(_fireplaceOnRelayState)) {
    _fireplaceOnRelayState = RelayState.Closed;
  }

  var _pilotLightOnSensorState = pilotOnState;
  if (util.isNullOrUndefined(_pilotLightOnSensorState)) {
    _pilotLightOnSensorState = SensorState.Closed;
  }

  /**
  * Device name property.
  * @property {String}
  */
  this.deviceName = _base.deviceName;

  /**
  * Tag property.
  * @property {Object}
  */
  this.tag = _base.tag;

  /**
  * Determines whether or not the current instance has been disposed.
  * @return {Boolean} true if disposed; Otherwise, false.
  * @override
  */
  this.isDisposed = function() {
    return _base.isDisposed();
  };

  /**
  * Gets the pilot light sensor
  * @returns {Sensor} The sensor used to detect the pilot light state.
  */
  this.getPilotLightSensor = function() {
    return _pilotLightSensor;
  };

  /**
  * Gets the relay being used to control ignition.
  * @returns {Relay} The ignition control relay.
  */
  this.getControlRelay = function() {
    return _controlRelay;
  };

  /**
  * Gets the property collection.
  * @return {Array} A custom property collection.
  * @override
  */
  this.getPropertyCollection = function() {
    return _base.getPropertyCollection();
  };

  /**
  * Checks to see if the property collection contains the specified key.
  * @param  {String}  key The key name of the property to check for.
  * @return {Boolean} true if the property collection contains the key;
  * Otherwise, false.
  * @override
  */
  this.hasProperty = function(key) {
    return _base.hasProperty(key);
  };

  /**
  * Sets the value of the specified property. If the property does not already exist
  * in the property collection, it will be added.
  * @param  {String} key   The property name (key).
  * @param  {String} value The value to assign to the property.
  */
  this.setProperty = function(key, value) {
    _base.setProperty(key, value);
  };

  /**
  * Removes all event listeners.
  * @override
  */
  this.removeAllListeners = function() {
    _base.removeAllListeners();
  };

  /**
  * Attaches a listener (callback) for the specified event name.
  * @param  {String}   evt      The name of the event.
  * @param  {Function} callback The callback function to execute when the
  * event is raised.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @override
  */
  this.on = function(evt, callback) {
    _base.on(evt, callback);
  };

  /**
  * Emits the specified event.
  * @param  {String} evt  The name of the event to emit.
  * @param  {Object} args The object that provides arguments to the event.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @override
  */
  this.emit = function(evt, args) {
    _base.emit(evt, args);
  };

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

    _base.onFireplaceStateChange(stateChangeEvent);
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
  * Gets a value indicating whether the fireplace is on.
  * @return {Boolean} true if the fireplace is on; Otherwise, false.
  * @override
  */
  this.isOn = function() {
    return (self.getState() === FireplaceState.On);
  };

  /**
  * Gets a value indicating whether the fireplace is off.
  * @return {Boolean} true if the fireplace is off; Otherwise, false.
  * @override
  */
  this.isOff = function() {
    return (self.getState() === FireplaceState.Off);
  };

  /**
  * Gets the timeout delay.
  * @return {Number} The timeout delay.
  * @override
  */
  this.getTimeoutDelay = function() {
    return _base.getTimeoutDelay();
  };

  /**
  * Gets the timeout unit of time.
  * @return {TimeUnit} Gets the time unit being used for the timeout delay.
  * @override
  */
  this.getTimeoutUnit = function() {
    return _base.getTimeoutUnit();
  };

  /**
  * Fires the state change event.
  * @param  {FireplaceStateChangeEvent} stateChangeEvent The event object.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @override
  */
  this.onFireplaceStateChange = function(stateChangeEvent) {
    _base.onFireplaceStateChange(stateChangeEvent);
  };

  /**
  * Fires the operation timeout event.
  * @param  {FireplaceTimeoutEvent} timeoutEvent The event object.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @override
  */
  this.onOperationTimeout = function(timeoutEvent) {
    _base.onOperationTimeout(timeoutEvent);
  };

  /**
  * Fires the pilot light state change event.
  * @param  {FireplacePilotLightEvent} pilotStateEvent The event object.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @override
  */
  this.onPilotLightStateChange = function(pilotStateEvent) {
    _base.onPilotLightStateChange(pilotStateEvent);
  };

  /**
  * Cancels the timeout (if running).
  * @override
  */
  this.cancelTimeout = function() {
    _base.cancelTimeout();
  };

  /**
  * Turns the fireplace off.
  * @override
  */
  this.turnOff = function() {
    self.setState(FireplaceState.Off);
  };

  /**
  * Sets the timeout delay.
  * @param  {Number} delay   The timeout delay.
  * @param  {TimeUnit} unit  The time unit of measure for the timeout.
  * @throws {InvalidOperationException} if the fireplace is turned off.
  * @override
  */
  this.setTimeoutDelay = function(delay, unit) {
    _base.setState(self.getState());
    _base.setTimeoutDelay(delay, unit);
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
    _base.onPilotLightStateChange(evt);
  };

  if (!util.isNullOrUndefined(_pilotLightSensor)) {
    _pilotLightSensor.on(Sensor.EVENT_STATE_CHANGED, internalHandleSensorStateChange);
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
  this.turnOn = function(timeoutDelay, timeoutUnit) {
    self.setState(FireplaceState.On);
    if (util.isNullOrUndefined(timeoutUnit)) {
      timeoutUnit = _base.getTimeoutUnit();
    }

    if (!util.isNullOrUndefined(timeoutDelay)) {
      if (timeoutDelay > 0) {
        self.setTimeoutDelay(timeoutDelay, timeoutUnit);
      }
    }
  };

  /**
  * Shutdown the fireplace.
  * @override
  */
  this.shutdown = function() {
    self.cancelTimeout();
    self.turnOff();
  };

  /**
  * Releases all resources used by the FireplaceDevice object.
  * @override
  */
  this.dispose = function() {
    if (_base.isDisposed()) {
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

    _base.dispose();
  };
}

FireplaceDevice.prototype.constructor = FireplaceDevice;
inherits(FireplaceDevice, FireplaceBase);

module.exports = FireplaceDevice;
