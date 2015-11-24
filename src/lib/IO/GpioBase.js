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

var util = require('util');
var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;
var GpioPins = require('./GpioPins.js');
var PinMode = require('./PinMode.js');
var PinState = require('./PinState.js');
var BoardRevision = require('../BoardRevision.js');
var RaspiGpio = require('./RaspiGpio.js');
var Gpio = require('./Gpio.js');
var ObjectDisposedException = require('../ObjectDisposedException.js');


/**
 * @classdesc Base class for the GPIO connector on the Pi (P1) (as found
 * next to the yellow RCA video socket on the Rpi circuit board).
 * @param {GpioPins} pin   The GPIO pin.
 * @param {PinMode} mode  The I/O pin mode.
 * @param {PinState} value The initial pin value.
 * @constructor
 * @implements {RaspiGpio}
 */
function GpioBase(pin, mode, value) {
  	RaspiGpio.call(this);

  	// Instance variables.
  	var _pin = pin;
  	if (util.isNullOrUndefined(_pin)) {
    	_pin = GpioPins.GPIO_NONE;
  	}

  	var _mode = mode;
  	if (util.isNullOrUndefined(_mode)) {
    	_mode = PinMode.OUT;
  	}

  	var _initValue = value;
  	if (util.isNullOrUndefined(_initValue)) {
    	_initValue = PinState.Low;
  	}

	var self = this;
	var _emitter = new EventEmitter();
  	var _revision = BoardRevision.Rev2;
  	var _isDisposed = false;
  	var _state = PinState.Low;
  	var _exportedPins = [];

  	/**
    * Determines whether or not this instance has been disposed.
    * @return {Boolean} true if disposed; Otherwise, false.
    * @override
    */
  	this.isDisposed = function() {
    	return _isDisposed;
  	};

  	/**
    * Attaches a listener (callback) for the specified event name.
    * @param  {String}   evt      The name of the event.
    * @param  {Function} callback The callback function to execute when the
    * event is raised.
    * @throws {ObjectDisposedException} if this instance has been disposed.
    */
  	this.on = function(evt, callback) {
    	if (_isDisposed) {
      	throw new ObjectDisposedException("GpioBase");
    	}
    	_emitter.on(evt, callback);
  	};

  	/**
    * Emits the specified event.
    * @param  {String} evt  The name of the event to emit.
    * @param  {Object} args The object that provides arguments to the event.
    * @throws {ObjectDisposedException} if this instance has been disposed.
    */
  	this.emit = function(evt, args) {
    	if (_isDisposed) {
      	throw new ObjectDisposedException("GpioBase");
    	}
    	_emitter.emit(evt, args);
  	};

  	/**
    * Fires the pin state change event.
    * @param  {PinStateChangeEvent} psce The event object.
    * @throws {ObjectDisposedException} if this instance has been disposed.
    * @protected
    */
  	this.onPinStateChange = function(psce) {
    	if (_isDisposed) {
      	throw new ObjectDisposedException("GpioBase");
    	}

    	var e = self._emitter;
    	var l_psce = psce;
    	process.nextTick(function() {
      	self.emit(Gpio.EVENT_STATE_CHANGED, l_psce);
    	}.bind(this));
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
    * @throws {ObjectDisposedException} if this instance has been disposed.
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
    * Exports the pin.
    * @param  {PinMode} mode The mode to set.
    * @private
    */
  	var exportPin = function(mode) {
    	var idx = _exportedPins.indexOf(self);
    	if (idx !== -1) {
      	if (_exportedPins[idx].mode() === mode) {
        		return;
      	}
      	else {
        		_mode = mode;
        		_exportedPins[idx].setMode(mode);
        		return;
      	}
    	}

    	_mode = mode;
    	_exportedPins.push(self);
  	};

  	/**
    * Write a value to the pin.
    * @param  {PinState} ps The pin state value to write to the pin.
    * @throws {ObjectDisposedException} if this instance has been disposed.
    */
  	this.write = function(ps) {
    	if (_isDisposed) {
      	throw new ObjectDisposedException("GpioBase");
    	}
    	_state = ps;
  	};

  	/**
    * Provisions this pin.
    * @throws {ObjectDisposedException} if this instance has been disposed.
    */
  	this.provision = function() {
    	if (_isDisposed) {
      	throw new ObjectDisposedException("GpioBase");
    	}
    	exportPin(_mode);
    	self.write(_initValue);
  	};

  	/**
    * Sets the mode for the pin.
    * @param  {PinMode} mode The mode to set the pin to.
    * @throws {ObjectDisposedException} if this instance has been disposed.
    * @protected
    */
  	this.setMode = function(mode) {
    	if (_isDisposed) {
      	throw new ObjectDisposedException("GpioBase");
    	}

    	if (util.isNullOrUndefined(mode)) {
      	mode = PinMode.TRI;
    	}

    	if (_mode !== mode) {
      	_mode = mode;
      	// If we're changing modes, we'll need to reprovision the pin.
      	self.provision();
    	}
  	};

  	/**
    * Gets the exported pins.
    * @return {Array} A dictionary of exported pins. Will be undefined this
    * instance has been disposed.
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
    * Pulse the pin output for the specified number of milliseconds.
    * @param  {Number} millis The number of milliseconds to wait between states.
    * @throws {ObjectDisposedException} if this instance has been disposed.
    * @override
    */
  	this.pulse = function(millis) {
    	if (_isDisposed) {
      	throw new ObjectDisposedException("GpioBase");
    	}

    	self.write(PinState.High);
    	setTimeout(function() {
      	self.write(PinState.Low);
    	}, millis);
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

    	_emitter.removeAllListeners();
	 	_emitter = undefined;
    	_exportedPins = undefined;
    	_state = undefined;
    	_mode = undefined;
    	_pin = undefined;
    	_isDisposed = true;
  	};
}

GpioBase.prototype.constructor = GpioBase;
inherits(GpioBase, RaspiGpio);

module.exports = GpioBase;
