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
  var _relay = relay;
  var _sensor = sensor;
  var _openState = openState || SensorState.Closed;
  var _lock = lok;
  var _overridedLockState = SwitchState.Off;
  var _lockOverride = false;

  /**
   * Gets the state of the opener based on the specified sensor state.
   * @param  {SensorState} sensState The sensor state.
   * @return {OpenerState}           The opener state.
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
    var evt = new OpenerLockChangeEvent(_lock.isOn());
    OpenerBase.prototype.onLockStateChange.call(this, evt);
  };

  /**
   * Handles the sensor state changed event.
   * @param  {SensorStateChangeEvent} stateChangeEvent The event object.
   * @private
   */
  var handleSensorStateChanged = function(stateChangeEvent) {
    var oldState = self._getOpenerState(stateChangeEvent.getOldState());
    var newState = self._getOpenerState(stateChangeEvent.getNewState());
    var evt = new OpenerStateChangeEvent(oldState, newState);
    OpenerBase.prototype.onOpenerStateChange.call(this, evt);
  };

  if (!util.isNullOrUndefined(_lock)) {
    _lock.on(Switch.EVENT_STATE_CHANGED, handleLockStateChanged);
  }

  /**
   * Releases all resources used by the OpenerDevice object.
   * @override
   */
  this.dispose = function() {
    if (OpenerBase.prototype.isDisposed.call(this)) {
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

    OpenerBase.prototype.dispose.call(this);
  };

  /**
   * Gets a value indicating whether this opener is locked and thus, cannot be
   * opened.
   * @return {Boolean} true if locked; Otherwise, false.
   * @override
   */
  this.isLocked = function() {
    if (_lockOverride) {
      return (_overridedLockState === SwitchState.On);
    }
    else {
      if (!util.isNullOrUndefined(_lock)) {
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
    if (_sensor.getState() === _openState) {
      return OpenerState.Open;
    }
    return OpenerState.Closed;
  };

  /**
   * Instructs the device to open.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @override
   */
  this.open = function() {
    if (self.isLocked()) {
      throw new OpenerLockedException(self.deviceName);
    }

    if (!_sensor.isState(_openState)) {
      _relay.pulse();
    }
  };

  /**
   * Instructs the device to close.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @override
   */
  this.close = function() {
    if (self.isLocked()) {
      throw new OpenerLockedException(self.deviceName);
    }

    if (_sensor.isState(_openState)) {
      _relay.pulse();
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

module.exports = OpenerBase;
