"use strict";

//
//  IDS1620.js
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
const DS1620Interface = require('./DS1620Interface.js');
const ArgumentNullException = require('../ArgumentNullException.js');
const PinState = require('../IO/PinState.js');
const ObjectDisposedException = require('../ObjectDisposedException.js');
const CoreUtils = require('../PiSystem/CoreUtils.js');

/**
 * @classdesc This is a simple driver class for the Dallas Semiconductor DS1620
 * digital thermometer IC.
 * @implements {DS1620Interface}
 */
class DS1620 extends DS1620Interface {
  /**
   * Initializes a new instance of the jsrpi.Sensors.DS1620 class with the pins
   * needed to acquire data.
   * @param {Gpio} clock The clock pin.
   * @param {Gpio} data  The data pin.
   * @param {Gpio} reset The reset pin.
   * @throws {ArgumentNullException} if the clock, data, or reset pins are null or
   * undefined.
   * @constructor
   */
  constructor(clock, data, reset) {
    super();

    this._isDisposed = false;
    this._clock = clock || null;
    if (util.isNullOrUndefined(this._clock)) {
      throw new ArgumentNullException("'clock' param cannot be null or undefined.");
    }

    this._data = data || null;
    if (util.isNullOrUndefined(this._data)) {
      throw new ArgumentNullException("'data' param cannot be null or undefined.");
    }

    this._reset = reset || null;
    if (util.isNullOrUndefined(this._reset)) {
      throw new ArgumentNullException("'reset' param cannot be null or undefinedl");
    }

    this._clock.provision();
    this._data.provision();
    this._reset.provision();
  }

  /**
   * Determines whether or not this instance has been disposed.
   * @property {Boolean} isDisposed - true if disposed; Otherwise, false.
   * @readonly
   * @override
   */
  get isDisposed() {
    return this._isDisposed;
  }

  /**
   * Gets the clock pin.
   * @property {Gpio} clockPin - The clock pin.
   * @readonly
   * @override
   */
  get clockPin() {
    return this._clock;
  }

  /**
   * Gets the data pin.
   * @property {Gpio} dataPin - The data pin.
   * @readonly
   */
  get dataPin() {
    return this._data;
  }

  /**
   * Gets the reset pin.
   * @property {Gpio} resetPin - The reset pin.
   * @readonly
   */
  get resetPin() {
    return this._reset;
  }

  /**
   * Sends an 8-bit command to the DS1620.
   * @param  {Number} command The command to send.
   * @private
   */
  _sendCommand(command) {
    // Send command on data output, least sig bit first.
    let bit = 0;
    for (let n = 0; n < 8; n++) {
      bit = ((command >> n) & 0x01);
      this._data.write((bit === 1) ? PinState.High : PinState.Low);
      this._clock.write(PinState.Low);
      this._clock.write(PinState.High);
    }
  }

  /**
   * Reads 8-bit data from the DS1620.
   * @return {Number} The temperature in half degree increments.
   * @private
   */
  _readData() {
    let bit = 0;
    let raw_data = 0;  // Go into input mode.
    for (let n = 0; n < 9; n++) {
      this._clock.write(PinState.Low);
      bit = Number(this._data.read());
      this._clock.write(PinState.High);
      raw_data = raw_data | (bit << n);
    }
    return raw_data;
  }

  /**
   * Sends the commands to get the temperature from the sensor.
   * @return {Number} The temperature with half-degree granularity.
   * @throws {ObjectDisposedException} if this instance has been disposed and is
   * no longer in a usable state.
   */
  getTemperature() {
    if (this._isDisposed) {
      throw new ObjectDisposedException("DS1620");
    }

    this._reset.write(PinState.Low);
    this._clock.write(PinState.High);
    this._reset.write(PinState.High);
    this._sendCommand(0x0c);   // write config command.
    this._sendCommand(0x02);   // cpu mode.
    this._reset.write(PinState.Low);

    // wait until the configuration register is written.
    CoreUtils.sleepMicroseconds(200000);

    this._clock.write(PinState.High);
    this._reset.write(PinState.High);
    this._sendCommand(0xEE); // start conversion.
    this._reset.write(PinState.Low);

    CoreUtils.sleepMicroseconds(200000);
    this._clock.write(PinState.High);
    this._reset.write(PinState.High);
    this._sendCommand(0xAA);
    let raw = this._readData();
    this._reset.write(PinState.Low);

    return ((raw).toFixed(2) / 2.0);
  }

  /**
   * Releases alll resources used by the DS1620 object.
   * @override
   */
  dispose() {
    if (this._isDisposed) {
      return;
    }

    if (!util.isNullOrUndefined(this._clock)) {
      this._clock.dispose();
      this._clock = undefined;
    }

    if (!util.isNullOrUndefined(this._data)) {
      this._data.dispose();
      this._data = undefined;
    }

    if (!util.isNullOrUndefined(this._reset)) {
      this._reset.dispose();
      this._reset = undefined;
    }
    this._isDisposed = true;
  }
}

module.exports = DS1620;
