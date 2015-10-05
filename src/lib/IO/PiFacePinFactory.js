"use strict";
//
//  PiFacePinFactory.js
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
 * @fileOverview Contains factory methods for creating PiFace digital I/O's.
 *
 * @module PiFacePinFactory
 * @requires PinMode
 * @requires PinState
 * @requires PinPullResistance
 * @requires PiFaceGpioDigital
 */

var PinMode = require('./PinMode.js');
var PinState = require('./PinState.js');
var PinPullResistance = require('./PinPullResistance.js');
var PiFaceGpioDigital = require('./PiFaceGpioDigital.js');

/**
 * Factory method for creating a PiFace digital output pin.
 * @param  {PiFacePins} pin  The pin to create an output for.
 * @param  {String} name (Optional) The name of the pin. If not specified, the
 * default hardware name of the pin will be used instead.
 * @return {PiFaceGpioDigital}      A PiFace digital output.
 * @throws {IOException}
 */
var createOutputPin = function(pin, name) {
  name = name || pin.name;
  var pfgd = new PiFaceGpioDigital(pin, PinState.Low, pin.value, PiFaceGpioDigital.SPI_SPEED);
  pfgd.pinName = name;
  pfgd.setMode(PinMode.OUT);
  pfgd.setPullResistance(PinPullResistance.OFF);
  return pfgd;
};

/**
 * Factory method for creating a PiFace digital input pin with the internal
 * pull-up resistor enable.
 * @param  {PiFacePins} pin  The pin to create an output for.
 * @param  {String} name (Optional) The name of the pin. If not specified, the
 * default hardware name of the pin will be used instead.
 * @return {PiFaceGpioDigital}      A PiFace digital output.
 * @throws {IOException}
 */
var createInputPin = function(pin, name) {
  name = name || pin.name;
  var pfgd = new PiFaceGpioDigital(pin, PinState.Low, pin.value, PiFaceGpioDigital.SPI_SPEED);
  pfgd.pinName = name;
  pfgd.setMode(PinMode.IN);
  pfgd.setPullResistance(PinPullResistance.PULL_UP);
  return pfgd;
};

module.exports.createOutputPin = createOutputPin;
module.exports.createInputPin = createInputPin;
