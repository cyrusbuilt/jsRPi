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

var util = require('util');
var inherits = require('util').inherits;
var RaspiGpio = require('../IO/RaspiGpio.js');
var Disposable = require('../Disposable.js');
var TM1638LedColor = require('./TM1638LedColor.js');
var PinState = require('../IO/PinState.js');
var StringUtils = require('../StringUtils.js');
var ArgumentNullException = require('../ArgumentNullException.js');

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
var C_MAP = [
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
 * @param {RaspiGpio} data      The data pin.
 * @param {RaspiGpio} clock     The clock pin.
 * @param {RaspiGpio} strobe    The strobe pin.
 * @param {Number} displays     The number of characters to display.
 * @param {Boolean} activate    Set true to activate the display.
 * @param {Number} intensity    The display intensity (brightness) level.
 * @throws {ArgumentNullException} if data, clock, or strobe pins are null or
 * undefined.
 * @constructor
 * @implements {Disposable}
 */
function TM16XXBase(data, clock, strobe, displays, activate, intensity) {
  Disposable.call(this);
  var self = this;
  var _isDisposed = false;
  var _isActive = false;
  var _data = data || null;
  if (util.isNullOrUndefined(_data)) {
    throw new ArgumentNullException("'data' param cannot be null.");
  }

  var _clock = clock || null;
  if (util.isNullOrUndefined(_clock)) {
    throw new ArgumentNullException("'clock' param cannot be null.");
  }

  var _strobe = strobe || null;
  if (util.isNullOrUndefined(_strobe)) {
    throw new ArgumentNullException("'strobe' param cannot be null.");
  }

  // TODO what is the acceptable range?
  var _displays = displays || 0;

  _data.provision();
  _clock.provision();
  _strobe.provision();
  _strobe.write(PinState.High);
  _clock.write(PinState.High);

  /**
   * Send the specified data to the display.
   * @param  {Byte|Number} data The byte of data to send.
   */
  this.send = function(data) {
    for (var i = 0; i < 8; i++) {
      _clock.write(PinState.Low);
      _data.write((data & 1) > 0 ? PinState.High : PinState.Low);
      data >>= 1;
      _clock.write(PinState.High);
    }
  };

  /**
   * Sends the command.
   * @param  {Byte|Number} cmd A byte representing the command.
   */
  this.sendCommand = function(cmd) {
    _strobe.write(PinState.Low);
    self.send(cmd);
    _strobe.write(PinState.High);
  };

  // TODO What is the acceptable range of "intensity"?
  this.sendCommand(0x40);
  this.sendCommand((0x80 | (activate ? 0x08 : 0x00) | (Math.min(7, intensity))));

  _strobe.write(PinState.Low);
  this.send(0xC0);
  for (var i = 0; i < 16; i++) {
    this.send(0x00);
  }

  _strobe.write(PinState.High);

  /**
   * Determines whether or not the current instance has been disposed.
   * @return {Boolean} true if disposed; Otherwise, false.
   * @override
   */
  this.isDisposed = function() {
    return _isDisposed;
  };

  /**
   *  Gets a value indicating whether or not the display is active.
   * @return {Boolean} true if the display is active; Otherwise, false.
   */
  this.isActive = function() {
    return _isActive;
  };

  /**
   * Gets the number of displays.
   * @return {Number} The number of displays.
   * @protected
   */
  this._getDisplays = function() {
    return _displays;
  };

  /**
   * Gets the strobe pin.
   * @return {RaspiGpio} The strobe pin.
   * @protected
   */
  this._getStrobe = function() {
    return _strobe;
  };

  /**
   * Receives data from the display driver.
   * @return {Byte|Number} The byte received.
   */
  this.receive = function() {
    // Pull up on.
    var temp = 0;
    _data.write(PinState.High);
    for (var i = 0; i < 8; i++) {
      temp >>= 1;
      _clock.write(PinState.Low);
      if (_data.read() === PinState.High) {
        temp |= 0x80;
      }
      _clock.write(PinState.High);
    }

    _data.write(PinState.Low);
    return temp;
  };

  /**
   * Sends the specified data to the device.
   * @param  {Byte|Number} address The address to write the data at.
   * @param  {Byte|Number} data    The data to send.
   */
  this.sendData = function(address, data) {
    self.sendCommand(0x44);
    _strobe.write(PinState.Low);
    self.send(0xC0 | address);
    self.send(data);
    _strobe.write(PinState.High);
  };

  /**
   * Clears the display.
   */
  this.clearDisplay = function() {
    for (var i = 0; i < _displays; i++) {
      self.sendData((i << 1), 0);
    }
  };

  /**
   * In a derived class, sends the specified character to the display.
   * @param  {Byte|Number} pos  The position to set the character at.
   * @param  {Byte|Number} data The character data to send.
   * @param  {Boolean} dot  Set true to enable the dot.
   */
  this.sendChar = function(pos, data, dot) {};

  /**
   * Sets the display to the specified string.
   * @param  {String} str       The string to set the display to.
   * @param  {Boolean} dots     Set true to turn on dots.
   * @param  {Byte|Number} pos  The character position to start the string at.
   */
  this.setDisplayToString = function(str, dots, pos) {
    if (StringUtils.isNullOrEmpty(str)) {
      self.clearDisplay();
      return;
    }

    dots = dots || 0;
    pos = pos || 0;

    var lpos = 0;
    var ldata = 0;
    var ldot = false;
    var len = str.length;
    for (var i = 0; i < _displays; i++) {
      if (i < len) {
        lpos = (i + pos);
        ldata = C_MAP[str[i]];
        ldot = ((dots & (1 << (_displays - i - 1))) !== 0);
        self.sendChar(lpos, ldata, ldot);
      }
      else {
        break;
      }
    }
  };

  /**
   * Sets the display to the specified values.
   * @param  {Array} values The values to set to the display (byte array).
   * @param  {Number} size  The number of values in the specified array
   * (starting at 0) to use. Just specify <values array>.length to use the
   * whole buffer.
   */
  this.setDisplay = function(values, size) {
    for (var i = 0; i < size; i++) {
      self.sendChar(i, values[i], false);
    }
  };

  /**
   * Clears the display digit.
   * @param  {Byte|Number} pos The position to start clearing the display at.
   * @param  {Boolean} dot     Set true to clear dots.
   */
  this.clearDisplayDigit = function(pos, dot) {
    self.sendChar(pos, 0, dot);
  };

  /**
   * Sets the display to error.
   */
  this.setDisplayToError = function() {
    var err = [
      C_MAP['E'],
      C_MAP['r'],
      C_MAP['r'],
      C_MAP['o'],
      C_MAP['r']
    ];

    self.setDisplay(err, 5);
    for (var i = 8; i < _displays; i++) {
      self.clearDisplayDigit(i, false);
    }
    err = undefined;
  };

  /**
   * Sets the specified digit in the display.
   * @param  {Byte|Number} digit The digit to set.
   * @param  {Byte|Number} pos   The position to set the digit at.
   * @param  {Boolean} dot       Set true to turn on the dot.
   */
  this.setDisplayDigit = function(digit, pos, dot) {
    var chr = digit.toString().split('')[0];
    if (C_MAP[chr]) {
      self.sendChar(pos, C_MAP[chr], dot);
    }
  };

  /**
   * Sets up the display.
   * @param  {Boolean} active    Set true to activate.
   * @param  {Number} intensity  The display intensity level (brightness).
   */
  this.setupDisplay = function(active, intensity) {
    self.sendCommand((0x80 | (active ? 8 : 0) | Math.min(7, intensity)));

    // Necessary for the TM1640.
    _strobe.write(PinState.Low);
    _clock.write(PinState.Low);
    _clock.write(PinState.High);
    _strobe.write(PinState.High);
  };

  /**
   * Activates or deactivates the display.
   * @param  {Boolean} active Set true to activate; false to deactivate.
   */
  this.activateDisplay = function(active) {
    active = active || false;
    if (active) {
      if (!_isActive) {
        self.sendCommand(0x80);
        _isActive = true;
      }
    }
    else {
      if (_isActive) {
        self.sendCommand(0x80);
        _isActive = false;
      }
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

    self.activateDisplay(false);
    if (_clock != null) {
      _clock.dispose();
      _clock = undefined;
    }

    if (_data != null) {
      _data.dispose();
      _data = undefined;
    }

    if (_strobe != null) {
      _strobe.dispose();
      _strobe = undefined;
    }
    _isDisposed = true;
  };
}

TM16XXBase.CHAR_MAP = C_MAP;

TM16XXBase.prototype.constructor = TM16XXBase;
inherits(TM16XXBase, Disposable);

module.exports = TM16XXBase;
