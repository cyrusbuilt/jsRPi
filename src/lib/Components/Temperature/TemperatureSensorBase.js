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

var util = require('util');
var inherits = require('util').inherits;
var TemperatureSensor = require('./TemperatureSensor.js');
var ComponentBase = require('../ComponentBase.js');
var EventEmitter = require('events').EventEmitter;
var DS1620 = require('../../Sensors/DS1620.js');
var ArgumentNullException = require('../../ArgumentNullException.js');
var TemperatureConversion = require('./TemperatureConversion.js');
var TemperatureScale = require('./TemperatureScale.js');
var ObjectDisposedException = require('../../ObjectDisposedException.js');

/**
 * @classdesc Base class for temperature sensor abstraction components.
 * @param {Gpio} clock The GPIO pin used for the clock.
 * @param {Gpio} data  The GPIO pin used for data.
 * @param {Gpio} reset The GPIO pin used to trigger reset.
 * @throws {ArgumentNullException} in any of the pins are null or undefined.
 * @constructor
 * @implements {TemperatureSensor}
 * @extends {ComponentBase}
 * @extends {EventEmitter}
 */
function TemperatureSensorBase(clock, data, reset) {
  	TemperatureSensor.call(this);

  	if (util.isNullOrUndefined(clock)) {
    	throw new ArgumentNullException("'clock' param cannot be null or undefined.");
  	}

  	if (util.isNullOrUndefined(data)) {
    	throw new ArgumentNullException("'data' param cannot be null or undefined.");
  	}

  	if (util.isNullOrUndefined(reset)) {
    	throw new ArgumentNullException("'reset' param cannot be null or undefined.");
  	}

  	var self = this;
	var _base = new ComponentBase();
	var _emitter = new EventEmitter();
	var _rawTemp = 0;
	var _scale = TemperatureScale.Celcius;
  	var _tempSensor = new DS1620(clock, data, reset);
	
	/**
    * Component name property.
    * @property {String}
    */
  	this.componentName = _base.componentName;

  	/**
    * Tag property.
    * @property {Object}
    */
  	this.tag = _base.tag;

  	/**
    * Gets the property collection.
    * @return {Array} A custom property collection.
    *                  @override
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
    * Determines whether or not this instance has been disposed.
    * @return {Boolean} true if disposed; Otherwise, false.
    * @override
    */
  	this.isDisposed = function() {
		return _base.isDisposed();
  	};

  	/**
    * Releases all resources used by the SensorBase object.
    * @override
    */
  	this.dispose = function() {
    	if (_base.isDisposed()) {
      	return;
    	}

    	if (!util.isNullOrUndefined(_tempSensor)) {
      	_tempSensor.dispose();
      	_tempSensor = undefined;
    	}
		
		_emitter.removeAllListeners();
		_emitter = undefined;
    	_base.dispose();
  	};
	
	/**
    * Removes all event listeners.
    * @override
    */
	this.removeAllListeners = function() {
   	if (!_base.isDisposed()) {
      	_emitter.removeAllListeners();
    	}
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
   	if (_base.isDisposed()) {
      	throw new ObjectDisposedException("TemperatureSensorBase");
    	}
    	_emitter.on(evt, callback);
  	};

	/**
    * Emits the specified event.
    * @param  {String} evt  The name of the event to emit.
    * @param  {Object} args The object that provides arguments to the event.
    * @throws {ObjectDisposedException} if this instance has been disposed.
    * @override
    */
  	this.emit = function(evt, args) {
   	if (_base.isDisposed()) {
      	throw new ObjectDisposedException("TemperatureSensorBase");
    	}
    	_emitter.emit(evt, args);
  	};

  	/**
    * Gets the sensor geing used to measure.
    * @return {DS160} The temperature.
    * @override
    */
  	this.getSensor = function() {
    	return _tempSensor;
  	};

  	/**
    * Fires the temperature change event.
    * @param  {TemperatureChangeEvent} tempChangeEvent The event object.
    * @override
    */
  	this.onTemperatureChange = function(tempChangeEvent) {
		if (_base.isDisposed()) {
			throw new ObjectDisposedException("SwitchBase");
		}
		
		var e = _emitter;
		var evt = tempChangeEvent;
    	process.nextTick(function() {
      	e.emit(TemperatureSensor.EVENT_TEMPERATURE_CHANGED, evt);
    	}.bind(this));
  	};
	
	/**
    * Gets the temperature scale.
    * @return {TemperatureScale} The scale being used to measure.
    * @override
    */
  	this.getScale = function() {
    	return _scale;
  	};

  	/**
    * Sets the scale to use for measurements.
    * @param  {TemperatureScale} scale The measurement scale.
    * @override
    */
  	this.setScale = function(scale) {
    	if (_scale !== scale) {
      	_scale = scale;
    	}
  	};
	
	/**
	 * Sets the raw temperature.
	 * @param {Number} The temperature to set.
	 * @private                    
	 */
	this._setRawTemp = function(temp) {
		_rawTemp = temp;
	};
	
	/**
   * Gets the raw temperature value.
   * @return {Number} The raw value read from the sensor.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @override
   */
  this.getRawTemperature = function() {
	 return _rawTemp; 
  };

  	/**
    * Gets the temperature value.
    * @param  {TemperatureScale} scale The scale to use for measurement.
    * @return {Number}           The temperature value in the specified scale.
    * @throws {ObjectDisposedException} if this instance has been disposed.
    */
  	this.getTemperature = function(scale) {
    	return TemperatureConversion.convert(self.getScale(), scale, self.getRawTempurature());
  	};

  	/**
    * Converts the current instance to it's string representation. This method
    * simply returns the component name.
    * @return {String} The component name.
    * @override
    */
  	this.toString = function() {
    	return self.componentName;
  	};
}

TemperatureSensorBase.prototype.constructor = TemperatureSensorBase;
inherits(TemperatureSensorBase, TemperatureSensor);

module.exports = TemperatureSensorBase;
