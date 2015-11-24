"use strict";
//
//  TemperatureSensorComponent.js
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
var TemperatureSensorBase = require('./TemperatureSensorBase.js');
var TemperatureScale = require('./TemperatureScale.js');
var TemperatureConversion = require('./TemperatureConversion.js');
var TemperatureChangeEvent = require('./TemperatureChangeEvent.js');
var ObjectDisposedException = require('../../ObjectDisposedException.js');

/**
* @classdesc A component that is an abstraction of a temperature sensor device.
* This is an implementation of TemperatureSensorBase.
* @param {TemperatureScale} scale The temperature scale to use for measurements.
* @param {Gpio} clock The GPIO pin used for the clock.
* @param {Gpio} data  The GPIO pin used for data.
* @param {Gpio} reset The GPIO pin used to trigger reset.
* @throws {ArgumentNullException} in any of the pins are null or undefined.
* @constructor
* @extends {TemperatureSensorBase}
*/
function TemperatureSensorComponent(scale, clock, data, reset) {
  TemperatureSensorBase.call(this, clock, data, reset);

  var self = this;
  var _base = new TemperatureSensorBase(clock, data, reset);
  _base.setScale(scale);
  var _isPolling = false;
  var _controlTimer = null;
  var _lastTemp = 0;

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
  * Interrupts the poll cycle.
  */
  this.interruptPoll = function() {
    if (_isPolling) {
      if (!util.isNullOrUndefined(_controlTimer)) {
        clearInterval(_controlTimer);
        _controlTimer = null;
      }
      _isPolling = false;
    }
  };

  /**
  * Releases all resources used by the TemperatureSensorComponent object.
  * @override
  */
  this.dispose = function() {
    if (_base.isDisposed()) {
      return;
    }

    self.interruptPoll();
    _base.dispose();
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
  * Checks to see if this instance is currently polling.
  * @return {Boolean} true if polling; Otherwise, false.
  */
  this.isPolling = function() {
    return _isPolling;
  };

  /**
  * Gets the sensor geing used to measure.
  * @return {DS160} The temperature.
  * @override
  */
  this.getSensor = function() {
    return _base.getSensor();
  };

  /**
  * Fires the temperature change event.
  * @param  {TemperatureChangeEvent} tempChangeEvent The event object.
  * @override
  */
  this.onTemperatureChange = function(tempChangeEvent) {
    _base.onTemperatureChange(tempChangeEvent);
  };

  /**
  * Gets the raw temperature value.
  * @return {Number} The raw value read from the sensor.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @override
  */
  this.getRawTemperature = function() {
    if (_base.isDisposed()) {
      throw new ObjectDisposedException('TemperatureSensorComponent');
    }

    var c = TemperatureScale.Celcius;
    var temp = _base.getSensor().getTemperature();
    if (_base.getScale() !== c) {
      return TemperatureConversion.convert(c, _base.getScale(), temp);
    }
    return temp;
  };

  /**
  * Gets the temperature value.
  * @param  {TemperatureScale} scale The scale to use for measurement.
  * @return {Number}           The temperature value in the specified scale.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  */
  this.getTemperature = function(scale) {
    var raw = self.getRawTemperature();
    var s = self.getScale();
    return TemperatureConversion.convert(s, scale, raw);
  };

  /**
  * Gets the temperature scale.
  * @return {TemperatureScale} The scale being used to measure.
  * @override
  */
  this.getScale = function() {
    return _base.getScale();
  };

  /**
  * Sets the scale to use for measurements.
  * @param  {TemperatureScale} scale The measurement scale.
  * @override
  */
  this.setScale = function(scale) {
    _base.setScale(scale);
  };

  /**
  * Executes the poll cycle.
  * @private
  */
  var executePoll = function() {
    var oldTemp = 0;
    var newTemp = 0;
    if (_isPolling) {
      newTemp = self.getRawTemperature();
      if (newTemp !== _lastTemp) {
        oldTemp = _lastTemp;
        _lastTemp = newTemp;
        var evt = new TemperatureChangeEvent(oldTemp, newTemp);
        _base.onTemperatureChange(evt);
      }
    }
  };

  /**
  * Executes the poll cycle in the background asynchronously.
  * @private
  */
  var backgroundExecutePoll = function() {
    if (!_isPolling) {
      _controlTimer = setInterval(executePoll, 200);
      _isPolling = true;
    }
  };

  /**
  * Polls the input pin status every 500ms until stopped.
  */
  this.poll = function() {
    if (_base.isDisposed()) {
      throw new ObjectDisposedException('TemperatureSensorComponent');
    }

    if (_isPolling) {
      return;
    }
    backgroundExecutePoll();
  };
}

TemperatureSensorComponent.prototype.constructor = TemperatureSensorComponent;
inherits(TemperatureSensorComponent, TemperatureSensorBase);

module.exports = TemperatureSensorComponent;
