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

const util = require('util');
const LEDBase = require('./LEDBase.js');
const PinState = require('../../IO/PinState.js');
const PinMode = require('../../IO/PinMode.js');
const ArgumentNullException = require('../../ArgumentNullException.js');
const InvalidOperationException = require('../../InvalidOperationException.js');
const LightStateChangeEvent = require('./LightStateChangeEvent.js');

const ON_STATE = PinState.High;
const OFF_STATE = PinState.Low;

/**
 * @classdesc A component that is an abstraction of an LED.
 * @extends {LEDBase}
 */
class LEDComponent extends LEDBase {
  /**
   * Initializes a new instance of the jsrpi.Components.Lights.LEDComponent
   * class with the pin the LED is attached to.
   * @param {Gpio} pin The output pin the LED is wired to.
   * @throws {ArgumentNullException} if the pin is null or undefined.
   * @constructor
   */
  constructor(pin) {
    super();

    if (util.isNullOrUndefined(pin)) {
      throw new ArgumentNullException("'pin' param cannot be null or undefined.");
    }

    this._blinkElaspsed = 0;
    this._blinkDuration = 0;
    this._blinkDelay = 0;
    this._blinkTimer = null;
    this._pin = pin;
    this._pin.provision();
  }

	/**
	 * Gets the underlying pin the LED is attached to.
	 * @property {Gpio} pin - The underlying physical pin.
	 * @readonly
	 */
	get pin() {
		return this._pin;
	}

  /**
   * Gets a value indicating whether this light is on.
   * @property {Boolean} isOn - true if the light is on; Otherwise, false.
   * @readonly
   * @override
   */
  get isOn() {
    return (this._pin.state === ON_STATE);
  }

  /**
   * Switches the light on.
   * @override
   */
  turnOn() {
    if (this._pin.mode !== PinMode.OUT) {
      throw new InvalidOperationException("Pin is not configured as an output.");
    }

    if (this._pin.state !== ON_STATE) {
      this._pin.write(PinState.High);
      this.onLightStateChange(new LightStateChangeEvent(true));
    }
  }

  /**
   * Switches the light off.
   * @override
   */
  turnOff() {
    if (this._pin.mode !== PinMode.OUT) {
      throw new InvalidOperationException("Pin is not configured as an output.");
    }

    if (this._pin.state !== OFF_STATE) {
      this._pin.write(PinState.Low);
      this.onLightStateChange(new LightStateChangeEvent(false));
    }
  }

  /**
   * Resets the blink interval timer.
   * @private
   */
  _resetBlink() {
    if (!util.isNullOrUndefined(this._blinkTimer)) {
      clearInterval(this._blinkTimer);
      this._blinkElaspsed = 0;
      this._blinkDuration = 0;
      this._blinkDelay = 0;
      this._blinkTimer = null;
    }
  }

  /**
   * The blink interval callback function. This checks to see if still within
   * the duration period, and if so, turns the LED on for the specified delay
   * time, then turns it back off.
   * @private
   */
  _doBlinkInterval() {
    let millis = (new Date()).getTime();
    if ((millis - this._blinkElaspsed) <= this._blinkDuration) {
      this._blinkElaspsed = millis;
      this.turnOn();
      setTimeout(() => {
        this.turnOff();
      }, this._blinkDelay);
    }
  }

  /**
   * Executes a single blink (turn LED on, wait for delay, turn LED off).
   * @param  {Number} delay The delay in milliseconds before switching the LED
   * back off.
   * @private
   */
  _blinkOnce(delay) {
    this.turnOn();
    setTimeout(() => {
      this.turnOff();
    }, delay);
  }

  /**
   * Blinks the LED.
   * @param  {Number} delay    The delay between state change.
   * @param  {Number} duration The amount of time to blink the LED (in
   * milliseconds). If not specified, then a single blink will occur.
   * @override
   */
  blink(delay, duration) {
    duration = duration || 0;
    if (duration > 0) {
      this._blinkDuration = duration;
      this._blinkDelay = delay;
      this._blinkElaspsed = (new Date()).getTime();
      this._blinkTimer = setInterval(() => { this._doBlinkInterval(); }, delay);
    }
    else {
      this._blinkOnce(delay);
    }
  }

  /**
   * Pulses the state of the LED.
   * @param  {Number} duration The amount of time to pulse the LED.
   * @override
   */
  pulse(duration) {
    duration = duration || 0;
    if (duration > 0) {
      this._pin.pulse(duration);
    }
  }

  /**
   * Converts the current instance into its string representation. In this case,
   * it simply returns the component name.
   * @return {String} The component name.
   * @override
   */
  toString() {
    return this.componentName;
  }

  /**
   * Releases all resources used by the GpioBase object.
   * @override
   */
  dispose() {
    if (this.isDisposed) {
      return;
    }

    if (!util.isNullOrUndefined(this._pin)) {
      this._pin.dispose();
      this._pin = undefined;
    }

    this._resetBlink();
    this.removeAllListeners();
    super.dispose();
  }
}

module.exports = LEDComponent;
