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

var inherits = require('util').inherits;
var fs = require('fs');
var _ = require('underscore');
var ExecUtils = require("../ExecUtils.js");
var GpioBase = require("./GpioBase.js");
var GpioPins = require("./GpioPins.js");
var PinMode = require("./PinMode.js");
var PinState = require("./PinState.js");
var PinUtils = require("./PinUtils.js");
var IOException = require("./IOException.js");
var InvalildOperationException = require("../InvalidOperationException.js");
var PinStateChangeEvent = require("./PinStateChangeEvent.js");

var IO_PATH = "/sys/class/gpio/";

/**
 * @classdesc Raspberry Pi GPIO using the file-based access method.
 * @param {GpioPins} pin          The pin on the board to access.
 * @param {PinMode} mode          The I/O mod of the pin.
 * @param {PinState} initialValue The pin's initial value.
 * @constructor
 * @extends {GpioBase}
 */
function GpioStandard(pin, mode, initialValue) {
  GpioBase.call(this, pin, mode, initialValue);

  var _lastState = PinState.Low;
  var _pwm = 0;
  var _pwmRange = 1024;
  var _isPWM = false;
  var self = this;

  /**
   * Gets the PWM (Pulse-Width Modulation) value.
   * @return {Number} The PWM value.
   * @override
   */
  this.getPwm = function() {
    return _pwm;
  };

  /**
   * Sets the PWM (Pulse-Width Modulation) value.
   * @param  {Number} pwm The PWM value.
   * @throws {InvalildOperationException} if specified pin is not PWM.
   * @override
   */
  this.setPwm = function(pwm) {
    if (self.mode !== PinMode.PWM) {
      throw new InvalildOperationException("Cannot set PWM value on a pin not configured for PWM.");
    }

    if (pwm < 0) {
      pwm = 0;
    }

    if (pwm > 1023) {
      pwm = 1023;
    }

    if (_pwm !== pwm) {
      _pwm = pwm;
      var cmd = "";
      if (!_isPWM) {
        cmd = "gpio mode " + self.getInnerPin().toString() + " pwm";
        ExecUtils.executeCommand(cmd);
      }
      cmd = "gpio pwm " + self.getInnerPin().toString() + " " + _pwm.toString();
      ExecUtils.executeCommand(cmd);
    }
  };

  /**
   * Gets the PWM range.
   * @return {Number} The PWM range.
   * @override
   */
  this.getPWMRange = function() {
    return _pwmRange;
  };

  /**
   * Sets the PWM range.
   * @param  {Number} range The PWM range.
   * @override
   */
  this.setPWMRange = function(range) {
    if (range < 0) {
      range = 0;
    }

    if (range > 1024) {
      range = 1024;
    }

    if (_pwmRange !== range) {
      _pwmRange = range;
    }
  };

  /**
   * Exports the GPIO setting the direction. This creates the
	 * /sys/class/gpio/gpioXX directory.
   * @param  {Number} pin     The GPIO pin.
   * @param  {PinMode} mode   The I/O mode.
   * @param  {String} pinnum  The pin number.
   * @param  {String} pinname The name of the pin.
   * @private
   */
  this._internal_ExportPin = function(pin, mode, pinnum, pinname) {
    var pinPath = IO_PATH + "gpio" + pinnum;
    var m = PinUtils.getPinModeName(mode);
    var pins = self.getExportedPins();

    // If the pin is already exported, check it's in the proper direction.
    if (pin in pins) {
      // If the direction matches, return out of the function. If not,
			// change the direction.
			if (pins[pin] === mode) {
        return;
      }
      else {
        // Set the direction on the pin and update the exported list.
        fs.writeFileSync(pinPath + "/direction", m);
        pins[pin] = mode;
        return;
      }
    }
    else {
      pins.push(pin);
    }

    // Export.
    if (!fs.existsSync(pinPath)) {
      fs.writeFileSync(IO_PATH + "export", pinnum);
    }

    // Set I/O direction.
    fs.writeFileSync(pinPath + "/direction", m);

    // Update the pin.
    pins[pin] = mode;
    self._setExportedPins(pins);
  };

  /**
   * Exports the GPIO setting the direction. This creates the
	 * /sys/class/gpio/gpioXX directory.
   * @param  {GpioPins} pin  The GPIO pin on the board.
   * @param  {PinMode} mode  The I/O mode.
   * @private
   */
  this._exportPin = function(pin, mode) {
    self._internal_ExportPin(pin.value, mode, pin.value.toString(), pin.name);
  };

  /**
   * Writes the specified value to the specified GPIO pin.
   * @param  {Number} pin     The pin to write the value to.
   * @param  {PinState} value The value to write to the pin.
   * @param  {String} gpioNum The GPIO number associated with the pin.
   * @param  {String} pinName The name of the pin.
   * @private
   */
  this._internal_Write = function(pin, value, gpioNum, pinName) {
    // GPIO_NONE is the same value for both Rev1 and Rev2 boards.
    if (pin === GpioPins.GPIO_NONE.value) {
      return;
    }

    self._internal_ExportPin(pin, PinMode.OUT, gpioNum, pinName);
    var val = value.toString();
    var path = IO_PATH + "gpio" + gpioNum + "/value";
    fs.writeFileSync(path, val);
  };

  /**
   * Writes the specified value to the specified GPIO pin.
   * @param  {GpioPins} pin   The pin to write the value to.
   * @param  {PinState} value The value to write to the pin.
   * @private
   */
  this._write = function(pin, value) {
    var num = pin.value.toString();
    var name = pin.name;
    self._internal_Write(pin, value, num, name);
  };

  /**
   * Unexport the GPIO. This removes the /sys/class/gpio/gpioXX directory.
   * @param  {Number} pin     The GPIO pin to unexport.
   * @param  {String} gpioNum The GPIO number associated with the pin.
   * @private
   */
  this._internal_UnexportPin = function(pin, gpioNum) {
    fs.writeFileSync(IO_PATH + "unexport", gpioNum);
    var idx = _.indexBy(this.getExportedPins(), pin)[0];
    self.getExportedPins().splice(idx, 1);
  };

  /**
   * Unexport the GPIO. This removes the /sys/class/gpio/gpioXX directory.
   * @param  {GpioPins} pin The GPIO pin to unexport.
   * @private
   */
  this._unexportPin = function(pin) {
    self._write(pin, PinState.Low);
    self._internal_UnexportPin(pin.value, pin.value.toString());
  };

  /**
   * Provisions the I/O pin. See http://wiringpi.com/reference/raspberry-pi-specifics/
   * @override
   */
  this.provision = function() {
    self._exportPin(self.getInnerPin(), self.mode);
    self._write(self.getInnerPin(), self._getInitialPinValue());
  };

  /**
   * Reads the value of the specified GPIO pin.
   * @param  {Number} pin      The physical pin associated with the GPIO pin.
   * @param  {String} gpioNum  The GPIO pin number.
   * @param  {String} gpioName The name of the GPIO.
   * @return {PinState}        The value of the pin.
   * @throws {IOExcption} if the specified pin could not be read (device does
   * not exist).
   * @private
   */
  this._internal_Read = function(pin, gpioNum, gpioName) {
    var returnValue = PinState.Low;
    self._internal_ExportPin(pin, PinMode.IN, gpioNum, gpioName);
    var fileName = IO_PATH + "gpio" + gpioNum + "/value";
    if (fs.existsSync(fileName)) {
      var readValue = fs.readFileSync(fileName);
      if ((readValue.length > 0) && (parseInt(readValue.substring(0, 1)) === 1)) {
        returnValue = PinState.High;
      }
    }
    else {
      throw new IOException("Cannot read from pin " + gpioNum + ". Device does not exist.");
    }

    return returnValue;
  };

  /**
   * Read a value from the specified pin.
   * @param  {GpioPins} pin The pin to read from.
   * @return {PinState}     The value read from the pin (high or low).
   * @throws {IOExcption} if the specified pin could not be read (device does
   * not exist).
   * @private
   */
  this._read = function(pin) {
    var num = pin.value.toString();
    var name = pin.name;
    return self._internal_Read(pin.value, num, name);
  };

  /**
   * Write a value to the pin.
   * @param  {PinState} ps The pin state value to write to the pin.
   * @override
   */
  this.write = function(ps) {
    GpioBase.prototype.write.call(self, ps);
    self._write(self.getInnerPin(), ps);
    if (_lastState !== self.state) {
      self.onPinStateChange(new PinStateChangeEvent(_lastState, self.state));
    }
  };

  /**
   * Pulse the pin output for the specified number of milliseconds.
   * @param  {Number} millis The number of milliseconds to wait between states.
   * @override
   */
  this.pulse = function(millis) {
    if (self.mode === PinMode.IN) {
      throw new InvalildOperationException("You cannot pulse a pin set as an input.");
    }

    self._write(self.getInnerPin(), PinState.High);
    self.onPinStateChange(new PinStateChangeEvent(self.state, PinState.High));
    self.pulse(millis);
    self._write(self.getInnerPin(), PinState.Low);
    self.onPinStateChange(new PinStateChangeEvent(self.state, PinState.Low));
  };

  /**
   * Pulses the pin for the default value of 500ms.
   */
  this.pulseDefault = function() {
    self.pulse(500);
  };

  /**
   * Reads a value from the pin.
   * @return {PinState} The state (value) of the pin.
   * @override
   */
  this.read = function() {
    var val = self._read(self.getInnerPin());
    if (_lastState !== val) {
      self.onPinStateChange(new PinStateChangeEvent(_lastState, val));
    }
    return val;
  };

  /**
   * In subclasses, performs application-defined tasks associated with freeing,
   * releasing, or resetting resources.
   * @override
   */
  this.dispose = function() {
    self._unexportPin(self.getInnerPin());
    if (self.getExportedPins().length > 0) {
      for (var i = 0; i < self.getExportedPins().length; i++) {
        self._unexportPin(self.getExportedPins[i]);
      }
    }

    if (_isPWM) {
        var cmd = "gpio unexport " + self.getInnerPin().value.toString();
        ExecUtils.executeCommand(cmd);
    }

    self.write(PinState.Low);
    GpioBase.prototype.dispose.call(self);
  };
}

GpioStandard.prototype.constructor = GpioStandard;
inherits(GpioStandard, GpioBase);

/**
 * The path on the Raspberry Pi for the GPIO interface.
 * @type {String}
 * @const
 */
GpioStandard.GPIO_PATH = IO_PATH;

module.exports = GpioStandard;
