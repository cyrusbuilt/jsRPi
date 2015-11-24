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
var DeviceBase = require('../DeviceBase.js');
var PiFaceInterface = require('./PiFaceInterface.js');
var PiFacePinFactory = require('../../IO/PiFacePinFactory.js');
var PiFacePins = require('../../IO/PiFacePins.js');
var PiFaceGpioDigital = require('../../IO/PiFaceGpioDigital.js');
var PiFaceRelay = require('./PiFaceRelay.js');
var PiFaceSwitch = require('./PiFaceSwitch.js');
var PiFaceLED = require('./PiFaceLED.js');
var RelayComponent = require('../../Components/Relays/RelayComponent.js');
var SwitchComponent = require('../../Components/Switches/SwitchComponent.js');
var LEDComponent = require('../../Components/Lights/LEDComponent.js');
var ObjectDisposedException = require('../../ObjectDisposedException.js');

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

  var self = this;
  var _base = new DeviceBase();
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
    new RelayComponent(_outputPins[PiFaceRelay.K0]),
    new RelayComponent(_outputPins[PiFaceRelay.K1])
  ];

  var _switches = [
    new SwitchComponent(_inputPins[PiFaceSwitch.S1]),
    new SwitchComponent(_inputPins[PiFaceSwitch.S2]),
    new SwitchComponent(_inputPins[PiFaceSwitch.S3]),
    new SwitchComponent(_inputPins[PiFaceSwitch.S4])
  ];

  var _leds = [
    new LEDComponent(_outputPins[PiFaceLED.LED0]),
    new LEDComponent(_outputPins[PiFaceLED.LED1]),
    new LEDComponent(_outputPins[PiFaceLED.LED2]),
    new LEDComponent(_outputPins[PiFaceLED.LED3]),
    new LEDComponent(_outputPins[PiFaceLED.LED4]),
    new LEDComponent(_outputPins[PiFaceLED.LED5]),
    new LEDComponent(_outputPins[PiFaceLED.LED6]),
    new LEDComponent(_outputPins[PiFaceLED.LED7])
  ];

  /**
  * Device name property.
  * @property {String}
  */
  this.deviceName = _base.deviceName;

  /**
  * Tag property.
  * @property {Object}
  */
  this.tag = _base.tag;

  /**
  * Determines whether or not the current instance has been disposed.
  * @return {Boolean} true if disposed; Otherwise, false.
  * @override
  */
  this.isDisposed = function() {
    return _base.isDisposed();
  };

  /**
  * Gets the property collection.
  * @return {Array} A custom property collection.
  * @override
  */
  this.getPropertyCollection = function() {
    return _base.getPropertyCollection();
  };

  /**
  * Checks to see if the property collection contains the specified key.
  * @param  {String}  key The key name of the property to check for.
  * @return {Boolean} true if the property collection contains the key;
  * Otherwise, false.
  * @override
  */
  this.hasProperty = function(key) {
    return _base.hasProperty(key);
  };

  /**
  * Sets the value of the specified property. If the property does not already exist
  * in the property collection, it will be added.
  * @param  {String} key   The property name (key).
  * @param  {String} value The value to assign to the property.
  */
  this.setProperty = function(key, value) {
    _base.setProperty(key, value);
  };

  /**
  * Returns the string representation of this object. In this case, it simply
  * returns the component name.
  * @return {String} The name of this component.
  */
  this.toString = function() {
    return self.deviceName;
  };

  /**
  * Releases all managed resources used by this instance.
  * @override
  */
  this.dispose = function() {
    if (_base.isDisposed()) {
      return;
    }


    for (var i = 0; i < _relays.length; i++) {
      _relays[i].dispose();
    }

    for (var j = 0; j < _switches.length; j++) {
      _switches[j].dispose();
    }

    for (var k = 0; k < _leds.length; k++) {
      _leds[k].dispose();
    }

    _relays = undefined;
    _switches = undefined;
    _leds = undefined;
    _inputPins = undefined;
    _outputPins = undefined;
    _base.dispose();
  };

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

module.exports = PiFaceBase;
