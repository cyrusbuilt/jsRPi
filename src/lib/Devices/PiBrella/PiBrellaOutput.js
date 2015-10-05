"use strict";
//
//  PiBrellaOutput.js
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

/**
 * @fileOverview PiBrella outputs.
 *
 * @module PiBrellaOutput
 * @requires GpioStandard
 * @requires GpioPins
 * @requires PinMode
 * @requires PinState
 */

 var GpioStandard = require('../../IO/GpioStandard.js');
 var GpioPins = require('../../IO/GpioPins.js');
 var PinMode = require('../../IO/PinMode.js');
 var PinState = require('../../IO/PinState.js');

/**
 * PiBrella output E.
 * @type {GpioStandard}
 * @const
 */
module.exports.E = new GpioStandard(GpioPins.V2_GPIO03, PinMode.OUT, PinState.Low);

/**
 * PiBrella output F.
 * @type {GpioStandard}
 * @const
 */
module.exports.F = new GpioStandard(GpioPins.GPIO04, PinMode.OUT, PinState.Low);

/**
 * PiBrella output G.
 * @type {GpioStandard}
 * @const
 */
module.exports.G = new GpioStandard(GpioPins.Pin05, PinMode.OUT, PinState.Low);

/**
 * PiBrella output H.
 * @type {GpioStandard}
 * @const
 */
module.exports.H = new GpioStandard(GpioPins.V2_P5_Pin06, PinMode.OUT, PinState.Low);

/**
 * PiBrella red LED.
 * @type {GpioStandard}
 * @const
 */
module.exports.LED_RED = new GpioStandard(GpioPins.V2_GPIO02, PinMode.OUT, PinState.Low);

/**
 * PiBrella yellow LED.
 * @type {GpioStandard}
 * @const
 */
module.exports.LED_YELLOW = new GpioStandard(GpioPins.GPIO00, PinMode.OUT, PinState.Low);

/**
 * PiBrella green LED.
 * @type {GpioStandard}
 * @const
 */
module.exports.LED_GREEN = new GpioStandard(GpioPins.GPIO07, PinMode.OUT, PinState.Low);

/**
 * PiBrella buzzer.
 * @type {GpioStandard}
 * @const
 */
module.exports.BUZZER = new GpioStandard(GpioPins.GPIO01, PinMode.PWM, PinState.Low);
