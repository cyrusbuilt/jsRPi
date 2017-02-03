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

const DeviceBase = require('../DeviceBase.js');
const PiBrellaInterface = require('./PiBrellaInterface.js');
const PiBrellaInput = require('./PiBrellaInput.js');
const PiBrellaOutput = require('./PiBrellaOutput.js');
const LEDComponent = require('../../Components/Lights/LEDComponent.js');
const ButtonComponent = require('../../Components/Button/ButtonComponent.js');
const BuzzerComponent = require('../../Components/Buzzers/BuzzerComponent.js');
const PinState = require('../../IO/PinState.js');

/**
* @classdesc Base class for PiBrella device abstractions.
* @implements {PiBrellaInterface}
* @extends {DeviceBase}
*/
class PiBrellaBase extends PiBrellaInterface {
  /**
   * Initializes a new instance of the jsrpi.Devices.PiBrella.PiBrellaBase class.
   * @constructor
   */
  constructor() {
    super();

    this._base = new DeviceBase();

    this._inputs = [
      PiBrellaInput.A,
      PiBrellaInput.B,
      PiBrellaInput.C,
      PiBrellaInput.D,
      PiBrellaInput.BUTTON
    ];

    this._inputs[0].pinName = "INPUT A";
    this._inputs[1].pinName = "INPUT B";
    this._inputs[2].pinName = "INPUT C";
    this._inputs[3].pinName = "INPUT D";
    this._inputs[4].pinName = "BUTTON";
    for (let inp of this._inputs) {
      inp.provision();
    }

    this._outputs = [
      PiBrellaOutput.E,
      PiBrellaOutput.F,
      PiBrellaOutput.G,
      PiBrellaOutput.H,
      PiBrellaOutput.LED_RED,
      PiBrellaOutput.LED_YELLOW,
      PiBrellaOutput.LED_GREEN
    ];

    this._outputs[0].pinName = "OUTPUT E";
    this._outputs[1].pinName = "OUTPUT F";
    this._outputs[2].pinName = "OUTPUT G";
    this._outputs[3].pinName = "OUTPUT H";
    this._outputs[4].pinName = "RED LED";
    this._outputs[5].pinName = "YELLOW LED";
    this._outputs[6].pinName = "GREEN LED";
    for (let out of this._outputs) {
      out.provision();
    }

    this._leds = [
      new LEDComponent(this._outputs[4]),
      new LEDComponent(this._outputs[5]),
      new LEDComponent(this._outputs[6])
    ];

    this._button = new ButtonComponent(this._inputs[4]);

    this._buzzer = new BuzzerComponent(PiBrellaOutput.BUZZER);
    this._buzzer.componentName = "PIBRELLA BUZZER";
    this._buzzer.stop();
  }

  /**
   * Gets or sets the device name
   * @property {String} deviceName - The device name.
   * @override
   */
  get deviceName() {
    return this._base.deviceName;
  }

  set deviceName(name) {
    this._base.deviceName = name;
  }

  /**
   * Gets or sets the object this device is tagged with.
   * @property {Object} tag - The tag.
   * @override
   */
  get tag() {
    return this._base.tag;
  }

  set tag(t) {
    this._base.tag = t;
  }

  /**
  * Determines whether or not the current instance has been disposed.
  * @property {Boolean} isDisposed - true if disposed; Otherwise, false.
  * @readonly
  * @override
  */
  get isDisposed () {
    return this._base.isDisposed;
  }

  /**
  * Gets the custom property collection.
  * @property {Array} propertyCollection - The property collection.
  * @readonly
  * @override
  */
  get propertyCollection() {
    return this._base.propertyCollection;
  }

  /**
  * Checks to see if the property collection contains the specified key.
  * @param  {String}  key The key name of the property to check for.
  * @return {Boolean} true if the property collection contains the key;
  * Otherwise, false.
  * @override
  */
  hasProperty(key) {
    return this._base.hasProperty(key);
  }

  /**
  * Sets the value of the specified property. If the property does not already exist
  * in the property collection, it will be added.
  * @param  {String} key   The property name (key).
  * @param  {String} value The value to assign to the property.
  */
  setProperty(key, value) {
    this._base.setProperty(key, value);
  }

  /**
  * Releases all resources used by the PiBrellaBase object.
  * @override
  */
  dispose() {
    if (this.isDisposed) {
      return;
    }

    for (let out of this._outputs) {
      out.write(PinState.Low);
    }

    this._inputs = undefined;
    this._outputs = undefined;
    this._leds = undefined;
    this._button = undefined;
    this._buzzer = undefined;

    this._base.dispose();
  }

  /**
  * Gets the red LED.
  * @property {GpioStandard} redLED - The red LED.
  * @override
  * @readonly
  */
  get redLED() {
    return this._leds[0];
  }

  /**
  * Gets the yellow LED.
  * @property {GpioStandard} yellowLED - The yellow LED.
  * @override
  * @readonly
  */
  get yellowLED() {
    return this._leds[1];
  }

  /**
  * Gets the green LED.
  * @property {GpioStandard} greenLED - The green LED.
  * @readonly
  * @override
  */
  get greenLED() {
    return this._leds[2];
  }

  /**
  * Gets an array of all the LEDs.
  * @property {Array} LEDs - All of the LEDs.
  * @readonly
  * @override
  */
  get LEDs() {
    return this._leds;
  }

  /**
  * Gets the PiBrella button input.
  * @property {GpioStandard} button - The button.
  * @readonly
  * @override
  */
  get button() {
    return this._button;
  }

  /**
  * Gets the buzzer output component.
  * @property {GpioStandard} buzzer - The buzzer.
  * @readonly
  * @override
  */
  get buzzer() {
    return this._buzzer;
  }

  /**
  * Gets PiBrella input A.
  * @property {GpioStandard} inputA - The input A.
  * @readonly
  * @override
  */
  get inputA() {
    return this._inputs[0];
  }

  /**
  * Gets PiBrella input B.
  * @property {GpioStandard} inputB - The input B.
  * @readonly
  * @override
  */
  get inputB() {
    return this._inputs[1];
  }

  /**
  * Gets PiBrella input C.
  * @property {GpioStandard} inputC - The input C.
  * @readonly
  * @override
  */
  get inputC() {
    return this._inputs[2];
  }

  /**
  * Gets PiBrella input D.
  * @property {GpioStandard} inputD - The input D.
  * @readonly
  * @override
  */
  get inputD() {
    return this._inputs[3];
  }

  /**
  * Gets all the PiBrella inputs (array of GpioStandard inputs).
  * @property {GpioStandard} inputs - All the PiBrella inputs.
  * @readonly
  * @override
  */
  get inputs() {
    return this._inputs;
  }

  /**
  * Gets PiBrella output E.
  * @property {GpioStandard} outputE - The output E.
  * @readonly
  * @override
  */
  get outputE() {
    return this._outputs[0];
  }

  /**
  * Gets PiBrella output F.
  * @property {GpioStandard} outputF - The output F.
  * @readonly
  * @override
  */
  get outputF() {
    return this._outputs[1];
  }

  /**
  * Gets PiBrella output G.
  * @property {GpioStandard} outputG - The output G.
  * @readonly
  * @override
  */
  get outputG() {
    return this._outputs[2];
  }

  /**
  * Gets PiBrella output H.
  * @property {GpioStandard} outputH - The output H.
  * @readonly
  * @override
  */
  get outputH() {
    return this._outputs[3];
  }

  /**
  * Gets all the PiBrella outputs (array of GpioStandard outputs).
  * @property {Array} outputs - All of the PiBrella outputs.
  * @readonly
  * @override
  */
  get outputs() {
    return this._outputs;
  }
}

module.exports = PiBrellaBase;
