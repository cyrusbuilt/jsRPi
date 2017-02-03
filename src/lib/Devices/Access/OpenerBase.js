"use strict";
//
//  OpenerBase.js
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

const Opener = require('./Opener.js');
const DeviceBase = require('../DeviceBase.js');
const EventEmitter = require('events').EventEmitter;
const OpenerStateChangeEvent = require('./OpenerStateChangeEvent.js');
const OpenerLockChangeEvent = require('./OpenerLockChangeEvent.js');
const OpenerState = require('./OpenerState.js');
const ObjectDisposedException = require('../../ObjectDisposedException.js');

/**
* @classdesc Base class for opener device abstractions.
* @implements {Opener}
* @extends {DeviceBase}
* @extends {EventEmitter}
*/
class OpenerBase extends Opener {
  /**
   * Initializes a new instance of the jsrpi.Devices.Access.OpenerBase class.
   * @constructor
   */
  constructor() {
    super();

    this._base = new DeviceBase();
    this._emitter = new EventEmitter();
    this._state = OpenerState.Closed;
  }

  /**
   * Gets or sets the device name.
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
  * Raises the opener state change event.
  * @param  {OpenerStateChangeEvent} stateChangeEvent The event object.
  * @override
  */
  onOpenerStateChange(stateChangeEvent) {
    if (this.isDisposed) {
      throw new ObjectDisposedException("OpenerBase");
    }

    setImmediate(() => {
      this.emit(Opener.EVENT_STATE_CHANGED, stateChangeEvent);
    });
  }

  /**
  * Gets the state of this opener.
  * @property {OpenerState} state - The opener state.
  * @override
  */
  get state() {
    return this._state;
  }

  /**
  * Raises the lock state change event.
  * @param  {OpenerLockChangeEvent} lockStateChangeEvent The event object.
  * @override
  */
  onLockStateChange(lockStateChangeEvent) {
    if (this.isDisposed) {
      throw new ObjectDisposedException("OpenerBase");
    }

    setImmediate(() => {
      this.emit(Opener.EVENT_LOCK_STATE_CHANGED, lockStateChangeEvent);
    });
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
  * Fets a value indicating whether this opner is in the the process of opening.
  * @property {Boolean} isOpening - true if opening; Otherwise, false.
  * @readonly
  * @override
  */
  get isOpening() {
    return (this.state === OpenerState.Opening);
  }

  /**
  * Fets a value indicating whether this opener is closed.
  * @property {Boolean} isClosed - true if closed; Otherwise, false.
  * @readonly
  * @override
  */
  get isClosed() {
    return (this.state === OpenerState.Closed);
  }

  /**
  * Fets a value indicating whether this opener is in the process of closing.
  * @property {Boolean} isClosing - true if closing; Otherwise, false.
  * @readonly
  * @override
  */
  get isClosing() {
    return (this.state === OpenerState.Closing);
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
  * Releases all resources used by the GpioBase object.
  * @override
  */
  dispose() {
    if (this.isDisposed) {
      return;
    }

    this._emitter.removeAllListeners();
    this._emitter = undefined;
    this._state = OpenerState.Closed;
    this._base.dispose();
  }
}

module.exports = OpenerBase;
