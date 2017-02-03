"use strict";

//
//  GpioBase.js
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
const EventEmitter = require('events').EventEmitter;
const GpioPins = require('./GpioPins.js');
const PinMode = require('./PinMode.js');
const PinState = require('./PinState.js');
const BoardRevision = require('../BoardRevision.js');
const RaspiGpio = require('./RaspiGpio.js');
const Gpio = require('./Gpio.js');
const ObjectDisposedException = require('../ObjectDisposedException.js');


/**
* @classdesc Base class for the GPIO connector on the Pi (P1) (as found
* next to the yellow RCA video socket on the Rpi circuit board).
* @implements {RaspiGpio}
*/
class GpioBase extends RaspiGpio {
  /**
   * Initalizes a new instance of the jsrpi.IO.GpioBase class with the pin the
   * GPIO is assigned to, the pin mode, and initial value.
   * @param {GpioPins} pin  The GPIO pin.
   * @param {PinMode} mode  The I/O pin mode.
   * @param {PinState} value The initial pin value.
   * @constructor
   */
  constructor(pin, mode, value) {
    super();

    // Instance variables.
    this._pin = pin;
    if (util.isNullOrUndefined(this._pin)) {
      this._pin = GpioPins.GPIO_NONE;
    }

    this._mode = mode;
    if (util.isNullOrUndefined(this._mode)) {
      this._mode = PinMode.OUT;
    }

    this._initValue = value;
    if (util.isNullOrUndefined(this._initValue)) {
      this._initValue = PinState.Low;
    }

    this._emitter = new EventEmitter();
    this._revision = BoardRevision.Rev2;
    this._isDisposed = false;
    this._state = PinState.Low;
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
  * Gets the board revision.
  * @property {BoardRevision} revision - The board revision.
  * @readonly
  * @override
  */
  get revision() {
    return this._revision;
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
  * Gets the physical pin being represented by this instance.
  * @property {GpioPins} innerPin - The underlying physical pin.
  * @readonly
  * @override
  */
  get innerPin() {
    return this._pin;
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
    }
  }

  /**
  * Write a value to the pin.
  * @param  {PinState} ps The pin state value to write to the pin.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  */
  write(ps) {
    if (this._isDisposed) {
      throw new ObjectDisposedException("GpioBase");
    }
    this._state = ps;
  }

  /**
  * Provisions this pin.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @override
  */
  provision() {
    if (this._isDisposed) {
      throw new ObjectDisposedException("GpioBase");
    }
    this.write(this._initValue);
  }

  /**
  * Gets the pin address.
  * @property {Number} address - The pin address (GPIO number).
  * @readonly
  * @override
  */
  get address() {
    return this._pin.value;
  }

  /**
  * Changes the board revision.
  * @param  {BoardRevision} revision The board revision.
  */
  changeBoardRevision(revision) {
    revision = revision || BoardRevision.Rev2;
    this._revision = revision;
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

  /**
  * Gets the initial pin value.
  * @return {PinState} The initial value.
  * @protected
  */
  _getInitialPinValue() {
    return this._initValue;
  }

  /**
  * Releases all resources used by the GpioBase object.
  * @override
  */
  dispose() {
    if (this._isDisposed) {
      return;
    }

    this._emitter.removeAllListeners();
    this._emitter = undefined;
    this._state = undefined;
    this._mode = undefined;
    this._pin = undefined;
    this._isDisposed = true;
  }
}

module.exports = GpioBase;
