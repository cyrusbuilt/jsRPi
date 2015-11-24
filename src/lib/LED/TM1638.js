"use strict";

//
//  TM1638.js
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
var RaspiGpio = require('../IO/RaspiGpio.js');
var TM16XXBase = require('./TM16XXBase.js');
var StringUtils = require('../StringUtils.js');
var PinState = require('../IO/PinState.js');

/**
 * @classdesc Controller class for the TM1638/TM1640 board.
 * It is a port of the TM1638 library by Ricardo Batista
 * URL: http://code.google.com/p/tm1638-library/
 * @param {RaspiGpio} data      The data pin.
 * @param {RaspiGpio} clock     The clock pin.
 * @param {RaspiGpio} strobe    The strobe pin.
 * @param {Boolean} active      Set true to activate the display.
 * @param {Byte|Number} intensity The display intensity (brightness).
 * @constructor
 * @extends {TM16XXBase}
 */
function TM1638(data, clock, strobe, active, intensity) {
  TM16XXBase.call(this, data, clock, strobe, active, intensity);
}

/**
 * Sets the display to hex number.
 * @param  {Number} number An unsigned long number to display (gets converted
 * to hex).
 */
TM1638.prototype.setDisplayToHexNumber = function(number) {
  TM16XXBase.prototype.setDisplayToString("0x" + number.toString(16));
};

/**
 * Sets the display to a decimal number at the specified starting position.
 * @param  {Number} number       The number to set in the display (if out of
 * range, display will be cleared).
 * @param  {Byte|Number} dots      Set true to turn on dots.
 * @param  {Byte|Number} startPos  The starting position to place the number at.
 * @param  {Boolean} leadingZeros  Set true to lead the number with zeros.
 */
TM1638.prototype.setDisplayToDecNumberAt = function(number, dots, startPos, leadingZeros) {
  if (number > 99999999) {
    TM16XXBase.prototype.setDisplayToError();
  }
  else {
    var digit = 0;
    var pos = 0;
    var ldot = false;
    var displays = TM16XXBase.prototype._getDisplays();
    for (var i = 0; i < (displays - startPos); i++) {
      pos = (displays - i - 1);
      ldot = ((dots & (1 << i)) !== 0);
      if (number !== 0) {
        digit = (number % 10);
        TM16XXBase.prototype.setDisplayDigit(digit, pos, ldot);
        number /= 10;
      }
      else {
        if (leadingZeros) {
          digit = 0;
          TM16XXBase.prototype.setDisplayDigit(digit, pos, ldot);
        }
        else {
          TM16XXBase.prototype.clearDisplayDigit(pos, ldot);
        }
      }
    }
  }
};

/**
 * Sets the display to a decimal number.
 * @param  {Number} number        The number to set in the display.
 * @param  {Byte|Number} dots     Set true to turn on the dots.
 * @param  {Boolean} leadingZeros Set true to lead the number with zeros.
 */
TM1638.prototype.setDisplayToDecNumber = function(number, dots, leadingZeros) {
  var self = this;
  self.setDisplayToDecNumberAt(number, dots, 0, leadingZeros);
};

/**
 * Sends a character to the display.
 * @param  {Byte|Number} pos  The position at which to set the character.
 * @param  {Byte|Number} data The data (character) to set in the display.
 * @param  {Boolean} dot      Set true to turn on the dots.
 * @override
 */
TM1638.prototype.sendChar = function(pos, data, dot) {
  var address = (pos << 1);
  var one = StringUtils.convertStringToByte("10000000");
  var zero = StringUtils.convertStringToByte("00000000");
  var ldata = (data | (dot ? one : zero));
  TM16XXBase.prototype.sendData(address, ldata);
};

/**
 * Sets the display to signed a decimal number.
 * @param  {Number} number        The signed decimal number to set in the display.
 * @param  {Byte|Number} dots     Set true to turn on the dots.
 * @param  {Boolean} leadingZeros Set true to lead the number with zeros.
 */
TM1638.prototype.setDisplayToSignedDecNumber = function(number, dots, leadingZeros) {
  var self = this;
  if (number >= 0) {
    self.setDisplayToDecNumberAt(number, dots, 0, leadingZeros);
  }
  else {
    number = -number;
    if (number > 9999999) {
      TM16XXBase.prototype.setDisplayToError();
    }
    else {
      self.setDisplayToDecNumberAt(number, dots, 1, leadingZeros);
      self.sendChar(0, TM1638.CHAR_MAP['-'], (dots & 0x80) !== 0);
    }
  }
};

/**
 * Sets the display to a binary number.
 * @param  {Byte|Number} number The binary number to set in the display.
 * @param  {ByteNumber} dots    Set true to turn on the dots.
 */
TM1638.prototype.setDisplayToBinNumber = function(number, dots) {
  var digit = 0;
  var pos = 0;
  var ldot = false;
  var displays = TM16XXBase.prototype._getDisplays();
  for (var i = 0; i < displays; i++) {
    digit = ((number & (1 << i)) === 0 ? 0 : 1);
    pos = (displays - i - 1);
    ldot = ((dots & (1 << i)) !== 0);
    TM16XXBase.prototype.setDisplayDigit(digit, pos, ldot);
  }
};

/**
 * Sets the color of the character or digit at the specified position.
 * @param  {TM1638LedColor} color The color to set the digit/character to.
 * @param  {Byte|Number} pos      The position of the character to change the
 * color of.
 */
TM1638.prototype.setLed = function(color, pos) {
  TM16XXBase.prototype.sendData(((pos << 1) + 1), color);
};

/**
 * Gets a byte representing the buttons pushed. The display has 8
 * buttons, each representing one bit in the byte.
 * @return {Byte|Number} The push buttons.
 */
TM1638.prototype.getPushButtons = function() {
  var keys = 0;
  var strobe = TM16XXBase.prototype._getStrobe();
  strobe.write(PinState.High);
  TM16XXBase.prototype.send(0x42);
  for (var i = 0; i < 4; i++) {
    keys |= (TM16XXBase.prototype.receive() << i);
  }

  strobe.write(PinState.Low);
  return keys;
};

TM1638.prototype.constructor = TM1638;
inherits(TM1638, TM16XXBase);

module.exports = TM1638;
