"use strict";

//
//  RelayBase.js
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
var ComponentBase = require('../ComponentBase.js');
var Relay = require('./Relay.js');
var RelayState = require('./RelayState.js');
var ArgumentNullException = require('../../ArgumentNullException.js');
var RelayStateChangeEvent = require('./RelayStateChangeEvent.js');
var EventEmitter = require('events').EventEmitter;
var ObjectDisposedException = require('../../ObjectDisposedException.js');

/**
 * @classdesc Base class for relay abstraction components.
 * @param {Gpio} pin The output pin being used to control the relay.
 * @throws {ArgumentNullException} if pin is null or undefined.
 * @constructor
 * @implements {Relay}
 * @extends {ComponentBase}
 * @extends {EventEmitter}
 */
function RelayBase(pin) {
  Relay.call(this);

  if (util.isNullOrUndefined(pin)) {
    throw new ArgumentNullException("'pin' cannot be null or undefined.");
  }

  var self = this;
  var _base = new ComponentBase();
  var _emitter = new EventEmitter();
  var _state = RelayState.Open;
  var _pin = pin;
  _pin.provision();

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

    _emitter.removeAllListeners();
    _emitter = undefined;
    _base.dispose();
  };

  /**
   * Removes all event listeners.
   * @override
   */
  this.removeAllListeners = function() {
    if (!_base.isDisposed()) {
      _emitter.removeAllListeners();
    }
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
    if (_base.isDisposed()) {
      throw new ObjectDisposedException("RelayBase");
    }
    _emitter.on(evt, callback);
  };

  /**
   * Emits the specified event.
   * @param  {String} evt  The name of the event to emit.
   * @param  {Object} args The object that provides arguments to the event.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @override
   */
  this.emit = function(evt, args) {
    if (_base.isDisposed()) {
      throw new ObjectDisposedException("RelayBase");
    }
    _emitter.emit(evt, args);
  };

  /**
   * Gets the relay state.
   * @return {RelayState} The state of the relay.
   */
  this.getState = function() {
    return _state;
  };

  /**
   * Sets the state of the relay.
   * @param  {RelayState} state the state to set.
   */
  this.setState = function(state) {
    if (_base.isDisposed()) {
      throw new ObjectDisposedException("RelayBase");
    }
    _state = state;
  };

  /**
   * Checks to see if the relay is in an open state.
   * @return {Boolean} true if open; Otherwise, false.
   * @override
   */
  this.isOpen = function() {
    return (self.getState() === RelayState.Open);
  };

  /**
   * Checks to see if the relay is in a closed state.
   * @return {Boolean} true if closed; Otherwise, false.
   * @override
   */
  this.isClosed = function() {
    return (self.getState() === RelayState.Closed);
  };

  /**
   * Gets the pin being used to drive the relay.
   */
  this.getPin = function() {
    return _pin;
  };

  /**
   * Fires the relay state change event.
   * @param  {RelayStateChangeEvent} stateChangeEvent The state change event object.
   * @override
   */
  this.onRelayStateChanged = function(relayStateChangeEvent) {
    if (_base.isDisposed()) {
      throw new ObjectDisposedException("RelayBase");
    }

    var e = _emitter;
    var evt = relayStateChangeEvent;
    process.nextTick(function() {
      e.emit(Relay.EVENT_STATE_CHANGED, evt);
    }.bind(this));
  };

  /**
   * Fires the pulse start event.
   * @override
   */
  this.onPulseStart = function() {
    if (_base.isDisposed()) {
      throw new ObjectDisposedException("RelayBase");
    }

    var e = _emitter;
    process.nextTick(function() {
      e.emit(Relay.EVENT_PULSE_START);
    }.bind(this));
  };

  /**
   * Fires the pulse stop event.
   * @override
   */
  this.onPulseStop = function() {
    if (_base.isDisposed()) {
      throw new ObjectDisposedException("RelayBase");
    }

    var e = _emitter;
    process.nextTick(function() {
      e.emit(Relay.EVENT_PULSE_STOPPED);
    }.bind(this));
  };

  /**
   * Checks to see if the relay is in an open state.
   * @override
   */
  this.open = function() {
    self.setState(RelayState.Open);
  };

  /**
   * Closes (activates) the relay.
   * @override
   */
  this.close = function() {
    self.setState(RelayState.Closed);
  };

  /**
   * Pulses the relay on for the specified number of
   * milliseconds, then back off again.
   * @param  {Number} millis The number of milliseconds to wait before switching
   * back off. If not specified or invalid, then pulses for DEFAULT_PULSE_MILLISECONDS.
   * @override
   */
  this.pulse = function(millis) {
    self.onPulseStart();
    self.close();
    _pin.pulse(millis);
    self.open();
    self.onPulseStop();
  };

  /**
   * Toggles the relay (switch on, then off);
   * @override
   */
  this.toggle = function() {
    if (self.isOpen()) {
      self.close();
    }
    else {
      self.open();
    }
  };

  /**
   * Checks to see if the relay is in the specified state.
   * @param  {RelayState} state The state to check.
   * @return {Boolean}       true if in the specified state; Otherwise, false.
   */
  this.isState = function(state) {
    return (self.getState() === state);
  };

  /**
   * Gets the string representation of this relay component instance. This is
   * basically just an alias to the componentName property.
   * @return {String} The name of this relay component.
   * @override
   */
  this.toString = function() {
    return self.componentName;
  };
}

RelayBase.prototype.constructor = RelayBase;
inherits(RelayBase, Relay);

module.exports = RelayBase;
