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

const util = require('util');
const TemperatureSensorBase = require('./TemperatureSensorBase.js');
const TemperatureScale = require('./TemperatureScale.js');
const TemperatureConversion = require('./TemperatureConversion.js');
const TemperatureChangeEvent = require('./TemperatureChangeEvent.js');
const ObjectDisposedException = require('../../ObjectDisposedException.js');

/**
* @classdesc A component that is an abstraction of a temperature sensor device.
* This is an implementation of TemperatureSensorBase.
* @extends {TemperatureSensorBase}
*/
class TemperatureSensorComponent extends TemperatureSensorBase {
  /**
   * Initializes a new instance jsrpi.Components.Temperature.TemperatureSensorComponent
   * with the temperature scale and clock, data, and reset pins used for
   * acquiring data.
   * @param {TemperatureScale} scale The temperature scale to use for measurements.
   * @param {Gpio} clock The GPIO pin used for the clock.
   * @param {Gpio} data  The GPIO pin used for data.
   * @param {Gpio} reset The GPIO pin used to trigger reset.
   * @throws {ArgumentNullException} in any of the pins are null or undefined.
   * @constructor
   */
  constructor(scale, clock, data, reset) {
    super(clock, data, reset);

    super.scale = scale;
    this._isPolling = false;
    this._controlTimer = null;
    this._lastTemp = 0;
  }

  /**
  * Checks to see if this instance is currently polling.
  * @property {Boolean} isPolling - true if polling; Otherwise, false.
  * @readonly
  */
  get isPolling() {
    return this._isPolling;
  }

  /**
  * Interrupts the poll cycle.
  */
  interruptPoll() {
    if (this.isPolling) {
      if (!util.isNullOrUndefined(this._controlTimer)) {
        clearInterval(this._controlTimer);
        this._controlTimer = null;
      }
      this._isPolling = false;
    }
  }

  /**
  * Releases all resources used by the TemperatureSensorComponent object.
  * @override
  */
  dispose() {
    if (this.isDisposed) {
      return;
    }

    this.interruptPoll();
    super.dispose();
  }

  /**
  * Gets the raw temperature value.
  * @return {Number} The raw value read from the sensor.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @override
  */
  getRawTemperature() {
    if (this.isDisposed) {
      throw new ObjectDisposedException('TemperatureSensorComponent');
    }

    let c = TemperatureScale.Celcius;
    let temp = super.sensor.getTemperature();
    if (super.scale !== c) {
      return TemperatureConversion.convert(c, super.scale, temp);
    }
    return temp;
  }

  /**
  * Gets the temperature value.
  * @param  {TemperatureScale} scale The scale to use for measurement.
  * @return {Number}           The temperature value in the specified scale.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @override
  */
  getTemperature(scale) {
    let raw = this.getRawTemperature();
    let s = this.scale;
    return TemperatureConversion.convert(s, scale, raw);
  }

  /**
  * Executes the poll cycle.
  * @private
  */
  _executePoll() {
    let oldTemp = 0;
    let newTemp = 0;
    if (this.isPolling) {
      newTemp = this.getRawTemperature();
      if (newTemp !== this._lastTemp) {
        oldTemp = this._lastTemp;
        this._lastTemp = newTemp;
        let evt = new TemperatureChangeEvent(oldTemp, newTemp);
        this.onTemperatureChange(evt);
      }
    }
  }

  /**
  * Executes the poll cycle in the background asynchronously.
  * @private
  */
  _backgroundExecutePoll() {
    if (!this.isPolling) {
      this._controlTimer = setInterval(() => { this._executePoll(); }, 200);
      this._isPolling = true;
    }
  }

  /**
  * Polls the input pin status every 500ms until stopped.
  */
  poll() {
    if (this.isDisposed) {
      throw new ObjectDisposedException('TemperatureSensorComponent');
    }

    if (this.isPolling) {
      return;
    }

    this._backgroundExecutePoll();
  }
}

module.exports = TemperatureSensorComponent;
