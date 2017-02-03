"use strict";
//
//  TemperatureSensorBase.js
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
const TemperatureSensor = require('./TemperatureSensor.js');
const ComponentBase = require('../ComponentBase.js');
const EventEmitter = require('events').EventEmitter;
const DS1620 = require('../../Sensors/DS1620.js');
const ArgumentNullException = require('../../ArgumentNullException.js');
const TemperatureConversion = require('./TemperatureConversion.js');
const TemperatureScale = require('./TemperatureScale.js');
const ObjectDisposedException = require('../../ObjectDisposedException.js');

/**
* @classdesc Base class for temperature sensor abstraction components.
* @implements {TemperatureSensor}
* @extends {ComponentBase}
* @extends {EventEmitter}
*/
class TemperatureSensorBase extends TemperatureSensor {
  /**
   * Initializes a new instance of the jsrpi.Components.Temperature.TemperatureSensorBase
   * class with the clock, data, and reset pins used to acquire data.
   * @param {Gpio} clock The GPIO pin used for the clock.
   * @param {Gpio} data  The GPIO pin used for data.
   * @param {Gpio} reset The GPIO pin used to trigger reset.
   * @throws {ArgumentNullException} in any of the pins are null or undefined.
   * @constructor
   */
  constructor(clock, data, reset) {
    super();

    if (util.isNullOrUndefined(clock)) {
      throw new ArgumentNullException("'clock' param cannot be null or undefined.");
    }

    if (util.isNullOrUndefined(data)) {
      throw new ArgumentNullException("'data' param cannot be null or undefined.");
    }

    if (util.isNullOrUndefined(reset)) {
      throw new ArgumentNullException("'reset' param cannot be null or undefined.");
    }

    this._base = new ComponentBase();
    this._emitter = new EventEmitter();
    this._rawTemp = 0;
    this._scale = TemperatureScale.Celcius;
    this._tempSensor = new DS1620(clock, data, reset);
  }

  /**
   * Gets or sets the name of this component.
   * @property {String} componentName - The name of the component.
   * @override
   */
  get componentName() {
    return this._base.componentName;
  }

  set componentName(name) {
    this._base.componentName = name;
  }

  /**
   * Gets or sets the object this component is tagged with.
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

    if (!util.isNullOrUndefined(this._tempSensor)) {
      this._tempSensor.dispose();
      this._tempSensor = undefined;
    }

    this._rawTemp = 0;
    this._scale = TemperatureScale.Celcius;
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
  * Gets the sensor geing used to measure.
  * @property {DS160} sensor - The temperature sensor.
  * @readonly
  * @override
  */
  get sensor() {
    return this._tempSensor;
  }

  /**
  * Fires the temperature change event.
  * @param  {TemperatureChangeEvent} tempChangeEvent The event object.
  * @override
  */
  onTemperatureChange(tempChangeEvent) {
    if (this._base.isDisposed) {
      throw new ObjectDisposedException("TemperatureSensorBase");
    }

    setImmediate(() => {
      this.emit(TemperatureSensor.EVENT_TEMPERATURE_CHANGED, tempChangeEvent);
    });
  }

  /**
  * Gets or sets the temperature scale.
  * @property {TemperatureScale} scale - The temperature scale.
  * @override
  */
  get scale() {
    return this._scale;
  }

  set scale(s) {
    if (this._scale !== s) {
      this._scale = s;
    }
  }

  /**
  * Sets the raw temperature.
  * @param {Number} The temperature to set.
  * @private
  */
  _setRawTemp(temp) {
    this._rawTemp = temp;
  }

  /**
  * Gets the raw temperature value.
  * @return {Number} The raw value read from the sensor.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @override
  */
  getRawTemperature() {
    return this._rawTemp;
  }

  /**
  * Gets the temperature value.
  * @param  {TemperatureScale} scale The scale to use for measurement.
  * @return {Number}           The temperature value in the specified scale.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  */
  getTemperature(scale) {
    return TemperatureConversion.convert(this.scale, scale, this.getRawTempurature());
  }

  /**
  * Converts the current instance to it's string representation. This method
  * simply returns the component name.
  * @return {String} The component name.
  * @override
  */
  toString() {
    return this._base.componentName;
  }
}

module.exports = TemperatureSensorBase;
