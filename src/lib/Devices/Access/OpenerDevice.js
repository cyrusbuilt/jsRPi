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

const util = require('util');
const OpenerBase = require('./OpenerBase.js');
const OpenerState = require('./OpenerState.js');
const OpenerStateChangeEvent = require('./OpenerStateChangeEvent.js');
const OpenerLockChangeEvent = require('./OpenerLockChangeEvent.js');
const OpenerLockedException = require('./OpenerLockedException.js');
const Relay = require('../../Components/Relays/Relay.js');
const Sensor = require('../../Components/Sensors/Sensor.js');
const SensorState = require('../../Components/Sensors/SensorState.js');
const Switch = require('../../Components/Switches/Switch.js');
const SwitchState = require('../../Components/Switches/SwitchState.js');
const ArgumentNullException = require('../../ArgumentNullException.js');
const ObjectDisposedException = require('../../ObjectDisposedException.js');

/**
* @classdesc A device that is an abstraction of a door opener (such as a garage
* door opener). This is an implementation of the OpenerBase.
* @extends {OpenerBase}
*/
class OpenerDevice extends OpenerBase {
  /**
   * Initalizes a new instance of the jsrpi.Devices.Access.OpenerDevice class
   * with the trigger relay, state detection sensor, the sensor state that is
   * used to consider the door 'open' and an optional switch used to control the
   * lock.
   * @param {Relay} relay       The relay that controls the opener.
   * @param {Sensor} sensor     The reading the state of the opener.
   * @param {SensorState} openState The sensor state that indicates the opener
   * has opened.
   * @param {Switch} lok        The switch that controls the lock (optional).
   * @throws {ArgumentNullException} if 'relay' or 'sensor' params are null or
   * undefined.
   * @constructor
   */
  constructor(relay, sensor, openState, lok) {
    super();

    if (util.isNullOrUndefined(relay)) {
      throw new ArgumentNullException("'relay' param cannot be null or undefined.");
    }

    if (util.isNullOrUndefined(sensor)) {
      throw new ArgumentNullException("'sensor' param cannot be null or undefined.");
    }

    this._relay = relay;
    this._sensor = sensor;
    this._overridedLockState = SwitchState.Off;
    this._lockOverride = false;

    this._openState = openState;
    if (util.isNullOrUndefined(this._openState)) {
      this._openState = SensorState.Closed;
    }

    this._lock = lok;
    if (!util.isNullOrUndefined(this._lock)) {
      this._lock.on(Switch.EVENT_STATE_CHANGED, (evt) => {
          this._handleLockStateChanged(evt);
      });
      this._lock.poll();
    }
  }

  /**
  * Gets relay being used to trigger the opener motor.
  * @property {Relay} triggerRelay - The trigger relay.
  * @readonly
  */
  get triggerRelay() {
    return this._relay;
  }

  /**
  * Gets the sensor used to determine the opener's state.
  * @property {Sensor} stateSensor - The state sensor.
  * @readonly
  */
  get stateSensor() {
    return this._sensor;
  }

  /**
  * Gets the switch being used to lock the opener.
  * @property {Switch} lockSwitch - The lock switch.
  * @readonly
  */
  get lockSwitch() {
    return this._lock;
  }

  /**
  * Gets the state of the opener based on the specified sensor state.
  * @param  {SensorState} sensState The sensor state.
  * @return {OpenerState} The opener state.
  * @protected
  */
  _getOpenerState(sensState) {
    if (this._openState === sensState) {
      return OpenerState.Open;
    }
    return OpenerState.Closed;
  }

  /**
  * Handles the lock state changed.
  * @param  {SwitchStateChangeEvent} switchStateEvent The event object.
  * @private
  */
  _handleLockStateChanged(switchStateEvent) {
    if (!this._lockOverride) {
      var evt = new OpenerLockChangeEvent(this._lock.isOn);
      this.onLockStateChange(evt);
    }
  }

  /**
  * Releases all resources used by the OpenerDevice object.
  * @override
  */
  dispose() {
    if (this.isDisposed) {
      return;
    }

    if (!util.isNullOrUndefined(this._relay)) {
      this._relay.dispose();
      this._relay = undefined;
    }

    if (!util.isNullOrUndefined(this._sensor)) {
      this._sensor.dispose();
      this._sensor = undefined;
    }

    if (!util.isNullOrUndefined(this._lock)) {
      this._lock.dispose();
      this._lock = undefined;
    }

    super.dispose();
  }

  /**
  * Gets a value indicating whether this opener is locked and thus, cannot be
  * opened.
  * @property {Boolean} isLocked - true if locked; Otherwise, false.
  * @readonly
  * @override
  */
  get isLocked() {
    if (this._lockOverride) {
      return (this._overridedLockState === SwitchState.On);
    }
    else {
      if (util.isNullOrUndefined(this._lock)) {
        return false;
      }
      return this._lock.isOn;
    }
  }

  /**
  * Gets the state of this opener.
  * @property {OpenerState} state - The opener state.
  * @override
  */
  get state() {
    // TODO handle the case of isOpening and isClosing
    if (this._sensor.state === this._openState) {
      return OpenerState.Open;
    }
    return OpenerState.Closed;
  }

  /**
  * Gets a value indicating whether this opener is open.
  * @property {Boolean} isOpen - true if open; Otherwise, false.
  * @readonly
  * @override
  */
  get isOpen() {
    return (this.state === OpenerState.Open);
  }

  /**
  * Gets a value indicating whether this opner is in the the process of opening.
  * @property {Boolean} isOpening - true if opening; Otherwise, false.
  * @readonly
  * @override
  */
  get isOpening() {
    return (this.state === OpenerState.Opening);
  }

  /**
  * Gets a value indicating whether this opener is closed.
  * @property {Boolean} isClosed - true if closed; Otherwise, false.
  * @readonly
  * @override
  */
  get isClosed() {
    return (this.state === OpenerState.Closed);
  }

  /**
  * Gets a value indicating whether this opener is in the process of closing.
  * @property {Boolean} isClosing - true if closing; Otherwise, false.
  * @readonly
  * @override
  */
  get isClosing() {
    return (this.state === OpenerState.Closing);
  }

  /**
  * Instructs the device to open.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @throws {OpenerLockedException} If the opener is currently locked.
  * @override
  */
  open() {
    if (this.isDisposed) {
      throw new ObjectDisposedException("OpenerDevice");
    }

    if (this.isLocked) {
      throw new OpenerLockedException(this.deviceName);
    }

    if (!this._sensor.isState(this._openState)) {
      this._relay.pulse();
      setTimeout(() => {
        if (this._sensor.state === this._openState) {
          let evt = new OpenerStateChangeEvent(OpenerState.Closed, OpenerState.Open);
          this.onOpenerStateChange(evt);
        }
      }, 200);
    }
  }

  /**
  * Instructs the device to close.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @throws {OpenerLockedException} If the opener is currently locked.
  * @override
  */
  close() {
    if (this.isDisposed) {
      throw new ObjectDisposedException("OpenerDevice");
    }

    if (this.isLocked) {
      throw new OpenerLockedException(this.deviceName);
    }

    if (this._sensor.isState(this._openState)) {
      this._relay.pulse();
      setTimeout(() => {
        if (this._sensor.state !== this._openState) {
          let evt = new OpenerStateChangeEvent(OpenerState.Open, OpenerState.Closed);
          this.onOpenerStateChange(evt);
        }
      }, 200);
    }
  }

  /**
  * Manually overrides the state of the lock. This can be used to force lock or
  * force unlock the opener. This will cause this opener to ignore the state of
  * the lock (if specified) and only read the specified lock state.
  * @param  {SwitchState} overridedState The state to override with.
  */
  overrideLock(overridedState) {
    this._overridedLockState = overridedState;
    this._lockOverride = true;
  }

  /**
  * Disables the lock override. This will cause this opener to resume reading
  * the actual state of the lock (if specified).
  */
  disableOverride() {
    this._lockOverride = false;
  }
}

module.exports = OpenerDevice;
