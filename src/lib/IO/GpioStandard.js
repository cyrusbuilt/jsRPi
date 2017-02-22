"use strict";

//
//  GpioStandard.js
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

const fs = require('fs');
const _ = require('underscore');
const ExecUtils = require("../ExecUtils.js");
const GpioBase = require("./GpioBase.js");
const GpioPins = require("./GpioPins.js");
const PinMode = require("./PinMode.js");
const PinState = require("./PinState.js");
const PinUtils = require("./PinUtils.js");
const IOException = require("./IOException.js");
const InvalildOperationException = require("../InvalidOperationException.js");
const PinStateChangeEvent = require("./PinStateChangeEvent.js");

const IO_PATH = "/sys/class/gpio/";

/**
 * @classdesc Raspberry Pi GPIO using the file-based access method.
 * @extends {GpioBase}
 */
class GpioStandard extends GpioBase {
  /**
   * Initializes a new instance of the jsrpi.IO.GpioStandard class with the pin
   * the GPIO represents, the pin mode to configure it to, and the initial pin
   * state.
   * @param {GpioPins} pin          The pin on the board to access.
   * @param {PinMode} mode          The I/O mod of the pin.
   * @param {PinState} initialValue The pin's initial value.
   * @constructor
   */
  constructor(pin, mode, initialValue) {
    super(pin, mode, initialValue);

    this._lastState = PinState.Low;
    this._pwm = 0;
    this._pwmRange = 1024;
    this._isPWM = false;
  }

  /**
   * Gets or sets the PWM (Pulse-Width Modulation) value.
   * @property {Number} pwm - The PWM value.
   * @throws {InvalildOperationException} if specified pin is not PWM.
   * @override
   */
  get pwm() {
    return this._pwm;
  }

  set pwm(val) {
    if (this.mode !== PinMode.PWM) {
      throw new InvalildOperationException("Cannot set PWM value on a pin not configured for PWM.");
    }

    if (val < 0) {
      val = 0;
    }

    if (val > 1023) {
      val = 1023;
    }

    if (this._pwm !== val) {
      this._pwm = val;
      let cmd = "";
      if (!this._isPWM) {
        cmd = "gpio mode " + this.innerPin.toString() + " pwm";
        ExecUtils.executeCommand(cmd);
      }
      cmd = "gpio pwm " + this.innerPin.toString() + " " + this._pwm.toString();
      ExecUtils.executeCommand(cmd);
    }
  }

  /**
   * Gets or sets the PWM range.
   * @property {Number} pwmRange - The PWM range.
   * @override
   */
  get pwmRange() {
    return this._pwmRange;
  }

  set pwmRange(range) {
    if (range < 0) {
      range = 0;
    }

    if (range > 1024) {
      range = 1024;
    }

    if (this._pwmRange !== range) {
      this._pwmRange = range;
    }
  }

  /**
   * Exports the GPIO setting the direction. This creates the
	 * /sys/class/gpio/gpioXX directory.
   * @param  {Number} pin     The GPIO pin.
   * @param  {PinMode} mode   The I/O mode.
   * @param  {String} pinnum  The pin number.
   * @param  {String} pinname The name of the pin.
   * @private
   */
  _internal_ExportPin(pin, mode, pinnum, pinname) {
    let pinPath = IO_PATH + "gpio" + pinnum;
    let m = PinUtils.getPinModeName(mode);

    // If the pin is already exported, check it's in the proper direction.
    // If the direction matches, return out of the function. If not,
    // change the direction.
    if (this.innerPin.mode === mode) {
      return;
    }
    else {
      // Set the direction on the pin and update the exported list.
      fs.writeFileSync(pinPath + "/direction", m);
      return;
    }

    // Export.
    if (!fs.existsSync(pinPath)) {
      fs.writeFileSync(IO_PATH + "export", pinnum);
    }

    // Set I/O direction.
    fs.writeFileSync(pinPath + "/direction", m);
  }

  /**
   * Exports the GPIO setting the direction. This creates the
	 * /sys/class/gpio/gpioXX directory.
   * @param  {GpioPins} pin  The GPIO pin on the board.
   * @param  {PinMode} mode  The I/O mode.
   * @private
   */
  _exportPin(pin, mode) {
    this._internal_ExportPin(pin.value, mode, pin.value.toString(), pin.name);
  }

  /**
   * Writes the specified value to the specified GPIO pin.
   * @param  {Number} pin     The pin to write the value to.
   * @param  {PinState} value The value to write to the pin.
   * @param  {String} gpioNum The GPIO number associated with the pin.
   * @param  {String} pinName The name of the pin.
   * @private
   */
  _internal_Write(pin, value, gpioNum, pinName) {
    // GPIO_NONE is the same value for both Rev1 and Rev2 boards.
    if (pin === GpioPins.GPIO_NONE.value) {
      return;
    }

    this._internal_ExportPin(pin, PinMode.OUT, gpioNum, pinName);
    let val = value.toString();
    let path = IO_PATH + "gpio" + gpioNum + "/value";
    fs.writeFileSync(path, val);
  }

  /**
   * Writes the specified value to the specified GPIO pin.
   * @param  {GpioPins} pin   The pin to write the value to.
   * @param  {PinState} value The value to write to the pin.
   * @private
   */
  _write(pin, value) {
    let num = pin.value.toString();
    let name = pin.name;
    this._internal_Write(pin, value, num, name);
  }

  /**
   * Unexport the GPIO. This removes the /sys/class/gpio/gpioXX directory.
   * @param  {String} gpioNum The GPIO number associated with the pin.
   * @private
   */
  _internal_UnexportPin(gpioNum) {
    fs.writeFileSync(IO_PATH + "unexport", gpioNum);
  }

  /**
   * Unexport the GPIO. This removes the /sys/class/gpio/gpioXX directory.
   * @param  {GpioPins} pin The GPIO pin to unexport.
   * @private
   */
  _unexportPin(pin) {
    this._write(pin, PinState.Low);
    this._internal_UnexportPin(pin.value.toString());
  }

  /**
   * Provisions the I/O pin. See http://wiringpi.com/reference/raspberry-pi-specifics/
   * @override
   */
  provision() {
    this._exportPin(this.innerPin, this.mode);
    this._write(this.innerPin, this._getInitialPinValue());
  }

  /**
   * Reads the value of the specified GPIO pin.
   * @param  {Number} pin      The physical pin associated with the GPIO pin.
   * @param  {String} gpioNum  The GPIO pin number.
   * @param  {String} gpioName The name of the GPIO.
   * @return {PinState}        The value of the pin.
   * @throws {IOException} if the specified pin could not be read (device does
   * not exist).
   * @private
   */
  _internal_Read(pin, gpioNum, gpioName) {
    let returnValue = PinState.Low;
    this._internal_ExportPin(pin, PinMode.IN, gpioNum, gpioName);
    let fileName = IO_PATH + "gpio" + gpioNum + "/value";
    if (fs.existsSync(fileName)) {
      let readValue = fs.readFileSync(fileName);
      if ((readValue.length > 0) && (parseInt(readValue.substring(0, 1)) === 1)) {
        returnValue = PinState.High;
      }
    }
    else {
      throw new IOException("Cannot read from pin " + gpioNum + ". Device does not exist.");
    }

    return returnValue;
  }

  /**
   * Read a value from the specified pin.
   * @param  {GpioPins} pin The pin to read from.
   * @return {PinState}     The value read from the pin (high or low).
   * @throws {IOExcption} if the specified pin could not be read (device does
   * not exist).
   * @private
   */
  _read(pin) {
    let num = pin.value.toString();
    let name = pin.name;
    return this._internal_Read(pin.value, num, name);
  }

  /**
   * Write a value to the pin.
   * @param  {PinState} ps The pin state value to write to the pin.
   * @override
   */
  write(ps) {
    super.write(ps);
    this._write(this.innerPin, ps);
    if (this._lastState !== this.state) {
      this.onPinStateChange(new PinStateChangeEvent(this._lastState, this.state, this.innerPin));
    }
  }

  /**
   * Pulse the pin output for the specified number of milliseconds.
   * @param  {Number} millis The number of milliseconds to wait between states.
   * @override
   */
  pulse(millis) {
    if (this.mode === PinMode.IN) {
      throw new InvalildOperationException("You cannot pulse a pin set as an input.");
    }

    this._write(this.innerPin, PinState.High);
    this.onPinStateChange(new PinStateChangeEvent(this.state, PinState.High, this.innerPin));
    this.pulse(millis);
    this._write(super.innerPin, PinState.Low);
    this.onPinStateChange(new PinStateChangeEvent(this.state, PinState.Low, this.innerPin));
  }

  /**
   * Pulses the pin for the default value of 500ms.
   */
  pulseDefault() {
    this.pulse(500);
  }

  /**
   * Reads a value from the pin.
   * @return {PinState} The state (value) of the pin.
   * @override
   */
  read() {
    let val = this._read(super.innerPin);
    if (this._lastState !== val) {
      this.onPinStateChange(new PinStateChangeEvent(this._lastState, val, this.innerPin));
    }
    return val;
  }

  /**
   * In subclasses, performs application-defined tasks associated with freeing,
   * releasing, or resetting resources.
   * @override
   */
  dispose() {
    this._unexportPin(super.innerPin);

    if (this._isPWM) {
      let cmd = "gpio unexport " + this.innerPin.value.toString();
      ExecUtils.executeCommand(cmd);
    }

    this.write(PinState.Low);
    super.dispose();
  }

  /**
   * The path on the Raspberry Pi for the GPIO interface.
   * @type {String}
   * @const
   */
  static get GPIO_PATH() { return IO_PATH; }
}

module.exports = GpioStandard;
