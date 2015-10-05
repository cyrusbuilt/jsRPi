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
var extend = require('extend');
var TemperatureSensor = require('./TemperatureSensor.js');
var ComponentBase = require('../ComponentBase.js');
var EventEmitter = require('events').EventEmitter;
var DS1620 = require('../../Sensors/DS1620.js');
var ArgumentNullException = require('../../ArgumentNullException.js');
var TemperatureConversion = require('./TemperatureConversion.js');

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
  ComponentBase.call(this);
  EventEmitter.call(this);

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
  var _tempSensor = new DS1620(clock, data, reset);

  /**
   * Releases all resources used by the SensorBase object.
   * @override
   */
  this.dispose = function() {
    if (ComponentBase.prototype.isDisposed.call(this)) {
      return;
    }

    self.removeAllListeners();
    if (!util.isNullOrUndefined(_tempSensor)) {
      _tempSensor.dispose();
      _tempSensor = undefined;
    }

    ComponentBase.prototype.dispose.call(this);
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
    process.nextTick(function() {
      self.emit(TemperatureSensor.EVENT_TEMPERATURE_CHANGED, tempChangeEvent);
    });
  };

  /**
   * Gets the temperature value.
   * @param  {TemperatureScale} scale The scale to use for measurement.
   * @return {Number}       The temperature value in the specified scale.
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
    return ComponentBase.prototype.componentName;
  };
}

TemperatureSensorBase.prototype.constructor = TemperatureSensorBase;
inherits(TemperatureSensorBase, TemperatureSensor);

module.exports = extend(true, TemperatureSensorBase, ComponentBase, EventEmitter);
