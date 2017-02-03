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

const DeviceBase = require('../DeviceBase.js');
const PiFaceInterface = require('./PiFaceInterface.js');
const PiFacePinFactory = require('../../IO/PiFacePinFactory.js');
const PiFacePins = require('../../IO/PiFacePins.js');
const PiFaceGpioDigital = require('../../IO/PiFaceGpioDigital.js');
const PiFaceRelay = require('./PiFaceRelay.js');
const PiFaceSwitch = require('./PiFaceSwitch.js');
const PiFaceLED = require('./PiFaceLED.js');
const RelayComponent = require('../../Components/Relays/RelayComponent.js');
const SwitchComponent = require('../../Components/Switches/SwitchComponent.js');
const LEDComponent = require('../../Components/Lights/LEDComponent.js');
const ObjectDisposedException = require('../../ObjectDisposedException.js');

/**
* @classdesc Base class for PiFace device abstractions.
* @implements {PiFaceInterface}
* @extends {DeviceBase}
*/
class PiFaceBase extends PiFaceInterface {
    /**
     * Initializes a new instance of the jsrpi.Devices.PiFace.PiFaceBase class
     * with the clock speed for the SPI bus.
     * @param {Number} spiSpeed     The clock speed to set the bus to. Can be powers
     * of 2 (500KHz minimum up to 32MHz maximum). If not specified, the default of
     * SPI_SPEED (1MHz) will be used.]
     * @throws {IOException} if unable to read or write to the SPI bus.
     * @constructor
     */
    constructor(spiSpeed) {
        super();

        this._base = new DeviceBase();
        this._spiSpeed = spiSpeed || PiFaceGpioDigital.SPI_SPEED;
        this._inputPins = [
          PiFacePinFactory.createInputPin(PiFacePins.Input00, PiFacePins.Input00.name),
          PiFacePinFactory.createInputPin(PiFacePins.Input01, PiFacePins.Input01.name),
          PiFacePinFactory.createInputPin(PiFacePins.Input02, PiFacePins.Input02.name),
          PiFacePinFactory.createInputPin(PiFacePins.Input03, PiFacePins.Input03.name),
          PiFacePinFactory.createInputPin(PiFacePins.Input04, PiFacePins.Input04.name),
          PiFacePinFactory.createInputPin(PiFacePins.Input05, PiFacePins.Input05.name),
          PiFacePinFactory.createInputPin(PiFacePins.Input06, PiFacePins.Input06.name),
          PiFacePinFactory.createInputPin(PiFacePins.Input07, PiFacePins.Input07.name)
        ];

        this._outputPins = [
          PiFacePinFactory.createOutputPin(PiFacePins.Output00, PiFacePins.Output00.name),
          PiFacePinFactory.createOutputPin(PiFacePins.Output01, PiFacePins.Output01.name),
          PiFacePinFactory.createOutputPin(PiFacePins.Output02, PiFacePins.Output02.name),
          PiFacePinFactory.createOutputPin(PiFacePins.Output03, PiFacePins.Output03.name),
          PiFacePinFactory.createOutputPin(PiFacePins.Output04, PiFacePins.Output04.name),
          PiFacePinFactory.createOutputPin(PiFacePins.Output05, PiFacePins.Output05.name),
          PiFacePinFactory.createOutputPin(PiFacePins.Output06, PiFacePins.Output06.name),
          PiFacePinFactory.createOutputPin(PiFacePins.Output07, PiFacePins.Output07.name)
        ];

        this._relays = [
          new RelayComponent(this._outputPins[PiFaceRelay.K0]),
          new RelayComponent(this._outputPins[PiFaceRelay.K1])
        ];

        this._switches = [
          new SwitchComponent(this._inputPins[PiFaceSwitch.S1]),
          new SwitchComponent(this._inputPins[PiFaceSwitch.S2]),
          new SwitchComponent(this._inputPins[PiFaceSwitch.S3]),
          new SwitchComponent(this._inputPins[PiFaceSwitch.S4])
        ];

        this._leds = [
          new LEDComponent(this._outputPins[PiFaceLED.LED0]),
          new LEDComponent(this._outputPins[PiFaceLED.LED1]),
          new LEDComponent(this._outputPins[PiFaceLED.LED2]),
          new LEDComponent(this._outputPins[PiFaceLED.LED3]),
          new LEDComponent(this._outputPins[PiFaceLED.LED4]),
          new LEDComponent(this._outputPins[PiFaceLED.LED5]),
          new LEDComponent(this._outputPins[PiFaceLED.LED6]),
          new LEDComponent(this._outputPins[PiFaceLED.LED7])
        ];
    }

    /**
    * Gets or sets the device name.
    * @property {String} deviceName - The devie name.
    * @override
    */
    get deviceName() {
        return this._base.deviceName;
    }

    set deviceName(name) {
        this._base.deviceName = name;
    }

    /**
     * Gets or sets the object to tag this device with.
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
    * @property {Boolean} isDisposed -  true if disposed; Otherwise, false.
    * @override
    * @readonly
    */
    get isDisposed() {
        return this._base.isDisposed;
    }

  /**
  * Gets the property collection.
  * @property {Array} propertyCollection -  A custom property collection.
  * @readonly
  * @override
  */
    get propertyCollection() {
        return this._base.getPropertyCollection;
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
    * @override
    */
    setProperty(key, value) {
        this._base.setProperty(key, value);
    }

    /**
    * Returns the string representation of this object. In this case, it simply
    * returns the component name.
    * @return {String} The name of this component.
    */
    toString() {
        return this.deviceName;
    }

    /**
    * Releases all managed resources used by this instance.
    * @override
    */
    dispose() {
        if (this._base.isDisposed) {
            return;
        }

        for (let rel of this._relays) {
            rel.dispose();
        }

        for (let sw of this._switches) {
            sw.dispose();
        }

        for (let led of this._leds) {
            led.dispose();
        }

        this._relays = undefined;
        this._switches = undefined;
        this._leds = undefined;
        this._inputPins = undefined;
        this._outputPins = undefined;
        this._base.dispose();
    }

    /**
    * Gets the input pins.
    * @property {Array} inputPins - An array of PiFaceGPIO objects representing
    * PiFace inputs.
    * @readonly
    * @override
    */
    get inputPins() {
        return this._inputPins;
    }

    /**
    * Gets the output pins.
    * @property {Array} outputPins - An array of PiFaceGPIO objects representing
    * PiFace outputs.
    * @readonly
    * @override
    */
    get outputPins() {
        return this._outputPins;
    }

    /**
    * Gets the relays.
    * @property {Array} relays - An array of Relay objects representing the
    * relays on the PiFace.
    * @readonly
    * @override
    */
    get relays() {
        return this._relays;
    }

    /**
    * Gets the switches.
    * @property {Array} switches - An array of Switch objects representing the
    * switches on the PiFace.
    * @readonly
    * @override
    */
    get switches() {
        return this._switches;
    }

    /**
    * Gets the LEDs.
    * @property {Array} LEDs -  An array of LEDInterface objects representing
    * the LEDs on the PiFace.
    * @readonly
    * @override
    */
    get LEDs() {
        return this._leds;
    }
}

module.exports = PiFaceBase;
