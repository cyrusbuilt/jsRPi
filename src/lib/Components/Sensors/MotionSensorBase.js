"use strict";
//
//  MotionSensorBase.js
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
const MotionSensor = require('./MotionSensor.js');
const ComponentBase = require('../ComponentBase.js');
const EventEmitter = require('events').EventEmitter;
const ArgumentNullException = require('../../ArgumentNullException.js');
const ObjectDisposedException = require('../../ObjectDisposedException.js');

/**
 * @classdesc Base class for motion sensor abstraction components.
 * @implements {MotionSensor}
 * @extends {ComponentBase}
 * @extends {EventEmitter}
 */
class MotionSensorBase extends MotionSensor {
  /**
   * Initializes a new instance of the jsrpi.Components.Sensors.MotionSensorBase
   * class with the pin the motion sensor is attached to.
   * @param {Gpio} pin The input pin to check for motion on.
   * @throws {ArgumentNullException} if pin is null or undefined.
   * @constructor
   */
  constructor(pin) {
    super();

    if (util.isNullOrUndefined(pin)) {
      throw new ArgumentNullException("'pin' cannot be null or undefined.");
    }

    this._base = new ComponentBase();
    this._emitter = new EventEmitter();
    this._lastMotion = null;
    this._lastInactive = null;
    this._pin = pin;
    this._pin.provision();
  }

  /**
   * Gets or sets the name of this component.
   * @property {String} componentName - The component name.
   * @override
   */
  get componentName() {
    return this._base.componentName;
  }

  set componentName(name) {
    this._base.componentName = name;
  }

  /**
   * Gets the object this component is tagged with.
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
   * @param  {String} key The key name of the property to check for.
   * @return {Boolean}    true if the property collection contains the key;
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
   * @override
   */
  setProperty(key, value) {
    this._base.setProperty(key, value);
  }

  /**
   * Determines whether or not this instance has been disposed.
   * @property {Boolean} isDisposed - true if disposed; Otherwise, false.
   * @readonly
   * @override
   */
  get isDisposed() {
    return this._base.isDisposed;
  }

  /**
   * In subclasses, performs application-defined tasks associated with freeing,
   * releasing, or resetting resources.
   * @override
   */
  dispose() {
    if (this._base.isDisposed) {
      return;
    }

    if (!util.isNullOrUndefined(this._pin)) {
      this._pin.dispose();
      this._pin = undefined;
    }

    this._lastMotion = null;
    this._lastInactive = null;
    this._emitter.removeAllListeners();
    this._emitter = undefined;
    this._base.dispose();
  }

  /**
   * Removes all event listeners.
   * @override
   */
  removeAllListeners() {
    if (!this._base.isDisposed) {
      this._emitter.removeAllListeners();
    }
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
    if (this._base.isDisposed) {
      throw new ObjectDisposedException("GpioBase");
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
    if (this._base.isDisposed) {
      throw new ObjectDisposedException("GpioBase");
    }
    this._emitter.emit(evt, args);
  }

  /**
   * gets the timestamp of the last time motion was detected.
   * @property {Date} lastMotionTimestamp - The last time motion was detected.
   * @readonly
   * @override
   */
  get lastMotionTimestamp() {
    return this._lastMotion;
  }

  /**
   * The last inactivity timestamp.
   * @property {Date} lastInactivityTimestamp - The last time the sensor went idle.
   * @readonly
   * @override
   */
  get lastInactivityTimestamp() {
    return this._lastInactive;
  }

  /**
   * Gets the pin being used to sample sensor data.
   * @property {Gpio} pin - The underlying physical pin.
   * @readonly
   */
  get pin() {
    return this._pin;
  }

  /**
   * Converts the current instance to it's string representation. This method
   * simply returns the component name.
   * @return {String} The component name.
   * @override
   */
  toString() {
    return this.componentName;
  }

  /**
   * Fires the motion state changed event.
   * @param  {MotionDetectedEvent} motionEvent The motion detected event object.
   * @override
   */
  onMotionStateChanged(motionDetectedEvent) {
    if (this.isDisposed) {
      throw new ObjectDisposedException("MotionSensorBase");
    }

    if (motionDetectedEvent.isMotionDetected) {
      this._lastMotion = new Date();
    }
    else {
      this._lastInactive = new Date();
    }

    setImmediate(() => {
      this.emit(MotionSensor.EVENT_MOTION_STATE_CHANGED, motionDetectedEvent);
    });
  }
}

module.exports = MotionSensorBase;
