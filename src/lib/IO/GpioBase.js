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

var inherits = require('util').inherits;
var extend = require('extend');
var EventEmitter = require('events').EventEmitter;
var GpioPins = require('./GpioPins.js');
var PinMode = require('./PinMode.js');
var PinState = require('./PinState.js');
var BoardRevision = require('../BoardRevision.js');
var RaspiGpio = require('./RaspiGpio.js');
var Gpio = require('./Gpio.js');

/**
 * @classdesc Base class for the GPIO connector on the Pi (P1) (as found
 * next to the yellow RCA video socket on the Rpi circuit board).
 * @param {GpioPins} pin   The GPIO pin.
 * @param {PinMode} mode  The I/O pin mode.
 * @param {PinState} value The initial pin value.
 * @constructor
 * @extends {EventEmitter}
 * @implements {RaspiGpio}
 */
function GpioBase(pin, mode, value) {
  RaspiGpio.call(this);
  EventEmitter.call(this);

  // Instance variables.
  var _pin = pin || GpioPins.GPIO_NONE;
  var _mode = mode || PinMode.OUT;
  var _initValue = value || PinState.Low;
  var _revision = BoardRevision.Rev2;
  var _isDisposed = false;
  var _state = PinState.Low;
  var _exportedPins = [];
  var self = this;

  /**
   * Determines whether or not this instance has been disposed.
   * @return {Boolean} true if disposed; Otherwise, false.
   * @override
   */
  this.isDisposed = function() {
    return _isDisposed;
  };

  /**
   * Gets the board revision.
   * @return {BoardRevision} The board revision.
   * @override
   */
  this.getRevision = function() {
    return _revision;
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
   * Gets the physical pin being represented by this instance.
   * @return {GpioPins} The physical pin.
   * @override
   */
  this.getInnerPin = function() {
    return _pin;
  };

  /**
   * Gets the pin mode.
   * @return {PinMode} The pin mode.
   * @override
   */
  this.mode = function() {
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
   * Gets the exported pins.
   * @return {Array} A dictionary of exported pins.
   */
  this.getExportedPins = function() {
    return _exportedPins;
  };

  /**
   * Sets the exported pin cache.
   * @param {Array} The array of exported pins.
   * @protected
   */
  this._setExportedPins = function(pins) {
    _exportedPins = pins;
  };

  /**
   * Gets the pin address.
   * @return {Number} The address.
   * @override
   */
  this.address = function() {
    return _pin.value;
  };

  /**
   * Changes the board revision.
   * @param  {BoardRevision} revision The board revision.
   */
  this.changeBoardRevision = function(revision) {
    revision = revision || BoardRevision.Rev2;
    _revision = revision;
  };

  /**
   * Write a value to the pin.
   * @param  {PinState} ps The pin state value to write to the pin.
   */
  this.write = function(ps) {
    _state = ps;
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

  /**
   * Fires the pin state change event.
   * @param  {PinStateChangeEvent} psce The event object.
   * @protected
   */
  this.onPinStateChange = function(psce) {
    process.nextTick(function() {
      self.emit(Gpio.EVENT_STATE_CHANGED, psce);
    });
  };

  /**
   * Gets the initial pin value.
   * @return {PinState} The initial value.
   * @protected
   */
  this._getInitialPinValue = function() {
    return _initValue;
  };

  /**
   * Releases all resources used by the GpioBase object.
   * @override
   */
  this.dispose = function() {
    if (_isDisposed) {
      return;
    }
    self.removeAllListeners();
    _exportedPins = undefined;
    _state = undefined;
    _mode = undefined;
    _pin = undefined;
    _isDisposed = true;
  };
}

GpioBase.prototype.constructor = GpioBase;
inherits(GpioBase, RaspiGpio);

module.exports = extend(true, GpioBase, EventEmitter);
