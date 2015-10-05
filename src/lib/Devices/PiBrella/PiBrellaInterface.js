"use strict";
//
//  PiBrellaInterface.js
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
 * PiBrella device abastraction interface.
 * @interface
 * @extends {Device}
 */
function PiBrellaInterface() {
  Device.call(this);
}

PiBrellaInterface.prototype.constructor = PiBrellaInterface;
inherits(PiBrellaInterface, Device);

/**
 * In a derived class, gets the red LED.
 * @return {GpioStandard} The red LED output component.
 */
PiBrellaInterface.prototype.getRedLED = function() { return null; };

/**
 * In a derived class, gets the yellow LED.
 * @return {GpioStandard} The yellow LED output component.
 */
PiBrellaInterface.prototype.getYellowLED = function() { return null; };

/**
 * In a derived class, gets the green LED.
 * @return {GpioStandard} The green LED output component.
 */
PiBrellaInterface.prototype.getGreenLED = function() { return null; };

/**
 * In a derived class, gets the LEDs.
 * @return {Array} The LEDs (array of GpioStandard output objects).
 */
PiBrellaInterface.prototype.getLEDs = function() { return []; };

/**
 * In a derived class, gets the button.
 * @return {GpioStandard} The PiBrella button input.
 */
PiBrellaInterface.prototype.getButton = function() { return null; };

/**
 * In a derived class, gets the buzzer.
 * @return {GpioStandard} The buzzer output component.
 */
PiBrellaInterface.prototype.getBuzzer = function() { return null; };

/**
 * In a derived class, gets PiBrella input A.
 * @return {GpioStandard} Input A.
 */
PiBrellaInterface.prototype.getInputA = function() { return null; };

/**
 * In a derived class, gets PiBrella input B.
 * @return {GpioStandard} Input B.
 */
PiBrellaInterface.prototype.getInputB = function() { return null; };

/**
 * In a derived class, gets PiBrella input C.
 * @return {GpioStandard} Input C.
 */
PiBrellaInterface.prototype.getInputC = function() { return null; };

/**
 * In a derived class, gets PiBrella input D.
 * @return {GpioStandard} Input D.
 */
PiBrellaInterface.prototype.getInputD = function() { return null; };

/**
 * In a derived class, gets all the PiBrella inputs.
 * @return {GpioStandard} The inputs (array of GpioStandard inputs).
 */
PiBrellaInterface.prototype.getInputs = function() { return []; };

/**
 * In a derived class, gets PiBrella output E.
 * @return {GpioStandard} Output E.
 */
PiBrellaInterface.prototype.getOutputE = function() { return null; };

/**
 * In a derived class, gets PiBrella output F.
 * @return {GpioStandard} Output F.
 */
PiBrellaInterface.prototype.getOutputF = function() { return null; };

/**
 * In a derived class, gets PiBrella output G.
 * @return {GpioStandard} Output G.
 */
PiBrellaInterface.prototype.getOutputG = function() { return null; };

/**
 * In a derived class, gets PiBrella output H.
 * @return {GpioStandard} Output H.
 */
PiBrellaInterface.prototype.getOutputH = function() { return null; };

/**
 * In a derived class, gets all the PiBrella outputs.
 * @return {Array} The outputs (array of GpioStandard outputs).
 */
PiBrellaInterface.prototype.getOutputs = function() { return []; };

module.exports = PiBrellaInterface;
