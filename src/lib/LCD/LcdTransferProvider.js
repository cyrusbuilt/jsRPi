"use strict";

//
//  LcdTransferProvider.js
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

const Disposable = require('../Disposable.js');

/**
 * LCD data transfer provider interface.
 * @interface
 * @extends {Disposable}
 */
class LcdTransferProvider extends Disposable {
  /**
   * Initializes a new instance of the jsrpi.LCD.LcdTransferProvider class. This
   * is the default constructor.
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * In derived classes, send the specified data, mode and backlight.
   * @param  {Byte|Number} data   The data to send.
   * @param  {PinState} mode      Mode for register-select pin (PinState.High =
   * on, PinState.Low = off).
   * @param  {Boolean} backlight Turns on the backlight.
   */
  send(data, mode, backlight) {}

  /**
   * In derived classes, Gets a value indicating whether this instance
	 * is in four-bit mode.
   * @property {Boolean} isFourBitMode - true if four-bit mode; Otherwise,
   * false.
   */
  get isFourBitMode() { return false; }
}

module.exports = LcdTransferProvider;
