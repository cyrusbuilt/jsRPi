"use strict";
//
//  TemperatureChangeEvent.js
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

var inherits = require('util').inherits;
var Component = require('../Component.js');
var TemperatureScale = require('./TemperatureScale.js');

/**
 * An abstract temperature sensor interface.
 * @interface
 * @extends {Component}
 */
function TemperatureSensor() {
  Component.call(this);
}

TemperatureSensor.prototype.constructor = TemperatureSensor;
inherits(TemperatureSensor, Component);

/**
 * In a derived class, gets the raw temperature value.
 * @return {Number} The raw value read from the sensor.
 * @throws {ObjectDisposedException} if this instance has been disposed.
 */
TemperatureSensor.prototype.getRawTemperature = function() { return 0; };

/**
 * In a derived class, gets the temperature scale.
 * @return {TemperatureScale} The scale being used to measure.
 */
TemperatureSensor.prototype.getScale = function() { return TemperatureScale.Farenheit; };

/**
 * In a derived class, sets the scale to use for measurements.
 * @param  {TemperatureScale} scale The measurement scale.
 */
TemperatureSensor.prototype.setScale = function(scale) {};

/**
 * In a derived class, fires the temperature change event.
 * @param  {TemperatureChangeEvent} tempChangeEvent The event object.
 */
TemperatureSensor.prototype.onTemperatureChange = function(tempChangeEvent) {};

/**
 * In a derived class, gets the temperature value.
 * @param  {TemperatureScale} scale The scale to use for measurement.
 * @return {Number}       The temperature value in the specified scale.
 * @throws {ObjectDisposedException} if this instance has been disposed.
 */
TemperatureSensor.prototype.getTemperature = function(scale) { return 0; };

/**
 * In a derived class, gets the sensor geing used to measure.
 * @return {DS160} The temperature.
 */
TemperatureSensor.prototype.getSensor = function() { return null; };

/**
 * Gets the name of the temperature change event.
 * @type {String}
 * @const
 */
TemperatureSensor.EVENT_TEMPERATURE_CHANGED = "temperatureChangedEvent";

module.exports = TemperatureSensor;
