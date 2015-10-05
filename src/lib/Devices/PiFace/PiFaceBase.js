"use strict";
//
//  PiFaceBase.js
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
var extend = require('extend');
var DeviceBase = require('../DeviceBase.js');
var PiFaceInterface = require('./PiFaceInterface.js');
var PiFacePinFactory = require('../../IO/PiFacePinFactory.js');
var PiFacePins = require('../../IO/PiFacePins.js');
var PiFaceGpioDigital = require('../../IO/PiFaceGpioDigital.js');
var RelayComponent = require('../../Components/Relays/RelayComponent.js');
var SwitchComponent = require('../../Components/Switches/SwitchComponent.js');
var LEDComponent = require('../../Components/Lights/LEDComponent.js');

/**
 * @classdesc Base class for PiFace device abstractions.
 * @param {Number} spiSpeed     The clock speed to set the bus to. Can be powers
 * of 2 (500KHz minimum up to 32MHz maximum). If not specified, the default of
 * SPI_SPEED (1MHz) will be used.]
 * @throws {IOException} if unable to read or write to the SPI bus.
 * @constructor
 * @implements {PiFaceInterface}
 * @extends {DeviceBase}
 */
function PiFaceBase(spiSpeed) {
  PiFaceInterface.call(this);
  DeviceBase.call(this);

  var self = this;
  var _spiSpeed = spiSpeed || PiFaceGpioDigital.SPI_SPEED;
  var _inputPins = [
    PiFacePinFactory.createInputPin(PiFacePins.Input00, PiFacePins.Input00.name),
    PiFacePinFactory.createInputPin(PiFacePins.Input01, PiFacePins.Input01.name),
    PiFacePinFactory.createInputPin(PiFacePins.Input02, PiFacePins.Input02.name),
    PiFacePinFactory.createInputPin(PiFacePins.Input03, PiFacePins.Input03.name),
    PiFacePinFactory.createInputPin(PiFacePins.Input04, PiFacePins.Input04.name),
    PiFacePinFactory.createInputPin(PiFacePins.Input05, PiFacePins.Input05.name),
    PiFacePinFactory.createInputPin(PiFacePins.Input06, PiFacePins.Input06.name),
    PiFacePinFactory.createInputPin(PiFacePins.Input07, PiFacePins.Input07.name)
  ];

  var _outputPins = [
    PiFacePinFactory.createOutputPin(PiFacePins.Output00, PiFacePins.Output00.name),
    PiFacePinFactory.createOutputPin(PiFacePins.Output01, PiFacePins.Output01.name),
    PiFacePinFactory.createOutputPin(PiFacePins.Output02, PiFacePins.Output02.name),
    PiFacePinFactory.createOutputPin(PiFacePins.Output03, PiFacePins.Output03.name),
    PiFacePinFactory.createOutputPin(PiFacePins.Output04, PiFacePins.Output04.name),
    PiFacePinFactory.createOutputPin(PiFacePins.Output05, PiFacePins.Output05.name),
    PiFacePinFactory.createOutputPin(PiFacePins.Output06, PiFacePins.Output06.name),
    PiFacePinFactory.createOutputPin(PiFacePins.Output07, PiFacePins.Output07.name)
  ];

  var _relays = [
    new RelayComponent(_outputPins[0]),
    new RelayComponent(_outputPins[1])
  ];

  var _switches = [
    new SwitchComponent(_outputPins[0]),
    new SwitchComponent(_outputPins[1]),
    new SwitchComponent(_outputPins[2]),
    new SwitchComponent(_outputPins[3])
  ];

  var _leds = [
    new LEDComponent(_outputPins[0]),
    new LEDComponent(_outputPins[1]),
    new LEDComponent(_outputPins[2]),
    new LEDComponent(_outputPins[3]),
    new LEDComponent(_outputPins[4]),
    new LEDComponent(_outputPins[5]),
    new LEDComponent(_outputPins[6]),
    new LEDComponent(_outputPins[7])
  ];

  /**
   * Gets the input pins.
   * @return {Array} An array of PiFaceGPIO objects representing PiFace inputs.
   */
  this.getInputPins = function() {
    return _inputPins;
  };

  /**
   * Gets the output pins.
   * @return {Array} An array of PiFaceGPIO objects representing PiFace outputs.
   */
  this.getOutputPins = function() {
    return _outputPins;
  };

  /**
   * Gets the relays.
   * @return {Array} An array of Relay objects representing the relays on the PiFace.
   */
  this.getRelays = function() {
    return _relays;
  };

  /**
   * Gets the switches.
   * @return {Array} An array of Switch objects representing the switches on the PiFace.
   */
  this.getSwitches = function() {
    return _switches;
  };

  /**
   * Gets the LEDs.
   * @return {Array} An array of LEDInterface objects representing the LEDs on the PiFace.
   */
  this.getLEDs = function() {
    return _leds;
  };
}

PiFaceBase.prototype.constructor = PiFaceBase;
inherits(PiFaceBase, PiFaceInterface);

module.exports = extend(true, PiFaceBase, DeviceBase);
