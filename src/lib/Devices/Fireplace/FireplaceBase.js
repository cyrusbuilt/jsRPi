"use strict";
//
//  FireplaceBase.js
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
const timespan = require('timespan');
const FireplaceInterface = require('./FireplaceInterface.js');
const FireplaceState = require('./FireplaceState.js');
const FireplaceTimeoutEvent = require('./FireplaceTimeoutEvent.js');
const DeviceBase = require('../DeviceBase.js');
const EventEmitter = require('events').EventEmitter;
const TimeUnit = require('../../PiSystem/TimeUnit.js');
const InvalidOperationException = require('../../InvalidOperationException.js');
const SystemInfo = require('../../PiSystem/SystemInfo.js');
const ObjectDisposedException = require('../../ObjectDisposedException.js');

/**
* @classdesc Base class for fireplace device abstractions.
* @implements {FireplaceInterface}
* @extends {DeviceBase}
* @extends {EventEmitter}
*/
class FireplaceBase extends FireplaceInterface {
  /**
   * Initializes a new instance of the jsrpi.Devices.Fireplace.FireplaceBase
   * class.
   * @constructor
   */
  constructor() {
    super();

    this._base = new DeviceBase();
    this._emitter = new EventEmitter();
    this._timeoutDelay = 0;
    this._timeoutDelayMillis = 0;
    this._timeoutUnit = TimeUnit.Minutes;
    this._backgroundTaskTimer = null;
    this._killTimer = null;
    this._state = FireplaceState.Off;
    this.on(FireplaceInterface.EVENT_STATE_CHANGED, (evt) => {
        this._internalStateChangeHandler(evt);
    });
  }

  /**
   * Gets or sets the device name
   * @property {String} deviceName - The name of the device.
   * @override
   */
  get deviceName() {
    return this._base.deviceName;
  }

  set deviceName(name) {
    this._base.deviceName = name;
  }

  /**
   * Gets or sets the object this device is tagged with.
   * @property {Object} tag - The tag.
   * @override
   */
  get tag() {
    return this._base.tag;
  }

  set tag(t) {
    this._base.tag = t;
  }

  /**
  * Determines whether or not the current instance has been disposed.
  * @property {Boolean} isDisposed - true if disposed; Otherwise, false.
  * @readonly
  * @override
  */
  get isDisposed () {
    return this._base.isDisposed;
  }

  /**
  * Gets the custom property collection.
  * @property {Array} propertyCollection - The property collection.
  * @readonly
  * @override
  */
  get propertyCollection() {
    return this._base.propertyCollection;
  }

  /**
  * Checks to see if the property collection contains the specified key.
  * @param  {String}  key The key name of the property to check for.
  * @return {Boolean} true if the property collection contains the key;
  * Otherwise, false.
  * @override
  */
  hasProperty(key) {
    return this._base.hasProperty(key);
  }

  /**
  * Sets the value of the specified property. If the property does not already exist
  * in the property collection, it will be added.
  * @param  {String} key   The property name (key).
  * @param  {String} value The value to assign to the property.
  */
  setProperty(key, value) {
    this._base.setProperty(key, value);
  }

  /**
  * Removes all event listeners.
  * @override
  */
  removeAllListeners() {
    this._emitter.removeAllListeners();
  }

  /**
  * Attaches a listener (callback) for the specified event name.
  * @param  {String}   evt      The name of the event.
  * @param  {Function} callback The callback function to execute when the
  * event is raised.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @override
  */
  on(evt, callback) {
    if (this.isDisposed) {
      throw new ObjectDisposedException("OpenerBase");
    }
    this._emitter.on(evt, callback);
  }

  /**
  * Emits the specified event.
  * @param  {String} evt  The name of the event to emit.
  * @param  {Object} args The object that provides arguments to the event.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @override
  */
  emit(evt, args) {
    if (this.isDisposed) {
      throw new ObjectDisposedException("OpenerBase");
    }
    this._emitter.emit(evt, args);
  }

  /**
  * Gets or sets the fireplace state.
  * @property {FireplaceState} state - The opener state.
  * @override
  */
  get state() {
    return this._state;
  }

  set state(s) {
    this._state = s;
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
  * Gets the timeout delay.
  * @return {Number} The timeout delay.
  * @override
  */
  getTimeoutDelay() {
    return this._timeoutDelay;
  }

  /**
  * Gets the timeout unit of time.
  * @return {TimeUnit} Gets the time unit being used for the timeout delay.
  * @override
  */
  getTimeoutUnit() {
    return this._timeoutUnit;
  }

  /**
  * Fires the state change event.
  * @param  {FireplaceStateChangeEvent} stateChangeEvent The event object.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @override
  */
  onFireplaceStateChange(stateChangeEvent) {
    if (this.isDisposed) {
      throw new ObjectDisposedException("FireplaceBase");
    }

    setImmediate(() => {
      this.emit(FireplaceInterface.EVENT_STATE_CHANGED, stateChangeEvent);
    });
  }

  /**
  * Fires the operation timeout event.
  * @param  {FireplaceTimeoutEvent} timeoutEvent The event object.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @override
  */
  onOperationTimeout(timeoutEvent) {
    if (this.isDisposed) {
      throw new ObjectDisposedException("FireplaceBase");
    }

    setImmediate(() => {
      this.emit(FireplaceInterface.EVENT_OPERATION_TIMEOUT, timeoutEvent);
    });
  }

  /**
  * Fires the pilot light state change event.
  * @param  {FireplacePilotLightEvent} pilotStateEvent The event object.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @override
  */
  onPilotLightStateChange(pilotStateEvent) {
    if (this.isDisposed) {
      throw new ObjectDisposedException("FireplaceBase");
    }

    setImmediate(() => {
      this.emit(FireplaceInterface.EVENT_PILOT_LIGHT_STATE_CHANGED, pilotStateEvent);
    });
  }

  /**
  * Cancels the timeout task (if running).
  * @private
  */
  _cancelTimeoutTask() {
    if (!util.isNullOrUndefined(this._backgroundTaskTimer)) {
      clearInterval(this._backgroundTaskTimer);
      this._backgroundTaskTimer = null;
    }
  }

  /**
  * An internal handler for the state change event.
  * @param  {FireplaceStateChangeEvent} stateChangeEvent The event object.
  * @private
  */
  _internalStateChangeHandler(stateChangeEvent) {
    this._cancelTimeoutTask();
  }

  /**
  * Cancels the timeout (if running).
  * @override
  */
  cancelTimeout() {
    this._cancelTimeoutTask();
  }

  /**
  * Gurns the fireplace off.
  * @override
  */
  turnOff() {
    this.state = FireplaceState.Off;
  }

  /**
  * The action for the background timeout task. This fires the operation
  * timeout event, then turns off the fireplace.
  * @private
  */
  _taskAction() {
    let evt = new FireplaceTimeoutEvent();
    this.onOperationTimeout(evt);
    if (!evt.isHandled) {
      this.turnOff();
    }
  }

  /**
  * Starts the background cancellation task.
  * @protected
  */
  _startCancelTask() {
    if (!util.isNullOrUndefined(this._killTimer)) {
      this._backgroundTaskTimer = setInterval(() => {
        this._taskAction();
        clearInterval(this._killTimer);
      }, this._timeoutDelayMillis);
    }
  }

  /**
  * Sets the timeout delay.
  * @param  {Number} delay   The timeout delay.
  * @param  {TimeUnit} unit  The time unit of measure for the timeout.
  * @throws {InvalidOperationException} if the fireplace is turned off.
  * @override
  */
  setTimeoutDelay(delay, unit) {
    if (this.isOff) {
      throw new InvalidOperationException("Cannot set timeout when the fireplace is off.");
    }

    this._timeoutDelay = delay;
    this._timeoutUnit = unit;

    this.cancelTimeout();

    if (this._timeoutDelay > 0) {
      let waitTime = new timespan.TimeSpan(0, 0, 0, 0, 0);
      switch (unit) {
        case TimeUnit.Days:
          waitTime = timespan.fromDays(delay);
          break;
        case TimeUnit.Hours:
          waitTime = timespan.fromHours(delay);
          break;
        case TimeUnit.Minutes:
          waitTime = timespan.fromMinutes(delay);
          break;
        case TimeUnit.Seconds:
          waitTime = timespan.fromSeconds(delay);
          break;
        case TimeUnit.Milliseconds:
          waitTime = timespan.fromMilliseconds(delay);
          break;
        default:
          break;
      }

      let killDelay = timespan.fromMilliseconds(SystemInfo.getCurrentTimeMillis());
      killDelay.addSeconds(1);
      this._killTimer = setInterval(() => {
          this._cancelTimeoutTask();
      }, killDelay.milliseconds);
      this._startCancelTask();
    }
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
    timeoutUnit = timeoutUnit || this._timeoutUnit;
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
    this.cancelTimeout();
    this.turnOff();
  }

  /**
  * Releases all resources used by the FireplaceBase object.
  * @override
  */
  dispose() {
    if (this.isDisposed) {
      return;
    }

    this._cancelTimeoutTask();
    if (!util.isNullOrUndefined(this._killTimer)) {
      clearInterval(this._killTimer);
      this._killTimer = undefined;
    }

    this._emitter.removeAllListeners();
    this._emitter = undefined;
    this._base.dispose();
  }
}

module.exports = FireplaceBase;
