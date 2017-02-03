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

const Component = require('../Component.js');
const TemperatureScale = require('./TemperatureScale.js');

const TEMPERATURE_CHANGED = "temperatureChangedEvent";

/**
 * An abstract temperature sensor interface.
 * @interface
 * @extends {Component}
 */
class TemperatureSensor extends Component {
  /**
   * Initializes a new instance of the jsrpi.Components.Temperature.TemperatureSensor
   * interface.
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * In a derived class, gets the raw temperature value.
   * @return {Number} The raw value read from the sensor.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  getRawTemperature() { return 0; }

  /**
   * In a derived class, gets or sets the temperature scale.
   * @property {TemperatureScale} scale - The temperature scale.
   */
  get scale() { return TemperatureScale.Farenheit; }

  set scale(s) {}

  /**
   * In a derived class, fires the temperature change event.
   * @param  {TemperatureChangeEvent} tempChangeEvent The event object.
   */
  onTemperatureChange(tempChangeEvent) {}

  /**
   * In a derived class, gets the temperature value.
   * @param  {TemperatureScale} scale The scale to use for measurement.
   * @return {Number}       The temperature value in the specified scale.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  getTemperature(scale) { return 0; }

  /**
   * In a derived class, gets the sensor geing used to measure.
   * @property {DS160} The temperature sensor.
   * @readonly
   */
  get sensor() { return null; }

  /**
   * Gets the name of the temperature change event.
   * @type {String}
   * @const
   */
  static get EVENT_TEMPERATURE_CHANGED() { return TEMPERATURE_CHANGED; }
}

module.exports = TemperatureSensor;
