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

const util = require('util');
const PiFacePins = require('./PiFacePins.js');
const PinState = require('./PinState.js');
const PiFaceGPIO = require('./PiFaceGPIO.js');
const PinMode = require('./PinMode.js');
const Gpio = require('./Gpio.js');
const IllegalArgumentException = require('../IllegalArgumentException.js');
const ArgumentNullException = require('../ArgumentNullException.js');
const EventEmitter = require('events').EventEmitter;
const ObjectDisposedException = require('../ObjectDisposedException.js');


/**
 * @classdesc Base class for the GPIO pins on the PiFace.
 * @implements {PiFaceGPIO}
 */
class PiFaceGpioBase extends PiFaceGPIO {
  /**
   * Initializes a new instance of the jsrpi.IO.PiFaceGpioBase class with the
   * pin the GPIO is assigned to, the initial state of the pin, and pin name.
   * @param {PiFacePins} pin        The physical pin being wrapped by this class.
   * @param {PinState} initialValue The initial value of the pin.
   * @throws {ArgumentNullException} if pin param is null or undefined.
   * @throws {IllegalArgumentException} if pin param is not a {PiFacePins} enum
   * member.
   * @constructor
   */
  constructor(pin, initialValue, name) {
    super();

    this._emitter = new EventEmitter();
    this._isDisposed = false;
    this._state = PinState.Low;
    this._innerPin = PiFacePins.None;
    this._pwm = 0;
    this._pwmRange = 0;
    this._mode = PinMode.IN;
    this._initValue = PinState.Low;

    // Main constructor logic.
    if (util.isNullOrUndefined(pin)) {
        throw new ArgumentNullException("pin param cannot be null or undefined.");
    }

    if (typeof pin !== 'object') {
        throw new IllegalArgumentException("'pin' param must be a PiFacePins enum member.");
    }

    this.pinName = name || pin.name;
    this._innerPin = pin;
    switch (pin) {
        case PiFacePins.Input00:
        case PiFacePins.Input01:
        case PiFacePins.Input02:
        case PiFacePins.Input03:
        case PiFacePins.Input04:
        case PiFacePins.Input05:
        case PiFacePins.Input06:
        case PiFacePins.Input07:
            this._mode = PinMode.IN;
            break;
        case PiFacePins.Output00:
        case PiFacePins.Output01:
        case PiFacePins.Output02:
        case PiFacePins.Output03:
        case PiFacePins.Output04:
        case PiFacePins.Output05:
        case PiFacePins.Output06:
        case PiFacePins.Output07:
            this._mode = PinMode.OUT;
            break;
        case PiFacePins.None:
          break;
        default:
            break;
    }

    this._initValue = initialValue;
    if (util.isNullOrUndefined(this._initValue)) {
      this._initValue = PinState.Low;
    }
    this._state = this._initValue;
  }

  /**
   * Releases all resources used by the PiFaceGpioBase object.
   * @override
   */
  dispose() {
    if (this._isDisposed) {
        return;
    }

    this._emitter.removeAllListeners();
    this._innerPin = PiFacePins.None;
    this._mode = PinMode.IN;
    this.pinName = null;
    this.tag = null;
    this._emitter = undefined;
    this._isDisposed = true;
  }

  /**
   * Determines whether or not this instance has been disposed.
   * @property {Boolean} isDisposed - true if disposed; Otherwise, false.
   * @readonly
   * @override
   */
  get isDisposed() {
    return this._isDisposed;
  }

  /**
   * Attaches a listener (callback) for the specified event name.
   * @param  {String}   evt      The name of the event.
   * @param  {Function} callback The callback function to execute when the
   * event is raised.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  on(evt, callback) {
    if (this._isDisposed) {
      throw new ObjectDisposedException("GpioBase");
    }
    this._emitter.on(evt, callback);
  }

  /**
   * Emits the specified event.
   * @param  {String} evt  The name of the event to emit.
   * @param  {Object} args The object that provides arguments to the event.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  emit(evt, args) {
    if (this._isDisposed) {
      throw new ObjectDisposedException("GpioBase");
    }
    this._emitter.emit(evt, args);
  }

  /**
   * Fires the pin state change event.
   * @param  {PinStateChangeEvent} psce The event object.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @protected
   */
  onPinStateChange(psce) {
    if (this._isDisposed) {
      throw new ObjectDisposedException("GpioBase");
    }

    setImmediate(() => {
      this.emit(Gpio.EVENT_STATE_CHANGED, psce);
    });
  }

  /**
   * Gets the physical pin being represented by this instance.
   * @property {PiFacePins} innerPin - The underlying pin physical pin.
   * @readonly
   * @override
   */
  get innerPin() {
    return this._innerPin;
  }

  /**
   * Gets the state of the pin.
   * @property {PinState} state - The pin state.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @readonly
   * @override
   */
  get state() {
    this._state = this.read();
    return this._state;
  }

  /**
   * Gets or sets the pin mode.
   * @property {PinMode} mode - The pin mode.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @override
   */
  get mode() {
    return this._mode;
  }

  set mode(m) {
    if (this._isDisposed) {
      throw new ObjectDisposedException("GpioBase");
    }

    if (util.isNullOrUndefined(m)) {
      m = PinMode.TRI;
    }

    if (this._mode !== m) {
      this._mode = m;
      // If we're changing modes, we'll need to reprovision the pin.
      this.provision();
    }
  }

  /**
   * Gets or sets the PWM (Pulse-Width Modulation) value.
   * @property {Number} pwm - The PWM value.
   * @override
   */
  get pwm() {
    return this._pwm;
  }

  set pwm(val) {
    this._pwm = val;
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
    this._pwmRange = range;
  }

  /**
   * Gets the pin address.
   * @property {Number} address - The pin address (GPIO number).
   * @readonly
   * @override
   */
  get address() {
    return this._innerPin.value;
  }

  /**
   * Gets the GPIO pin number.
   * @param  {GpioPins} pin The GPIO pin.
   * @return {Number}       The GPIO pin number.
   * @protected
   */
  getGpioPinNumber(pin) {
    return pin.value.toString();
  }

  /**
   * Write a value to the pin.
   * @param  {PinState} ps The pin state value to write to the pin.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @override
   */
  write(value) {
    if (this._isDisposed) {
      throw new ObjectDisposedException("GpioBase");
    }
    this._state = value;
  }

  /**
   * Pulse the pin output for the specified number of milliseconds.
   * @param  {Number} millis The number of milliseconds to wait between states.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @override
   */
  pulse(millis) {
    if (this._isDisposed) {
      throw new ObjectDisposedException("GpioBase");
    }

    this.write(PinState.High);
    setTimeout(() => {
      this.write(PinState.Low);
    }, millis);
  }
}

module.exports = PiFaceGpioBase;
