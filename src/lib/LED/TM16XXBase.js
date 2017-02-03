"use strict";

//
//  TM16XXBase.js
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
const RaspiGpio = require('../IO/RaspiGpio.js');
const Disposable = require('../Disposable.js');
const TM1638LedColor = require('./TM1638LedColor.js');
const PinState = require('../IO/PinState.js');
const StringUtils = require('../StringUtils.js');
const ArgumentNullException = require('../ArgumentNullException.js');

/**
 * The character map for the seven segment displays.
 * The bits are displayed by mapping below:
 *  -- 0 --
 * |       |
 * 5       1
 *  -- 6 --
 * 4       2
 * |       |
 *  -- 3 --  .7
 * @type {Array}
 * @const
 */
const C_MAP = [
  [' ', StringUtils.convertStringToByte("00000000")],
  ['!', StringUtils.convertStringToByte("10000110")],
  ['"', StringUtils.convertStringToByte("00100010")],
  ['#', StringUtils.convertStringToByte("01111110")],
  ['$', StringUtils.convertStringToByte("01101101")],
  ['%', StringUtils.convertStringToByte("00000000")],
  ['&', StringUtils.convertStringToByte("00000000")],
  ['\'', StringUtils.convertStringToByte("00000010")],
  ['(', StringUtils.convertStringToByte("00110000")],
  [')', StringUtils.convertStringToByte("00000110")],
  ['*', StringUtils.convertStringToByte("01100011")],
  ['+', StringUtils.convertStringToByte("00000000")],
  [',', StringUtils.convertStringToByte("00000100")],
  ['-', StringUtils.convertStringToByte("01000000")],
  ['.', StringUtils.convertStringToByte("10000000")],
  ['/', StringUtils.convertStringToByte("01010010")],
  ['0', StringUtils.convertStringToByte("00111111")],
  ['1', StringUtils.convertStringToByte("00000110")],
  ['2', StringUtils.convertStringToByte("01011011")],
  ['3', StringUtils.convertStringToByte("01001111")],
  ['4', StringUtils.convertStringToByte("01100110")],
  ['5', StringUtils.convertStringToByte("01101101")],
  ['6', StringUtils.convertStringToByte("01111101")],
  ['7', StringUtils.convertStringToByte("00100111")],
  ['8', StringUtils.convertStringToByte("01111111")],
  ['9', StringUtils.convertStringToByte("01101111")],
  [':', StringUtils.convertStringToByte("00000000")],
  [';', StringUtils.convertStringToByte("00000000")],
  ['<', StringUtils.convertStringToByte("00000000")],
  ['=', StringUtils.convertStringToByte("01001000")],
  ['>', StringUtils.convertStringToByte("00000000")],
  ['?', StringUtils.convertStringToByte("01010011")],
  ['@', StringUtils.convertStringToByte("01011111")],
  ['A', StringUtils.convertStringToByte("01110111")],
  ['B', StringUtils.convertStringToByte("01111111")],
  ['C', StringUtils.convertStringToByte("00111001")],
  ['D', StringUtils.convertStringToByte("00111111")],
  ['E', StringUtils.convertStringToByte("01111001")],
  ['F', StringUtils.convertStringToByte("01110001")],
  ['G', StringUtils.convertStringToByte("00111101")],
  ['H', StringUtils.convertStringToByte("01110110")],
  ['I', StringUtils.convertStringToByte("00000110")],
  ['J', StringUtils.convertStringToByte("00011111")],
  ['K', StringUtils.convertStringToByte("01101001")],
  ['L', StringUtils.convertStringToByte("00111000")],
  ['M', StringUtils.convertStringToByte("00010101")],
  ['N', StringUtils.convertStringToByte("00110111")],
  ['O', StringUtils.convertStringToByte("00111111")],
  ['P', StringUtils.convertStringToByte("01110011")],
  ['Q', StringUtils.convertStringToByte("01100111")],
  ['R', StringUtils.convertStringToByte("00110001")],
  ['S', StringUtils.convertStringToByte("01101101")],
  ['T', StringUtils.convertStringToByte("01111000")],
  ['U', StringUtils.convertStringToByte("00111110")],
  ['V', StringUtils.convertStringToByte("00101010")],
  ['W', StringUtils.convertStringToByte("00011101")],
  ['X', StringUtils.convertStringToByte("01110110")],
  ['Y', StringUtils.convertStringToByte("01101110")],
  ['Z', StringUtils.convertStringToByte("01011011")],
  ['[', StringUtils.convertStringToByte("00111001")],
  ['\\', StringUtils.convertStringToByte("01100100")],
  [']', StringUtils.convertStringToByte("00001111")],
  ['^', StringUtils.convertStringToByte("00000000")],
  ['_', StringUtils.convertStringToByte("00001000")],
  ['`', StringUtils.convertStringToByte("00100000")],
  ['a', StringUtils.convertStringToByte("01011111")],
  ['b', StringUtils.convertStringToByte("01111100")],
  ['c', StringUtils.convertStringToByte("01011000")],
  ['d', StringUtils.convertStringToByte("01011110")],
  ['e', StringUtils.convertStringToByte("01111011")],
  ['f', StringUtils.convertStringToByte("00110001")],
  ['g', StringUtils.convertStringToByte("01101111")],
  ['h', StringUtils.convertStringToByte("01110100")],
  ['i', StringUtils.convertStringToByte("00000100")],
  ['j', StringUtils.convertStringToByte("00001110")],
  ['k', StringUtils.convertStringToByte("01110101")],
  ['l', StringUtils.convertStringToByte("00110000")],
  ['m', StringUtils.convertStringToByte("01010101")],
  ['n', StringUtils.convertStringToByte("01010100")],
  ['o', StringUtils.convertStringToByte("01011100")],
  ['p', StringUtils.convertStringToByte("01110011")],
  ['q', StringUtils.convertStringToByte("01100111")],
  ['r', StringUtils.convertStringToByte("01010000")],
  ['s', StringUtils.convertStringToByte("01101101")],
  ['t', StringUtils.convertStringToByte("01111000")],
  ['u', StringUtils.convertStringToByte("00011100")],
  ['v', StringUtils.convertStringToByte("00101010")],
  ['w', StringUtils.convertStringToByte("00011101")],
  ['x', StringUtils.convertStringToByte("01110110")],
  ['y', StringUtils.convertStringToByte("01101110")],
  ['z', StringUtils.convertStringToByte("01000111")],
  ['{', StringUtils.convertStringToByte("01000110")],
  ['|', StringUtils.convertStringToByte("00000110")],
  ['}', StringUtils.convertStringToByte("01110000")],
  ['~', StringUtils.convertStringToByte("00000001")]
];

/**
 * @classdesc This class is the base class for the TM1638/TM1640 board.
 * It is a port of the TM1638 library by Ricardo Batista
 * URL: http://code.google.com/p/tm1638-library/
 * @implements {Disposable}
 */
class TM16XXBase extends Disposable {
  /**
   * Initializes a new instance of the jsrpi.LED.TM16XXBase class with the data,
   * clock and strobe pins, the number of characters to display, whether or not
   * the display should be activated on init, and the brightness level.
   * @param {RaspiGpio} data      The data pin.
   * @param {RaspiGpio} clock     The clock pin.
   * @param {RaspiGpio} strobe    The strobe pin.
   * @param {Number} displays     The number of characters to display.
   * @param {Boolean} activate    Set true to activate the display.
   * @param {Number} intensity    The display intensity (brightness) level.
   * @throws {ArgumentNullException} if data, clock, or strobe pins are null or
   * undefined.
   * @constructor
   */
  constructor(data, clock, strobe, displays, activate, intensity) {
    this._isDisposed = false;
    this._isActive = false;
    this._data = data || null;
    if (util.isNullOrUndefined(this._data)) {
      throw new ArgumentNullException("'data' param cannot be null.");
    }

    this._clock = clock || null;
    if (util.isNullOrUndefined(this._clock)) {
      throw new ArgumentNullException("'clock' param cannot be null.");
    }

    this._strobe = strobe || null;
    if (util.isNullOrUndefined(this._strobe)) {
      throw new ArgumentNullException("'strobe' param cannot be null.");
    }

    // TODO what is the acceptable range?
    this._displays = displays || 0;

    this._data.provision();
    this._clock.provision();
    this._strobe.provision();
    this._strobe.write(PinState.High);
    this._clock.write(PinState.High);

    // TODO What is the acceptable range of "intensity"?
    this.sendCommand(0x40);
    this.sendCommand((0x80 | (activate ? 0x08 : 0x00) | (Math.min(7, intensity))));

    this._strobe.write(PinState.Low);
    this.send(0xC0);
    for (let i = 0; i < 16; i++) {
      this.send(0x00);
    }

    this._strobe.write(PinState.High);
  }

  /**
   * Send the specified data to the display.
   * @param  {Byte|Number} data The byte of data to send.
   */
  send(data) {
    for (let i = 0; i < 8; i++) {
      this._clock.write(PinState.Low);
      this._data.write((data & 1) > 0 ? PinState.High : PinState.Low);
      data >>= 1;
      this._clock.write(PinState.High);
    }
  }

  /**
   * Sends the command.
   * @param  {Byte|Number} cmd A byte representing the command.
   */
  sendCommand(cmd) {
    this._strobe.write(PinState.Low);
    this.send(cmd);
    this._strobe.write(PinState.High);
  }

  /**
   * Determines whether or not the current instance has been disposed.
   * @property {Boolean} isDisposed - true if disposed; Otherwise, false.
   * @readonly
   * @override
   */
  get isDisposed() {
    return this._isDisposed;
  }

  /**
   * Gets a value indicating whether or not the display is active.
   * @property {Boolean} isActive - true if the display is active; Otherwise,
   * false.
   * @readonly
   */
  get isActive() {
    return this._isActive;
  }

  /**
   * Gets the number of displays.
   * @return {Number} The number of displays.
   * @protected
   */
  _getDisplays() {
    return this._displays;
  }

  /**
   * Gets the strobe pin.
   * @return {RaspiGpio} The strobe pin.
   * @protected
   */
  _getStrobe() {
    return this._strobe;
  }

  /**
   * Receives data from the display driver.
   * @return {Byte|Number} The byte received.
   */
  receive() {
    // Pull up on.
    let temp = 0;
    this._data.write(PinState.High);
    for (let i = 0; i < 8; i++) {
      temp >>= 1;
      this._clock.write(PinState.Low);
      if (this._data.read() === PinState.High) {
        temp |= 0x80;
      }
      this._clock.write(PinState.High);
    }

    this._data.write(PinState.Low);
    return temp;
  }

  /**
   * Sends the specified data to the device.
   * @param  {Byte|Number} address The address to write the data at.
   * @param  {Byte|Number} data    The data to send.
   */
  sendData(address, data) {
    this.sendCommand(0x44);
    this._strobe.write(PinState.Low);
    this.send(0xC0 | address);
    this.send(data);
    this._strobe.write(PinState.High);
  }

  /**
   * Clears the display.
   */
  clearDisplay() {
    for (let i = 0; i < this._displays; i++) {
      this.sendData((i << 1), 0);
    }
  }

  /**
   * In a derived class, sends the specified character to the display.
   * @param  {Byte|Number} pos  The position to set the character at.
   * @param  {Byte|Number} data The character data to send.
   * @param  {Boolean} dot  Set true to enable the dot.
   */
  sendChar(pos, data, dot) {}

  /**
   * Sets the display to the specified string.
   * @param  {String} str       The string to set the display to.
   * @param  {Boolean} dots     Set true to turn on dots.
   * @param  {Byte|Number} pos  The character position to start the string at.
   */
  setDisplayToString(str, dots, pos) {
    if (StringUtils.isNullOrEmpty(str)) {
      this.clearDisplay();
      return;
    }

    dots = dots || 0;
    pos = pos || 0;

    let lpos = 0;
    let ldata = 0;
    let ldot = false;
    let len = str.length;
    for (let i = 0; i < this._displays; i++) {
      if (i < len) {
        lpos = (i + pos);
        ldata = C_MAP[str[i]];
        ldot = ((dots & (1 << (this._displays - i - 1))) !== 0);
        this.sendChar(lpos, ldata, ldot);
      }
      else {
        break;
      }
    }
  }

  /**
   * Sets the display to the specified values.
   * @param  {Array} values The values to set to the display (byte array).
   * @param  {Number} size  The number of values in the specified array
   * (starting at 0) to use. Just specify <values array>.length to use the
   * whole buffer.
   */
  setDisplay(values, size) {
    for (let i = 0; i < size; i++) {
      this.sendChar(i, values[i], false);
    }
  }

  /**
   * Clears the display digit.
   * @param  {Byte|Number} pos The position to start clearing the display at.
   * @param  {Boolean} dot     Set true to clear dots.
   */
  clearDisplayDigit(pos, dot) {
    this.sendChar(pos, 0, dot);
  }

  /**
   * Sets the display to error.
   */
  setDisplayToError() {
    let err = [
      C_MAP['E'],
      C_MAP['r'],
      C_MAP['r'],
      C_MAP['o'],
      C_MAP['r']
    ];

    this.setDisplay(err, 5);
    for (let i = 8; i < this._displays; i++) {
      this.clearDisplayDigit(i, false);
    }
    err = undefined;
  }

  /**
   * Sets the specified digit in the display.
   * @param  {Byte|Number} digit The digit to set.
   * @param  {Byte|Number} pos   The position to set the digit at.
   * @param  {Boolean} dot       Set true to turn on the dot.
   */
  setDisplayDigit(digit, pos, dot) {
    let chr = digit.toString().split('')[0];
    if (C_MAP[chr]) {
      this.sendChar(pos, C_MAP[chr], dot);
    }
  }

  /**
   * Sets up the display.
   * @param  {Boolean} active    Set true to activate.
   * @param  {Number} intensity  The display intensity level (brightness).
   */
  setupDisplay(active, intensity) {
    this.sendCommand((0x80 | (active ? 8 : 0) | Math.min(7, intensity)));

    // Necessary for the TM1640.
    this._strobe.write(PinState.Low);
    this._clock.write(PinState.Low);
    this._clock.write(PinState.High);
    this._strobe.write(PinState.High);
  }

  /**
   * Activates or deactivates the display.
   * @param {Boolean} active Set true to activate; false to deactivate.
   */
  activateDisplay(active) {
    active = active || false;
    if (active) {
      if (!this._isActive) {
        this.sendCommand(0x80);
        this._isActive = true;
      }
    }
    else {
      if (this._isActive) {
        this.sendCommand(0x80);
        this._isActive = false;
      }
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

    this.activateDisplay(false);
    if (this._clock != null) {
      this._clock.dispose();
      this._clock = undefined;
    }

    if (this._data != null) {
      this._data.dispose();
      this._data = undefined;
    }

    if (this._strobe != null) {
      this._strobe.dispose();
      this._strobe = undefined;
    }
    this._isDisposed = true;
  }

  /**
   * The character map.
   * @type {Array}
   * @const
   */
  static get CHAR_MAP() { return C_MAP; }
}

module.exports = TM16XXBase;
