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
  var _base = new LEDBase();
  var _blinkElaspsed = 0;
  var _blinkDuration = 0;
  var _blinkDelay = 0;
  var _blinkTimer = null;
  var _pin = pin;
  _pin.provision();

	/**
	 * Gets the underlying pin the LED is attached to.
	 * @returns {Gpio} The underlying pin.
	 */
	this.getPin = function() {
		return _pin;
	};
	
  /**
   * Component name property.
   * @property {String}
   */
  this.componentName = _base.componentName;

  /**
   * Tag property.
   * @property {Object}
   */
  this.tag = _base.tag;

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
   * @param  {String} key The key name of the property to check for.
   * @return {Boolean}    true if the property collection contains the key;
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
   * Determines whether or not this instance has been disposed.
   * @return {Boolean} true if disposed; Otherwise, false.
   * @override
   */
  this.isDisposed = function() {
    return _base.isDisposed();
  };

  /**
   * Releases all resources used by the GpioBase object.
   * @override
   */
  this.dispose = function() {
    if (_base.isDisposed()) {
      return;
    }

    if (!util.isNullOrUndefined(_pin)) {
      _pin.dispose();
      _pin = undefined;
    }

    _base.removeAllListeners();
    _base.dispose();
  };

  /**
   * Removes all event listeners.
   * @override
   */
  this.removeAllListeners = function() {
    _base.removeAllListeners();
  };

  /**
   * Attaches a listener (callback) for the specified event name.
   * @param  {String}   evt      The name of the event.
   * @param  {Function} callback The callback function to execute when the
   * event is raised.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @override
   */
  this.on = function(evt, callback) {
    _base.on(evt, callback);
  };

  /**
   * Emits the specified event.
   * @param  {String} evt  The name of the event to emit.
   * @param  {Object} args The object that provides arguments to the event.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @override
   */
  this.emit = function(evt, args) {
    _base.emit(evt, args);
  };

  /**
   * Fires the light state change event.
   * @param  {LightStateChangeEvent} lightChangeEvent The state change event
   * object.
   * @override
   */
  this.onLightStateChange = function(lightChangeEvent) {
    _base.onLightStateChange(lightChangeEvent);
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
      _base.onLightStateChange(new LightStateChangeEvent(true));
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
      _base.onLightStateChange(new LightStateChangeEvent(false));
    }
  };

  /**
   * Resets the blink interval timer.
   * @private
   */
  var resetBlink = function() {
    if (!util.isNullOrUndefined(_blinkTimer)) {
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
      self.setTimeout(function() {
        self.turnOff();
      }, _blinkDelay);
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
    setTimeout(function() {
      self.turnOff();
    }, delay);
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
    return self.componentName;
  };
}

LEDComponent.prototype.constructor = LEDComponent;
inherits(LEDComponent, LEDBase);

module.exports = LEDComponent;
