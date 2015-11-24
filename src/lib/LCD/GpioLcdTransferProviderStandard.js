"use strict";

//
//  GpioLcdTransferProviderStandard.js
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
var LcdTransferProvider = require('./LcdTransferProvider.js');
var GpioPins = require('../IO/GpioPins.js');
var PinMode = require('../IO/PinMode.js');
var PinState = require('../IO/PinState.js');
var GpioStandard = require('../IO/GpioStandard.js');
var IllegalArgumentException = require('../IllegalArgumentException.js');
var ObjectDisposedException = require('../ObjectDisposedException.js');

/**
 * @classdesc Raspberry Pi GPIO (via filesystem) provider for the Micro Liquid
 * Crystal library.
 * @param {GpioPins} d0          Data line 0.
 * @param {GpioPins} d1          Data line 1.
 * @param {GpioPins} d2          Data line 2.
 * @param {GpioPins} d3          Data line 3.
 * @param {GpioPins} d4          Data line 4.
 * @param {GpioPins} d5          Data line 5.
 * @param {GpioPins} d6          Data line 6.
 * @param {GpioPins} d7          Data line 7.
 * @param {Boolean} fourBitMode  If set true, then use 4-bit mode instead of 8.
 * @param {GpioPins} rs          The RS pin (Register Select).
 * @param {GpioPins} rw          The RW pin (Read/Write).
 * @param {GpioPins} enable      The enable pin.
 * @throws {IllegalArgumentException} if 'rs' or 'enable' is null, undefined,
 * not a GpioPins member, or GpioPins.GPIO_NONE.
 * @constructor
 * @extends {LcdTransferProvider}
 */
function GpioLcdTransferProviderStandard(d0, d1, d2, d3, d4, d5, d6, d7,
                                          fourBitMode, rs, rw, enable) {
  LcdTransferProvider.call(this);

  // **** Begin Main constructor logic ****
  var self = this;
  var _fourBitMode = fourBitMode || true;
  var _isDisposed = false;
  if ((rs === GpioPins.GPIO_NONE) ||
      (util.isNullOrUndefined(rs))) {
      throw new IllegalArgumentException("'rs' param must be a GpioPins member" +
                                          " other than GpioPins.GPIO_NONE.");
  }

  var _registerSelectPort = new GpioStandard(rs, PinMode.OUT);
  _registerSelectPort.provision();

  // We can save 1 pin by not using RW. Indicate this by passing
  // GpioPins.GPIO_NONE instead of pin #.
  var _readWritePort = GpioPins.GPIO_NONE;
  if (rw !== GpioPins.GPIO_NONE) {
    _readWritePort = new GpioStandard(rw, PinMode.OUT);
    _readWritePort.provision();
  }

  if ((util.isNullOrUndefined(enable)) || (enable === GpioPins.GPIO_NONE)) {
    throw new IllegalArgumentException("'enable' param must be a GpioPins member" +
                                        " other than GpioPins.GPIO_NONE.");
  }

  var _enablePort = new GpioStandard(enable, PinMode.OUT);
  _enablePort.provision();

  d0 = d0 || GpioPins.GPIO_NONE;
  d1 = d1 || GpioPins.GPIO_NONE;
  d2 = d2 || GpioPins.GPIO_NONE;
  d3 = d3 || GpioPins.GPIO_NONE;
  d4 = d4 || GpioPins.GPIO_NONE;
  d5 = d5 || GpioPins.GPIO_NONE;
  d6 = d6 || GpioPins.GPIO_NONE;
  d7 = d7 || GpioPins.GPIO_NONE;

  var dataPins = [d0, d1, d2, d3, d4, d5, d6, d7];
  var _dataPorts = new Array(dataPins.length);
  for (var i = 0; i < dataPins.length; i++) {
    if (dataPins[i] !== GpioPins.GPIO_NONE) {
      _dataPorts[i] = new GpioStandard(dataPins[i], PinMode.OUT);
      _dataPorts[i].provision();
    }
  }
  // **** End Main constructor logic ****

  // Instance methods

  /**
   * Determines whether or not the current instance has been disposed.
   * @return {Boolean} true if disposed; Otherwise, false.
   * @override
   */
  this.isDisposed = function() {
    return _isDisposed;
  };

  /**
   * Gets a value indicating whether this instance is in four-bit mode.
   * @return {Boolean} true if four-bit mode; Otherwise, false.
   * @override
   */
  this.isFourBitMode = function() {
    return _fourBitMode;
  };

  /**
   * Pulses the enable pin.
   * @private
   */
  var pulseEnable = function() {
    _enablePort.write(PinState.Low);
    _enablePort.write(PinState.High);  // Enable pulse must be > 450ns.
    _enablePort.write(PinState.Low);   // Commands need > 37us to settle.
  };

  /**
   * Writes the command or data in 4-bit mode (the last 4 data lines).
   * @param  {Byte|Number} value The command or data to write.
   * @private.
   */
  var write4bits = function(value) {
    for (var i = 0; i < 4; i++) {
      _dataPorts[i + 4].write((((value >> i) & 0x01) === 0x01) ? PinState.High : PinState.Low);
    }
    pulseEnable();
  };

  /**
   * Writes the command or data in 8-bit mode (all 8 data lines).
   * @param  {Byte|Number} value The command or data to write.
   * @private
   */
  var write8bits = function(value) {
    for (var i = 0; i < 8; i++) {
      _dataPorts[i].write((((value >> i) & 0x01) === 0x01) ? PinState.High : PinState.Low);
    }
    pulseEnable();
  };

  /**
   * Send the specified data, mode and backlight.
   * @param  {Byte|Number} data   The data to send.
   * @param  {PinState} mode      Mode for register-select pin (PinState.High =
   * on, PinState.Low = off).
   * @param  {Boolean} backlight Turns on the backlight.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @override
   */
  this.send = function(value, mode, backlight) {
    if (_isDisposed) {
      throw new ObjectDisposedException("GpioLcdTransferProviderStandard");
    }

    // TODO set backlight.

    _registerSelectPort.write(mode);

    // If there is a RW pin indicated, set it low to write.
    if ((_readWritePort != null) && (_readWritePort !== undefined)) {
      _readWritePort.write(PinState.Low);
    }

    if (_fourBitMode) {
      write4bits(value >> 4);
      write4bits(value);
    }
    else {
      write8bits(value);
    }
  };

  /**
   * Releases all managed resources used by this instance.
   * @override
   */
  this.dispose = function() {
    if (_isDisposed) {
      return;
    }

    if ((_registerSelectPort != null) && (_registerSelectPort !== undefined)) {
      _registerSelectPort.dispose();
      _registerSelectPort = undefined;
    }

    if (!util.isNullOrUndefined(_readWritePort)) {
      _readWritePort.dispose();
      _readWritePort = undefined;
    }

    if (!util.isNullOrUndefined(_enablePort)) {
      _enablePort.dispose();
      _enablePort = undefined;
    }

    if ((!util.isNullOrUndefined(_dataPorts)) && (_dataPorts.length > 0)) {
      for (var i = 0; i < _dataPorts.length; i++) {
        if (_dataPorts[i] != null) {
          _dataPorts[i].dispose();
        }
      }
      _dataPorts = undefined;
    }

    _isDisposed = true;
  };
}

GpioLcdTransferProviderStandard.prototype.constructor = GpioLcdTransferProviderStandard;
inherits(GpioLcdTransferProviderStandard, LcdTransferProvider);

module.exports = GpioLcdTransferProviderStandard;
