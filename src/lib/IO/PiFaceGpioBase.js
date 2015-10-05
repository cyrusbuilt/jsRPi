"use strict";

//
//  PiFaceGpioBase.js
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
var extend = require('extend');
var PiFacePins = require('./PiFacePins.js');
var PinState = require('./PinState.js');
var PiFaceGPIO = require('./PiFaceGPIO.js');
var PinMode = require('./PinMode.js');
var IllegalArgumentException = require('../IllegalArgumentException.js');
var ArgumentNullException = require('../ArgumentNullException.js');
var EventEmitter = require('events').EventEmitter;


/**
 * @classdesc Base class for the GPIO pins on the PiFace.
 * @param {PiFacePins} pin        The physical pin being wrapped by this class.
 * @param {PinState} initialValue The initial value of the pin.
 * @constructor
 * @implements {PiFaceGPIO}
 * @extends {EventEmitter}
 */
function PiFaceGpioBase(pin, initialValue, name) {
    PiFaceGPIO.call(this);
    EventEmitter.call(this);

    /**
     * Instance variables.
     */
    var _isDisposed = false;
    var _state = PinState.Low;
    var _innerPin = PiFacePins.None;
    var _pwm = 0;
    var _pwmRange = 0;
    var _mode = PinMode.IN;
    var _initValue = PinState.Low;
    var _exportedPins = [];
    var self = this;

    // Main constructor logic.
    if (util.isNullOrUndefined(pin)) {
        throw new ArgumentNullException("pin param cannot be null or undefined.");
    }

    if (typeof pin !== 'object') {
        throw new IllegalArgumentException("'pin' param must be a PiFacePins enum member.");
    }

    this.pinName = name || pin.name;
    _innerPin = pin;
    switch (pin) {
        case PiFacePins.Input00:
        case PiFacePins.Input01:
        case PiFacePins.Input02:
        case PiFacePins.Input03:
        case PiFacePins.Input04:
        case PiFacePins.Input05:
        case PiFacePins.Input06:
        case PiFacePins.Input07:
            _mode = PinMode.IN;
            break;
        case PiFacePins.Output00:
        case PiFacePins.Output01:
        case PiFacePins.Output02:
        case PiFacePins.Output03:
        case PiFacePins.Output04:
        case PiFacePins.Output05:
        case PiFacePins.Output06:
        case PiFacePins.Output07:
            _mode = PinMode.OUT;
            break;
        case PiFacePins.None:
          break;
        default:
            break;
    }

    _initValue = initialValue || PinState.Low;
    _state = _initValue;

    // Instance methods and getters/setters.

    /**
     * Releases all resources used by the PiFaceGpioBase object.
     * @override
     */
    this.dispose = function () {
        if (_isDisposed) {
            return;
        }

        self.removeAllListeners();
        _exportedPins = null;
        _innerPin = PiFacePins.None;
        _mode = PinMode.IN;
        self.pinName = null;
        self.tag = null;
        _isDisposed = true;
    };

    /**
     * Determines whether or not this instance has been disposed.
     * @return {Boolean} true if disposed; Otherwise, false.
     * @override
     */
    this.isDisposed = function () {
        return _isDisposed;
    };

    /**
     * Gets the physical pin being represented by this instance.
     * @return {PiFacePins} The physical pin.
     * @override
     */
    this.getInnerPin = function () {
        return _innerPin;
    };

    /**
     * Gets the state of the pin.
     * @return {PinState} The state of the pin.
     * @override
     */
    this.state = function() {
      _state = self.read();
      return _state;
    };

    /**
     * Exports (caches) the pin.
     */
    this.export = function() {
      _exportedPins.push(this);
    };

    /**
     * Unexports (removes from cache) the pin.
     */
    this.unexport = function() {
      var index = _exportedPins.indexOf(this);
      if (index > -1) {
        _exportedPins.splice(index, 1);
      }
    };

    /**
     * Gets the pin mode.
     * @return {PinMode} The pin mode.
     * @override
     */
    this.mode = function () {
        return _mode;
    };

    /**
     * Sets the mode for the pin.
     * @param  {PinMode} mode The mode to set the pin to.
     * @protected
     */
    this.setMode = function(mode) {
      mode = mode || PinMode.TRI;
      if (_mode !== mode) {
        _mode = mode;
        // If we're changing modes, we'll need to reprovision the pin.
        self.provision();
      }
    };

    /**
     * Gets the PWM (Pulse-Width Modulation) value.
     * @return {Number} The PWM value.
     * @override
     */
    this.getPWM = function() {
      return _pwm;
    };

    /**
     * Sets the PWM (Pulse-Width Modulation) value.
     * @param  {Number} pwm The PWM value.
     * @override
     */
    this.setPWM = function(pwm) {
      _pwm = pwm;
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
      _pwmRange = range;
    };

    /**
     * Gets the exported pins.
     * @return {Array} A dictionary of exported pins.
     * @override
     */
    this.getExportedPins = function() {
      return _exportedPins;
    };

    /**
     * Gets the pin address.
     * @return {Number} The address.
     * @override
     */
    this.address = function() {
      return _innerPin.value;
    };

    /**
     * Fires the pin state change event.
     * @param  {PinStateChangeEvent} psce The event object.
     * @protected
     */
    this.onPinStateChange = function(psce) {
      process.nextTick(function() {
        self.emit(PiFaceGPIO.EVENT_STATE_CHANGED, psce);
      });
    };

    /**
     * Gets the GPIO pin number.
     * @param  {GpioPins} pin The GPIO pin.
     * @return {Number}       The GPIO pin number.
     * @protected
     */
    this.getGpioPinNumber = function(pin) {
      return pin.value.toString();
    };

    /**
     * Write a value to the pin.
     * @param  {PinState} ps The pin state value to write to the pin.
     * @override
     */
    this.write = function(value) {
      _state = value;
    };

    /**
     * Pulse the pin output for the specified number of milliseconds.
     * @param  {Number} millis The number of milliseconds to wait between states.
     * @override
     */
    this.pulse = function(millis) {
      self.write(PinState.High);
      setTimeout(self.write(PinState.Low), millis);
    };
}

PiFaceGpioBase.prototype.constructor = PiFaceGpioBase;
inherits(PiFaceGpioBase, PiFaceGPIO);

module.exports = extend(true, PiFaceGpioBase, EventEmitter);
