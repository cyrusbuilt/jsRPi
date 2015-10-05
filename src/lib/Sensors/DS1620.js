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

var util = require('util');
var inherits = require('util').inherits;
var DS1620Interface = require('./DS1620Interface.js');
var ArgumentNullException = require('../ArgumentNullException.js');
var PinState = require('../IO/PinState.js');
var ObjectDisposedException = require('../ObjectDisposedException.js');
var CoreUtils = require('../PiSystem/CoreUtils.js');

/**
 * @classdesc This is a simple driver class for the Dallas Semiconductor DS1620
 * digital thermometer IC.
 * @param {Gpio} clock The clock pin.
 * @param {Gpio} data  The data pin.
 * @param {Gpio} reset The reset pin.
 * @throws {ArgumentNullException} if the clock, data, or reset pins are null or
 * undefined.
 * @constructor
 * @implements {DS1620Interface}
 */
function DS1620(clock, data, reset) {
  DS1620Interface.call(this);

  // **** Main constructor logic ****
  var _isDisposed = false;
  var _clock = clock || null;
  if (util.isNullOrUndefined(_clock)) {
    throw new ArgumentNullException("'clock' param cannot be null or undefined.");
  }

  var _data = data || null;
  if (util.isNullOrUndefined(_data)) {
    throw new ArgumentNullException("'data' param cannot be null or undefined.");
  }

  var _reset = reset || null;
  if (util.isNullOrUndefined(_reset)) {
    throw new ArgumentNullException("'reset' param cannot be null or undefinedl");
  }

  _clock.provision();
  _data.provision();
  _reset.provision();
  // **** End main constructor logic ****

  /**
   * Determines whether or not this instance has been disposed.
   * @return {Boolean} true if disposed; Otherwise, false.
   * @override
   */
  this.isDisposed = function() {
    return _isDisposed;
  };

  /**
   * Gets the clock pin.
   * @return {Gpio} The clock pin.
   */
  this.getClockPin = function() {
    return _clock;
  };

  /**
   * Gets the data pin.
   * @return {Gpio} The data pin.
   */
  this.getDataPin = function() {
    return _data;
  };

  /**
   * Gets the reset pin.
   * @return {Gpio} The reset pin.
   */
  this.getResetPin = function() {
    return _reset;
  };

  /**
   * Sends an 8-bit command to the DS1620.
   * @param  {Number} command The command to send.
   * @private
   */
  var sendCommand = function(command) {
    // Send command on data output, least sig bit first.
    var bit = 0;
    for (var n = 0; n < 8; n++) {
      bit = ((command >> n) & 0x01);
      _data.write((bit === 1) ? PinState.High : PinState.Low);
      _clock.write(PinState.Low);
      _clock.write(PinState.High);
    }
  };

  /**
   * Reads 8-bit data from the DS1620.
   * @return {Number} The temperature in half degree increments.
   * @private
   */
  var readData = function() {
    var bit = 0;
    var raw_data = 0;  // Go into input mode.
    for (var n = 0; n < 9; n++) {
      _clock.write(PinState.Low);
      bit = Number(_data.read());
      _clock.write(PinState.High);
      raw_data = raw_data | (bit << n);
    }
    return raw_data;
  };

  /**
   * Sends the commands to get the temperature from the sensor.
   * @return {Number} The temperature with half-degree granularity.
   * @throws {ObjectDisposedException} if this instance has been disposed and is
   * no longer in a usable state.
   */
  this.getTemperature = function() {
    if (_isDisposed) {
      throw new ObjectDisposedException("DS1620");
    }

    _reset.write(PinState.Low);
    _clock.write(PinState.High);
    _reset.write(PinState.High);
    sendCommand(0x0c);   // write config command.
    sendCommand(0x02);   // cpu mode.
    _reset.write(PinState.Low);

    // wait until the configuration register is written.
    CoreUtils.sleepMicroseconds(200000);

    _clock.write(PinState.High);
    _reset.write(PinState.High);
    sendCommand(0xEE); // start conversion.
    _reset.write(PinState.Low);

    CoreUtils.sleepMicroseconds(200000);
    _clock.write(PinState.High);
    _reset.write(PinState.High);
    sendCommand(0xAA);
    var raw = readData();
    _reset.write(PinState.Low);

    return ((raw).toFixed(2) / 2.0);
  };

  /**
   * Releases alll resources used by the DS1620 object.
   * @override
   */
  this.dispose = function() {
    if (_isDisposed) {
      return;
    }

    if (_clock != null) {
      _clock.dispose();
      _clock = undefined;
    }

    if (_data != null) {
      _data.dispose();
      _data = undefined;
    }

    if (_reset != null) {
      _reset.dispose();
      _reset = undefined;
    }
    _isDisposed = true;
  };
}

DS1620.prototype.constructor = DS1620;
inherits(DS1620, DS1620Interface);

module.exports = DS1620;
