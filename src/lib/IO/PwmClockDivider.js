"use strict";

//
//  PwmClockDivider.js
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
 * PWM clock divider values.
 * @enum {Number}
 */
const PwmClockDivider = {
  /**
   * Divide clock by a factor of 1.
   * @type {Number}
   */
  Divisor1 : 1,

  /**
   * Divide clock by a factor of 2.
   * @type {Number}
   */
  Divisor2 : 2,

  /**
   * Divide clock by a factor of 4.
   * @type {Number}
   */
  Divisor4 : 4,

  /**
   * Divide clock by a factor of 8.
   * @type {Number}
   */
  Divisor8 : 8,

  /**
   * Divide clock by a factor of 16.
   * @type {Number}
   */
  Divisor16 : 16,

  /**
   * Divide clock by a factor of 32.
   * @type {Number}
   */
  Divisor32 : 32,

  /**
   * Divide clock by a factor of 64.
   * @type {Number}
   */
  Divisor64 : 64,

  /**
   * Divide clock by a factor of 128.
   * @type {Number}
   */
  Divisor128 : 128,

  /**
   * Divide clock by a factor of 256.
   * @type {Number}
   */
  Divisor256 : 256,

  /**
   * Divide clock by a factor of 512.
   * @type {Number}
   */
  Divisor512 : 512,

  /**
   * Divide clock by a factor of 1024.
   * @type {Number}
   */
  Divisor1024 : 1024,

  /**
   * Divide clock by a factor of 2048.
   * @type {Number}
   */
  Divisor2048 : 2048
};

module.exports = PwmClockDivider;
