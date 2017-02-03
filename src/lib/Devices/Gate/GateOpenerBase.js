"use strict";
//
//  GateOpenerBase.js
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

const GateOpener = require('./GateOpener.js');
const OpenerDevice = require('../Access/OpenerDevice.js');
const ObjectDisposedException = require('../../ObjectDisposedException.js');

/**
* @classdesc Base class for gate opener abstractions.
* @implements {GateOpener}
* @extends {OpenerDevice}
*/
class GateOpenerBase extends GateOpener {
  /**
   * Initializes a new instance of the jsrpi.Devices.Gate.GateOpenerBase
   * class with the control relay, door sensor, lock switch, and the sensor
   * state used to consider the door open.
   * @param {Relay} relay                The relay that controls the door.
   * @param {Sensor} doorSensor          The sensor that indicates the state of
   * the door.
   * @param {SensorState} doorSensorOpenState The sensor state that indicates the
   * door is open.
   * @param {Switch} lok                 The switch that controls the lock.
   * @constructor
   */
  constructor(relay, doorSensor, doorSensorOpenState, lok) {
    super();
    
    this._base = new OpenerDevice(relay, doorSensor, doorSensorOpenState, lok);
  }

  /**
   * Gets or sets the device name
   * @property {String} deviceName - The device name.
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
  * Gets the relay being used to trigger the opener motor.
  * @property {Relay} triggerRelay - The trigger relay.
  * @readonly
  * @override
  */
  get triggerRelay() {
    return this._base.triggerRelay;
  }

  /**
  * Gets the sensor used to determine the opener's state.
  * @property {Sensor} stateSensor - The opener state sensor.
  * @readonly
  * @override
  */
  get stateSensor() {
    return this._base.stateSensor;
  }

  /**
  * Gets the switch being used to lock the opener.
  * @property {Switch} lockSwitch - The lock switch.
  * @readonly
  * @override
  */
  get lockSwitch() {
    return this._base.lockSwitch;
  }

  /**
  * Determines whether or not the current instance has been disposed.
  * @property {Boolean} isDisposed - true if disposed; Otherwise, false.
  * @readonly
  * @override
  */
  get isDisposed() {
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
    this._base.removeAllListeners();
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
      throw new ObjectDisposedException("GateOpenerBase");
    }
    this._base.on(evt, callback);
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
      throw new ObjectDisposedException("GateOpenerBase");
    }
    this._base.emit(evt, args);
  }

  /**
  * Raises the opener state change event.
  * @param  {OpenerStateChangeEvent} stateChangeEvent The event object.
  * @override
  */
  onOpenerStateChange(stateChangeEvent) {
    this._base.onOpenerStateChange(stateChangeEvent);
  }

  /**
  * Raises the lock state change event.
  * @param  {OpenerLockChangeEvent} lockStateChangeEvent The event object.
  * @override
  */
  onLockStateChange(lockStateChangeEvent) {
    this._base.onLockStateChange(lockStateChangeEvent);
  }

  /**
  * Releases all resources used by the OpenerDevice object.
  * @override
  */
  dispose() {
    this._base.dispose();
  }

  /**
  * Gets a value indicating whether this opener is locked and thus, cannot be
  * opened.
  * @property {Boolean} isLocked - true if locked; Otherwise, false.
  * @readonly
  * @override
  */
  get isLocked() {
    return this._base.isLocked;
  }

  /**
  * Gets the state of this opener.
  * @property {OpenerState} state - The state of the opener.
  * @override
  */
  get state() {
    return this._base.state;
  }

  /**
  * Gets a value indicating whether this opener is open.
  * @property {Boolean} isOpen - true if open; Otherwise, false.
  * @readonly
  * @override
  */
  get isOpen() {
    return this._base.isOpen;
  }

  /**
  * Fets a value indicating whether this opner is in the the process of opening.
  * @property {Boolean} isOpening - true if opening; Otherwise, false.
  * @readonly
  * @override
  */
  get isOpening() {
    return this._base.isOpening;
  }

  /**
  * Fets a value indicating whether this opener is closed.
  * @property {Boolean} isClosed - true if closed; Otherwise, false.
  * @readonly
  * @override
  */
  get isClosed() {
    return this._base.isClosed;
  }

  /**
  * Fets a value indicating whether this opener is in the process of closing.
  * @property {Boolean} isClosing - true if closing; Otherwise, false.
  * @readonly
  * @override
  */
  get isClosing() {
    return this._base.isClosing;
  }

  /**
  * Returns the string representation of this object. In this case, it simply
  * returns the component name.
  * @return {String} The name of this component.
  * @override
  */
  toString() {
    return this.deviceName;
  }

  /**
  * Instructs the device to open.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @throws {OpenerLockedException} If the opener is currently locked.
  * @override
  */
  open() {
    this._base.open();
  }

  /**
  * Instructs the device to close.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @throws {OpenerLockedException} If the opener is currently locked.
  * @override
  */
  close() {
    this._base.close();
  }

  /**
  * Manually overrides the state of the lock. This can be used to force lock or
  * force unlock the opener. This will cause this opener to ignore the state of
  * the lock (if specified) and only read the specified lock state.
  * @param  {SwitchState} overridedState The state to override with.
  * @override
  */
  overrideLock(overridedState) {
    this._base.overrideLock(overridedState);
  }

  /**
  * Disables the lock override. This will cause this opener to resume reading
  * the actual state of the lock (if specified).
  * @override
  */
  disableOverride() {
    this._base.disableOverride();
  }
}

module.exports = GateOpenerBase;
