"use strict";
//
//  PiBrellaInput.js
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
 * @fileOverview PiBrella inputs.
 *
 * @module PiBrellaInput
 * @requires GpioStandard
 * @requires GpioPins
 * @requires PinMode
 * @requires PinState
 */

const GpioStandard = require('../../IO/GpioStandard.js');
const GpioPins = require('../../IO/GpioPins.js');
const PinMode = require('../../IO/PinMode.js');
const PinState = require('../../IO/PinState.js');

/**
 * PiBrella input A.
 * @type {GpioStandard}
 * @const
 */
module.exports.A = new GpioStandard(GpioPins.Pin13, PinMode.IN, PinState.Low);

/**
 * PiBrella input B.
 * @type {GpioStandard}
 * @const
 */
module.exports.B = new GpioStandard(GpioPins.GPIO11, PinMode.IN, PinState.Low);

/**
 * PiBrella input C.
 * @type {GpioStandard}
 * @const
 */
module.exports.C = new GpioStandard(GpioPins.GPIO10, PinMode.IN, PinState.Low);

/**
 * PiBrella input D.
 * @type {GpioStandard}
 * @const
 */
module.exports.D = new GpioStandard(GpioPins.Pin12, PinMode.IN, PinState.Low);

/**
 * PiBrella button input.
 * @type {GpioStandard}
 * @const
 */
module.exports.BUTTON = new GpioStandard(GpioPins.GPIO14, PinMode.IN, PinState.Low);
