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

const util = require('util');
const LcdTransferProvider = require('./LcdTransferProvider.js');
const GpioPins = require('../IO/GpioPins.js');
const PinMode = require('../IO/PinMode.js');
const PinState = require('../IO/PinState.js');
const GpioStandard = require('../IO/GpioStandard.js');
const IllegalArgumentException = require('../IllegalArgumentException.js');
const ObjectDisposedException = require('../ObjectDisposedException.js');

/**
 * @classdesc Raspberry Pi GPIO (via filesystem) provider for the Micro Liquid
 * Crystal library.
 * @extends {LcdTransferProvider}
 */
class GpioLcdTransferProviderStandard extends LcdTransferProvider {
  /**
   * Initializes a new instance of the jsrpi.LCD.GpioLcdTransferProviderStandard
   * class with all the necessary pins and whether or not to use 4bit mode.
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
   */
  constructor(d0, d1, d2, d3, d4, d5, d6, d7, fourBitMode, rs, rw, enable) {
    this._fourBitMode = fourBitMode || true;
    this._isDisposed = false;
    if ((rs === GpioPins.GPIO_NONE) ||
        (util.isNullOrUndefined(rs))) {
        throw new IllegalArgumentException("'rs' param must be a GpioPins member" +
                                            " other than GpioPins.GPIO_NONE.");
    }

    this._registerSelectPort = new GpioStandard(rs, PinMode.OUT);
    this._registerSelectPort.provision();

    // We can save 1 pin by not using RW. Indicate this by passing
    // GpioPins.GPIO_NONE instead of pin #.
    this._readWritePort = GpioPins.GPIO_NONE;
    if (rw !== GpioPins.GPIO_NONE) {
      this._readWritePort = new GpioStandard(rw, PinMode.OUT);
      this._readWritePort.provision();
    }

    if ((util.isNullOrUndefined(enable)) || (enable === GpioPins.GPIO_NONE)) {
      throw new IllegalArgumentException("'enable' param must be a GpioPins member" +
                                          " other than GpioPins.GPIO_NONE.");
    }

    this._enablePort = new GpioStandard(enable, PinMode.OUT);
    this._enablePort.provision();

    d0 = d0 || GpioPins.GPIO_NONE;
    d1 = d1 || GpioPins.GPIO_NONE;
    d2 = d2 || GpioPins.GPIO_NONE;
    d3 = d3 || GpioPins.GPIO_NONE;
    d4 = d4 || GpioPins.GPIO_NONE;
    d5 = d5 || GpioPins.GPIO_NONE;
    d6 = d6 || GpioPins.GPIO_NONE;
    d7 = d7 || GpioPins.GPIO_NONE;

    let dataPins = [d0, d1, d2, d3, d4, d5, d6, d7];
    this._dataPorts = new Array(dataPins.length);
    for (let i = 0; i < dataPins.length; i++) {
      if (dataPins[i] !== GpioPins.GPIO_NONE) {
        this._dataPorts[i] = new GpioStandard(dataPins[i], PinMode.OUT);
        this._dataPorts[i].provision();
      }
    }
  }

  /**
   * Determines whether or not the current instance has been disposed.
   * @return {Boolean} isDisposed - true if disposed; Otherwise, false.
   * @override
   */
  get isDisposed() {
    return this._isDisposed;
  }

  /**
   * Gets a value indicating whether this instance is in four-bit mode.
   * @return {Boolean} isFourBitMode - true if four-bit mode; Otherwise, false.
   * @override
   */
  get isFourBitMode() {
    return this._fourBitMode;
  }

  /**
   * Pulses the enable pin.
   * @private
   */
  _pulseEnable() {
    this._enablePort.write(PinState.Low);
    this._enablePort.write(PinState.High);  // Enable pulse must be > 450ns.
    this._enablePort.write(PinState.Low);   // Commands need > 37us to settle.
  }

  /**
   * Writes the command or data in 4-bit mode (the last 4 data lines).
   * @param  {Byte|Number} value The command or data to write.
   * @private.
   */
  write4bits(value) {
    for (let i = 0; i < 4; i++) {
      this._dataPorts[i + 4].write((((value >> i) & 0x01) === 0x01) ? PinState.High : PinState.Low);
    }
    this._pulseEnable();
  }

  /**
   * Writes the command or data in 8-bit mode (all 8 data lines).
   * @param  {Byte|Number} value The command or data to write.
   * @private
   */
  write8bits(value) {
    for (let i = 0; i < 8; i++) {
      this._dataPorts[i].write((((value >> i) & 0x01) === 0x01) ? PinState.High : PinState.Low);
    }
    this._pulseEnable();
  }

  /**
   * Send the specified data, mode and backlight.
   * @param  {Byte|Number} data   The data to send.
   * @param  {PinState} mode      Mode for register-select pin (PinState.High =
   * on, PinState.Low = off).
   * @param  {Boolean} backlight Turns on the backlight.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @override
   */
  send(value, mode, backlight) {
    if (this._isDisposed) {
      throw new ObjectDisposedException("GpioLcdTransferProviderStandard");
    }

    // TODO set backlight.

    this._registerSelectPort.write(mode);

    // If there is a RW pin indicated, set it low to write.
    if (!util.isNullOrUndefined(this._readWritePort)) {
      this._readWritePort.write(PinState.Low);
    }

    if (this._fourBitMode) {
      this.write4bits(value >> 4);
      this.write4bits(value);
    }
    else {
      this.write8bits(value);
    }
  }

  /**
   * Releases all managed resources used by this instance.
   * @override
   */
  dispose() {
    if (this._isDisposed) {
      return;
    }

    if (!util.isNullOrUndefined(this._registerSelectPort)) {
      this._registerSelectPort.dispose();
      this._registerSelectPort = undefined;
    }

    if (!util.isNullOrUndefined(this._readWritePort)) {
      this._readWritePort.dispose();
      this._readWritePort = undefined;
    }

    if (!util.isNullOrUndefined(this._enablePort)) {
      this._enablePort.dispose();
      this._enablePort = undefined;
    }

    if ((!util.isNullOrUndefined(this._dataPorts)) && (this._dataPorts.length > 0)) {
      for (let i = 0; i < this._dataPorts.length; i++) {
        if (this._dataPorts[i] != null) {
          this._dataPorts[i].dispose();
        }
      }
      this._dataPorts = undefined;
    }

    this._isDisposed = true;
  }
}

module.exports = GpioLcdTransferProviderStandard;
