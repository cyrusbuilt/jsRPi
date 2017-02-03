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

const RaspiGpio = require('../IO/RaspiGpio.js');
const TM16XXBase = require('./TM16XXBase.js');
const StringUtils = require('../StringUtils.js');
const PinState = require('../IO/PinState.js');

/**
 * @classdesc Controller class for the TM1638/TM1640 board.
 * It is a port of the TM1638 library by Ricardo Batista
 * URL: http://code.google.com/p/tm1638-library/
 * @extends {TM16XXBase}
 */
class TM1638 extends TM16XXBase {
  /**
   * Initializes a new instance of the jsrpi.LED.TM1638 class with the with the
   * pins for data, clock, and strobe, a flag indicating whether or not the
   * display should be active, and the intensity level.
   * @param {RaspiGpio} data      The data pin.
   * @param {RaspiGpio} clock     The clock pin.
   * @param {RaspiGpio} strobe    The strobe pin.
   * @param {Boolean} active      Set true to activate the display.
   * @param {Byte|Number} intensity The display intensity (brightness).
   * @constructor
   * @constructor
   */
  constructor(data, clock, strobe, active, intensity) {
    super(data, clock, strobe, active, intensity);
  }

  /**
   * Sets the display to hex number.
   * @param  {Number} number An unsigned long number to display (gets converted
   * to hex).
   */
  setDisplayToHexNumber(number) {
    super.setDisplayToString("0x" + number.toString(16));
  }

  /**
   * Sets the display to a decimal number at the specified starting position.
   * @param  {Number} number       The number to set in the display (if out of
   * range, display will be cleared).
   * @param  {Byte|Number} dots      Set true to turn on dots.
   * @param  {Byte|Number} startPos  The starting position to place the number at.
   * @param  {Boolean} leadingZeros  Set true to lead the number with zeros.
   */
  setDisplayToDecNumberAt(number, dots, startPos, leadingZeros) {
    if (number > 99999999) {
      super.setDisplayToError();
    }
    else {
      let digit = 0;
      let pos = 0;
      let ldot = false;
      let displays = super._getDisplays();
      for (let i = 0; i < (displays - startPos); i++) {
        pos = (displays - i - 1);
        ldot = ((dots & (1 << i)) !== 0);
        if (number !== 0) {
          digit = (number % 10);
          super.setDisplayDigit(digit, pos, ldot);
          number /= 10;
        }
        else {
          if (leadingZeros) {
            digit = 0;
            super.setDisplayDigit(digit, pos, ldot);
          }
          else {
            super.clearDisplayDigit(pos, ldot);
          }
        }
      }
    }
  }

  /**
   * Sets the display to a decimal number.
   * @param  {Number} number        The number to set in the display.
   * @param  {Byte|Number} dots     Set true to turn on the dots.
   * @param  {Boolean} leadingZeros Set true to lead the number with zeros.
   */
  setDisplayToDecNumber(number, dots, leadingZeros) {
    this.setDisplayToDecNumberAt(number, dots, 0, leadingZeros);
  }

  /**
   * Sends a character to the display.
   * @param  {Byte|Number} pos  The position at which to set the character.
   * @param  {Byte|Number} data The data (character) to set in the display.
   * @param  {Boolean} dot      Set true to turn on the dots.
   * @override
   */
  sendChar(pos, data, dot) {
    let address = (pos << 1);
    let one = StringUtils.convertStringToByte("10000000");
    let zero = StringUtils.convertStringToByte("00000000");
    let ldata = (data | (dot ? one : zero));
    super.sendData(address, ldata);
  }

  /**
   * Sets the display to signed a decimal number.
   * @param  {Number} number        The signed decimal number to set in the display.
   * @param  {Byte|Number} dots     Set true to turn on the dots.
   * @param  {Boolean} leadingZeros Set true to lead the number with zeros.
   */
  setDisplayToSignedDecNumber(number, dots, leadingZeros) {
    if (number >= 0) {
      this.setDisplayToDecNumberAt(number, dots, 0, leadingZeros);
    }
    else {
      number = -number;
      if (number > 9999999) {
        super.setDisplayToError();
      }
      else {
        this.setDisplayToDecNumberAt(number, dots, 1, leadingZeros);
        this.sendChar(0, TM1638.CHAR_MAP['-'], (dots & 0x80) !== 0);
      }
    }
  }

  /**
   * Sets the display to a binary number.
   * @param  {Byte|Number} number The binary number to set in the display.
   * @param  {ByteNumber} dots    Set true to turn on the dots.
   */
  setDisplayToBinNumber(number, dots) {
    let digit = 0;
    let pos = 0;
    let ldot = false;
    let displays = TM16XXBase.prototype._getDisplays();
    for (let i = 0; i < displays; i++) {
      digit = ((number & (1 << i)) === 0 ? 0 : 1);
      pos = (displays - i - 1);
      ldot = ((dots & (1 << i)) !== 0);
      super.setDisplayDigit(digit, pos, ldot);
    }
  }

  /**
   * Sets the color of the character or digit at the specified position.
   * @param  {TM1638LedColor} color The color to set the digit/character to.
   * @param  {Byte|Number} pos      The position of the character to change the
   * color of.
   */
  setLed(color, pos) {
    super.sendData(((pos << 1) + 1), color);
  }

  /**
   * Gets a byte representing the buttons pushed. The display has 8
   * buttons, each representing one bit in the byte.
   * @return {Byte|Number} The push buttons.
   */
  getPushButtons () {
    let keys = 0;
    let strobe = super._getStrobe();
    strobe.write(PinState.High);
    super.send(0x42);
    for (let i = 0; i < 4; i++) {
      keys |= (super.receive() << i);
    }

    strobe.write(PinState.Low);
    return keys;
  }
}

module.exports = TM1638;
