"use strict";
//
//  PiBrellaBase.js
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
var PiBrellaInterface = require('./PiBrellaInterface.js');
var PiBrellaInput = require('./PiBrellaInput.js');
var PiBrellaOutput = require('./PiBrellaOutput.js');
var LEDComponent = require('../../Components/Lights/LEDComponent.js');
var ButtonComponent = require('../../Components/Button/ButtonComponent.js');
var BuzzerComponent = require('../../Components/Buzzers/BuzzerComponent.js');

/**
* @classdesc Base class for PiBrella device abstractions.
* @constructor
* @implements {PiBrellaInterface}
* @extends {DeviceBase}
*/
function PiBrellaBase() {
  PiBrellaInterface.call(this);

  var _base = new DeviceBase();

  var _inputs = [
    PiBrellaInput.A,
    PiBrellaInput.B,
    PiBrellaInput.C,
    PiBrellaInput.D,
    PiBrellaInput.BUTTON
  ];

  _inputs[0].pinName = "INPUT A";
  _inputs[1].pinName = "INPUT B";
  _inputs[2].pinName = "INPUT C";
  _inputs[3].pinName = "INPUT D";
  _inputs[4].pinName = "BUTTON";
  for (var i = 0; i < _inputs.length; i++) {
    _inputs[i].provision();
  }

  var _outputs = [
    PiBrellaOutput.E,
    PiBrellaOutput.F,
    PiBrellaOutput.G,
    PiBrellaOutput.H,
    PiBrellaOutput.LED_RED,
    PiBrellaOutput.LED_YELLOW,
    PiBrellaOutput.LED_GREEN
  ];

  _outputs[0].pinName = "OUTPUT E";
  _outputs[1].pinName = "OUTPUT F";
  _outputs[2].pinName = "OUTPUT G";
  _outputs[3].pinName = "OUTPUT H";
  _outputs[4].pinName = "RED LED";
  _outputs[5].pinName = "YELLOW LED";
  _outputs[6].pinName = "GREEN LED";
  for (var j = 0; j < _outputs.length; j++) {
    _outputs[j].provision();
  }

  var _leds = [
    new LEDComponent(_outputs[4]),
    new LEDComponent(_outputs[5]),
    new LEDComponent(_outputs[6])
  ];

  var _button = new ButtonComponent(_inputs[4]);

  var _buzzer = new BuzzerComponent(PiBrellaOutput.BUZZER);
  _buzzer.componentName = "PIBRELLA BUZZER";
  _buzzer.stop();

  /**
  * Device name property.
  * @property {String}
  */
  this.deviceName = "PiBrella";

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
  * Releases all resources used by the PiBrellaBase object.
  * @override
  */
  this.dispose = function() {
    if (_base.isDisposed()) {
      return;
    }

    _inputs = undefined;
    _outputs = undefined;
    _leds = undefined;
    _button = undefined;
    _buzzer = undefined;

    _base.dispose();
  };

  /**
  * Gets the red LED.
  * @return {GpioStandard} The red LED output component.
  * @override
  */
  this.getRedLED = function() {
    return _leds[0];
  };

  /**
  * Gets the yellow LED.
  * @return {GpioStandard} The yellow LED output component.
  * @override
  */
  this.getYellowLED = function() {
    return _leds[1];
  };

  /**
  * Gets the green LED.
  * @return {GpioStandard} The green LED output component.
  * @override
  */
  this.getGreenLED = function() {
    return _leds[2];
  };

  /**
  * Gets the LEDs.
  * @return {Array} The LEDs (array of GpioStandard output objects).
  * @override
  */
  this.getLEDs = function() {
    return _leds;
  };

  /**
  * Gets the button.
  * @return {GpioStandard} The PiBrella button input.
  * @override
  */
  this.getButton = function() {
    return _button;
  };

  /**
  * Gets the buzzer.
  * @return {GpioStandard} The buzzer output component.
  * @override
  */
  this.getBuzzer = function() {
    return _buzzer;
  };

  /**
  * Gets PiBrella input A.
  * @return {GpioStandard} Input A.
  * @override
  */
  this.getInputA = function() {
    return _inputs[0];
  };

  /**
  * Gets PiBrella input B.
  * @return {GpioStandard} Input B.
  * @override
  */
  this.getInputB = function() {
    return _inputs[1];
  };

  /**
  * Gets PiBrella input C.
  * @return {GpioStandard} Input C.
  * @override
  */
  this.getInputC = function() {
    return _inputs[2];
  };

  /**
  * Gets PiBrella input D.
  * @return {GpioStandard} Input D.
  * @override
  */
  this.getInputD = function() {
    return _inputs[3];
  };

  /**
  * Gets all the PiBrella inputs.
  * @return {GpioStandard} The inputs (array of GpioStandard inputs).
  * @override
  */
  this.getInputs = function() {
    return _inputs;
  };

  /**
  * Gets PiBrella output E.
  * @return {GpioStandard} Output E.
  * @override
  */
  this.getOutputE = function() {
    return _outputs[0];
  };

  /**
  * Gets PiBrella output F.
  * @return {GpioStandard} Output F.
  * @override
  */
  this.getOutputF = function() {
    return _outputs[1];
  };

  /**
  * Gets PiBrella output G.
  * @return {GpioStandard} Output G.
  * @override
  */
  this.getOutputG = function() {
    return _outputs[2];
  };

  /**
  * Gets PiBrella output H.
  * @return {GpioStandard} Output H.
  * @override
  */
  this.getOutputH = function() {
    return _outputs[3];
  };

  /**
  * Gets all the PiBrella outputs.
  * @return {Array} The outputs (array of GpioStandard outputs).
  * @override
  */
  this.getOutputs = function() {
    return _outputs;
  };
}

PiBrellaBase.prototype.constructor = PiBrellaBase;
inherits(PiBrellaBase, PiBrellaInterface);

module.exports = PiBrellaBase;
