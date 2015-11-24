"use strict";
//
//  OpenerDevice.js
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
var OpenerBase = require('./OpenerBase.js');
var OpenerState = require('./OpenerState.js');
var OpenerStateChangeEvent = require('./OpenerStateChangeEvent.js');
var OpenerLockChangeEvent = require('./OpenerLockChangeEvent.js');
var OpenerLockedException = require('./OpenerLockedException.js');
var Relay = require('../../Components/Relays/Relay.js');
var Sensor = require('../../Components/Sensors/Sensor.js');
var SensorState = require('../../Components/Sensors/SensorState.js');
var Switch = require('../../Components/Switches/Switch.js');
var SwitchState = require('../../Components/Switches/SwitchState.js');
var ArgumentNullException = require('../../ArgumentNullException.js');
var ObjectDisposedException = require('../../ObjectDisposedException.js');

/**
* @classdesc A device that is an abstraction of a door opener (such as a garage
* door opener). This is an implementation of the OpenerBase.
* @param {Relay} relay       The relay that controls the opener.
* @param {Sensor} sensor     The reading the state of the opener.
* @param {SensorState} openState The sensor state that indicates the opener has
* opened.
* @param {Switch} lok        The switch that controls the lock (optional).
* @throws {ArgumentNullException} if 'relay' or 'sensor' params are null or
* undefined.
* @constructor
* @extends {OpenerBase}
*/
function OpenerDevice(relay, sensor, openState, lok) {
  OpenerBase.call(this);
  
  if (util.isNullOrUndefined(relay)) {
    throw new ArgumentNullException("'relay' param cannot be null or undefined.");
  }

  if (util.isNullOrUndefined(sensor)) {
    throw new ArgumentNullException("'sensor' param cannot be null or undefined.");
  }

  var self = this;
  var _base = new OpenerBase();
  var _relay = relay;
  var _sensor = sensor;
  var _lock = lok;
  var _overridedLockState = SwitchState.Off;
  var _lockOverride = false;
  var _openState = openState;
  if (util.isNullOrUndefined(_openState)) {
    _openState = SensorState.Closed;
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
  * Gets relay being used to trigger the opener motor.
  * @returns {Relay} The relay used to the trigger the opener motor.
  */
  this.getTriggerRelay = function() {
    return _relay;
  };

  /**
  * Gets the sensor used to determine the opener's state.
  * @returns {Sensor} The sensor used to determine the state.
  */
  this.getStateSensor = function() {
    return _sensor;
  };

  /**
  * Gets the switch being used to lock the opener.
  * @returns {Switch} Switch used to enable/disable the lock.
  */
  this.getLockSwitch = function() {
    return _lock;
  };

  /**
  * Determines whether or not the current instance has been disposed.
  * @return {Boolean} true if disposed; Otherwise, false.
  * @override
  */
  this.isDisposed = function() {
    return _base.isDisposed();
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
  * Raises the opener state change event.
  * @param  {OpenerStateChangeEvent} stateChangeEvent The event object.
  * @override
  */
  this.onOpenerStateChange = function(stateChangeEvent) {
    _base.onOpenerStateChange(stateChangeEvent);
  };

  /**
  * Raises the lock state change event.
  * @param  {OpenerLockChangeEvent} lockStateChangeEvent The event object.
  * @override
  */
  this.onLockStateChange = function(lockStateChangeEvent) {
    _base.onLockStateChange(lockStateChangeEvent);
  };

  /**
  * Gets the state of the opener based on the specified sensor state.
  * @param  {SensorState} sensState The sensor state.
  * @return {OpenerState} The opener state.
  * @protected
  */
  this._getOpenerState = function(sensState) {
    if (sensState === _openState) {
      return OpenerState.Open;
    }
    return OpenerState.Closed;
  };

  /**
  * Handles the lock state changed.
  * @param  {SwitchStateChangeEvent} switchStateEvent The event object.
  * @private
  */
  var handleLockStateChanged = function(switchStateEvent) {
    if (!_lockOverride) {
      var evt = new OpenerLockChangeEvent(_lock.isOn());
      _base.onLockStateChange(evt);
    }
  };

  if (!util.isNullOrUndefined(_lock)) {
    _lock.on(Switch.EVENT_STATE_CHANGED, handleLockStateChanged);
    _lock.poll();
  }

  /**
  * Releases all resources used by the OpenerDevice object.
  * @override
  */
  this.dispose = function() {
    if (_base.isDisposed()) {
      return;
    }

    if (!util.isNullOrUndefined(_relay)) {
      _relay.dispose();
      _relay = undefined;
    }

    if (!util.isNullOrUndefined(_sensor)) {
      _sensor.dispose();
      _sensor = undefined;
    }

    if (!util.isNullOrUndefined(_lock)) {
      _lock.dispose();
      _lock = undefined;
    }

    _base.dispose();
  };

  /**
  * Gets a value indicating whether this opener is locked and thus, cannot be
  * opened.
  * @return {Boolean} true if locked; Otherwise, false.
  *                    @override
  */
  this.isLocked = function() {
    if (_lockOverride) {
      return (_overridedLockState === SwitchState.On);
    }
    else {
      if (util.isNullOrUndefined(_lock)) {
        return false;
      }
      return _lock.isOn();
    }
  };

  /**
  * Gets the state of this opener.
  * @return {OpenerState} The state of the opener.
  * @override
  */
  this.getState = function() {
    // TODO handle the case of isOpening and isClosing
    if (_sensor.getState() === _openState) {
      return OpenerState.Open;
    }
    return OpenerState.Closed;
  };

  /**
  * Gets a value indicating whether this opener is open.
  * @return {Boolean} true if open; Otherwise, false.
  *                    @override
  */
  this.isOpen = function() {
    return (self.getState() === OpenerState.Open);
  };

  /**
  * Fets a value indicating whether this opner is in the the process of opening.
  * @return {Boolean} true if opening; Otherwise, false.
  * @override
  */
  this.isOpening = function() {
    return (self.getState() === OpenerState.Opening);
  };

  /**
  * Fets a value indicating whether this opener is closed.
  * @return {Boolean} true if closed; Otherwise, false.
  * @override
  */
  this.isClosed = function() {
    return (self.getState() === OpenerState.Closed);
  };

  /**
  * Fets a value indicating whether this opener is in the process of closing.
  * @return {Boolean} true if closing; Otherwise, false.
  * @override
  */
  this.isClosing = function() {
    return (self.getState() === OpenerState.Closing);
  };

  /**
  * Returns the string representation of this object. In this case, it simply
  * returns the component name.
  * @return {String} The name of this component.
  */
  this.toString = function() {
    return self.deviceName;
  };

  /**
  * Instructs the device to open.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @throws {OpenerLockedException} If the opener is currently locked.
  * @override
  */
  this.open = function() {
    if (_base.isDisposed()) {
      throw new ObjectDisposedException("OpenerDevice");
    }

    if (self.isLocked()) {
      throw new OpenerLockedException(self.deviceName);
    }

    if (!_sensor.isState(_openState)) {
      _relay.pulse();
      setTimeout(function() {
        if (_sensor.getState() === _openState) {
          var evt = new OpenerStateChangeEvent(OpenerState.Closed, OpenerState.Open);
          _base.onOpenerStateChange(evt);
        }
      }, 200);
    }
  };

  /**
  * Instructs the device to close.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @throws {OpenerLockedException} If the opener is currently locked.
  * @override
  */
  this.close = function() {
    if (_base.isDisposed()) {
      throw new ObjectDisposedException("OpenerDevice");
    }

    if (self.isLocked()) {
      throw new OpenerLockedException(self.deviceName);
    }

    if (_sensor.isState(_openState)) {
      _relay.pulse();
      setTimeout(function() {
        if (_sensor.getState() !== _openState) {
          var evt = new OpenerStateChangeEvent(OpenerState.Open, OpenerState.Closed);
          _base.onOpenerStateChange(evt);
        }
      }, 200);
    }
  };

  /**
  * Manually overrides the state of the lock. This can be used to force lock or
  * force unlock the opener. This will cause this opener to ignore the state of
  * the lock (if specified) and only read the specified lock state.
  * @param  {SwitchState} overridedState The state to override with.
  */
  this.overrideLock = function(overridedState) {
    _overridedLockState = overridedState;
    _lockOverride = true;
  };

  /**
  * Disables the lock override. This will cause this opener to resume reading
  * the actual state of the lock (if specified).
  */
  this.disableOverride = function() {
    _lockOverride = false;
  };
}

OpenerDevice.prototype.constructor = OpenerDevice;
inherits(OpenerDevice, OpenerBase);

module.exports = OpenerDevice;
