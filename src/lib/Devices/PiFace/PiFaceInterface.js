"use strict";
//
//  PiFaceInterface.js
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
var Device = require('../Device.js');

/**
 * An interface for a PiFace device abstraction.
 * @interface
 * @extends {Device}
 */
function PiFaceInterface() {
  Device.call(this);
}

PiFaceInterface.prototype.constructor = PiFaceInterface;
inherits(PiFaceInterface, Device);

/**
 * In a derived class, gets the input pins.
 * @return {Array} An array of PiFaceGPIO objects representing PiFace inputs.
 */
PiFaceInterface.prototype.getInputPins = function() { return []; };

/**
 * In a derived class, gets the output pins.
 * @return {Array} An array of PiFaceGPIO objects representing PiFace outputs.
 */
PiFaceInterface.prototype.getOutputPins = function() { return []; };

/**
 * In a derived class, gets the relays.
 * @return {Array} An array of Relay objects representing the relays on the PiFace.
 */
PiFaceInterface.prototype.getRelays = function() { return []; };

/**
 * In a derived class, gets the switches.
 * @return {Array} An array of Switch objects representing the switches on the PiFace.
 */
PiFaceInterface.prototype.getSwitches = function() { return []; };

/**
 * In a derived class, gets the LEDs.
 * @return {Array} An array of LEDInterface objects representing the LEDs on the PiFace.
 */
PiFaceInterface.prototype.getLEDs = function() { return []; };

module.exports = PiFaceInterface;