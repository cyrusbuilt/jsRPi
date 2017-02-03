"use strict";

//
//  PinMode.js
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
//

/**
 * The mode of the GPIO pin.
 * @enum {Number}
 */
const PinMode = {
  /**
   * Pin is an input.
   * @type {Number}
   */
  IN : 0,

  /**
   * Pin is an output.
   * @type {Number}
   */
  OUT : 1,

  /**
   * Pin is a PWM (Pulse-Width Modulation) output.
   * @type {Number}
   */
  PWM : 2,

  /**
   * Pin is in clock mode.
   * @type {Number}
   */
  CLOCK : 3,

  /**
   * Set internal pull-up resistor.
   * @type {Number}
   */
  UP : 2,

  /**
   * Set internal pull-down resistor.
   * @type {Number}
   */
  DOWN : 1,

  /**
   * Sets mode to none.
   * @type {Number}
   */
  TRI : 0
};

module.exports = PinMode;
