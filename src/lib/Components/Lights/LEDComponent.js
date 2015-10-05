"use strict";

//
//  LEDComponent.js
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

var util = require('util');
var inherits = require('util').inherits;
var LEDBase = require('./LEDBase.js');
var PinState = require('../../IO/PinState.js');
var PinMode = require('../../IO/PinMode.js');
var ArgumentNullException = require('../../ArgumentNullException.js');
var InvalidOperationException = require('../../InvalidOperationException.js');
var LightStateChangeEvent = require('./LightStateChangeEvent.js');

var ON_STATE = PinState.High;
var OFF_STATE = PinState.Low;

/**
 * @classdesc A component that is an abstraction of an LED.
 * @param {Gpio} pin The output pin the LED is wired to.
 * @throws {ArgumentNullException} if the pin is null or undefined.
 * @constructor
 * @extends {LEDBase}
 */
function LEDComponent(pin) {
  LEDBase.call(this);

  if (util.isNullOrUndefined(pin)) {
    throw new ArgumentNullException("'pin' param cannot be null or undefined.");
  }

  var self = this;
  var _blinkElaspsed = 0;
  var _blinkDuration = 0;
  var _blinkDelay = 0;
  var _blinkTimer = null;
  var _pin = pin;
  _pin.provision();

  /**
   * Releases all resources used by the GpioBase object.
   * @override
   */
  this.dispose = function() {
    if (LEDBase.prototype.isDisposed.call(this)) {
      return;
    }

    if (!util.isNullOrUndefined(_pin)) {
      _pin.dispose();
      _pin = undefined;
    }

    self.removeAllListeners();
    LEDBase.prototype.dispose.call(this);
  };

  /**
   * Gets a value indicating whether this light is on.
   * @return {Boolean} true if the light is on; Otherwise, false.
   * @override
   */
  this.isOn = function() {
    return (_pin.state() === ON_STATE);
  };

  /**
   * Switches the light on.
   * @override
   */
  this.turnOn = function() {
    if (_pin.mode() !== PinMode.OUT) {
      throw new InvalidOperationException("Pin is not configured as an output.");
    }

    if (_pin.state() !== ON_STATE) {
      _pin.write(PinState.High);
      LEDBase.prototype.onLightStateChange.call(this, new LightStateChangeEvent(true));
    }
  };

  /**
   * Switches the light off.
   * @override
   */
  this.turnOff = function() {
    if (_pin.mode() !== PinMode.OUT) {
      throw new InvalidOperationException("Pin is not configured as an output.");
    }

    if (_pin.state() !== OFF_STATE) {
      _pin.write(PinState.Low);
      LEDBase.prototype.onLightStateChange.call(this, new LightStateChangeEvent(false));
    }
  };

  /**
   * Resets the blink interval timer.
   * @private
   */
  var resetBlink = function() {
    if (_blinkTimer != null) {
      clearInterval(_blinkTimer);
      _blinkElaspsed = 0;
      _blinkDuration = 0;
      _blinkDelay = 0;
      _blinkTimer = null;
    }
  };

  /**
   * The blink interval callback function. This checks to see if still within
   * the duration period, and if so, turns the LED on for the specified delay
   * time, then turns it back off.
   * @private
   */
  var doBlinkInterval = function() {
    var millis = (new Date()).getTime();
    if ((millis - _blinkElaspsed) <= _blinkDuration) {
      _blinkElaspsed = millis;
      self.turnOn();
      self.setTimeout(self.turnOff, _blinkDelay);
    }
  };

  /**
   * Executes a single blink (turn LED on, wait for delay, turn LED off).
   * @param  {Number} delay The delay in milliseconds before switching the LED
   * back off.
   * @private
   */
  var blinkOnce = function(delay) {
    self.turnOn();
    setTimeout(self.turnOff, delay);
  };

  /**
   * Blinks the LED.
   * @param  {Number} delay    The delay between state change.
   * @param  {Number} duration The amount of time to blink the LED (in
   * milliseconds). If not specified, then a single blink will occur.
   * @override
   */
  this.blink = function(delay, duration) {
    duration = duration || 0;
    if (duration > 0) {
      _blinkDuration = duration;
      _blinkDelay = delay;
      _blinkElaspsed = (new Date()).getTime();
      _blinkTimer = setInterval(doBlinkInterval, delay);
    }
    else {
      blinkOnce(delay);
    }
  };

  /**
   * Pulses the state of the LED.
   * @param  {Number} duration The amount of time to pulse the LED.
   * @override
   */
  this.pulse = function(duration) {
    duration = duration || 0;
    if (duration > 0) {
      _pin.pulse(duration);
    }
  };

  /**
   * Converts the current instance into its string representation. In this case,
   * it simply returns the component name.
   * @return {String} The component name.
   * @override
   */
  this.toString = function() {
    return LEDBase.prototype.componentName;
  };
}

LEDComponent.prototype.constructor = LEDComponent;
inherits(LEDComponent, LEDBase);

module.exports = LEDComponent;
