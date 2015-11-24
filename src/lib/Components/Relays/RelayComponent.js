"use strict";

//
//  RelayComponent.js
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
var Relay = require('./Relay.js');
var RelayBase = require('./RelayBase.js');
var RelayState = require('./RelayState.js');
var RelayStateChangeEvent = require('./RelayStateChangeEvent.js');
var PinState = require('../../IO/PinState.js');

/**
 * @classdesc A component that is an abstraction of a relay.
 * @param {Gpio} pin The I/O pin to use to drive the relay.
 * @throws {ArgumentNullException} if the pin is null or undefined.
 * @constructor
 * @extends {RelayBase}
 */
function RelayComponent(pin) {
  RelayBase.call(this, pin);

  var self = this;
  var _base = new RelayBase(pin);

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
    _base.dispose();
  };

  /**
   * Removes all event listeners.
   * @override
   */
  this.removeAllListeners = function() {
    if (!_base.isDisposed()) {
      _base.removeAllListeners();
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
   * Gets the relay state.
   * @return {RelayState} The state of the relay.
   * @override
   */
  this.getState = function() {
    if (_base.getPin().state() === Relay.OPEN_STATE) {
      return RelayState.Open;
    }
    return RelayState.Closed;
  };

  /**
   * Sets the state of the relay.
   * @param  {RelayState} state the state to set.
   * @override
   */
  this.setState = function(state) {
    var oldState = self.getState();
    if (oldState !== state) {
      switch(state) {
        case RelayState.Open:
          if (!_base.isOpen()) {
            _base.getPin().write(PinState.Low);
            _base.setState(state);
          }
          break;
        case RelayState.Closed:
          if (!_base.isClosed()) {
            _base.getPin().write(PinState.High);
            _base.setState(state);
          }
          break;
        default:
          break;
      }
      var evt = new RelayStateChangeEvent(oldState, state);
      _base.onRelayStateChanged(evt);
    }
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
    return _base.getPin();
  };

  /**
   * Fires the relay state change event.
   * @param  {RelayStateChangeEvent} stateChangeEvent The state change event object.
   * @override
   */
  this.onRelayStateChanged = function(relayStateChangeEvent) {
    _base.onRelayStateChanged(relayStateChangeEvent);
  };

  /**
   * Fires the pulse start event.
   * @override
   */
  this.onPulseStart = function() {
    _base.onPulseStart();
  };

  /**
   * Fires the pulse stop event.
   * @override
   */
  this.onPulseStop = function() {
    _base.onPulseStop();
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
	 if (util.isNullOrUndefined(millis)) {
		 millis = Relay.DEFAULT_PULSE_MILLISECONDS;
	 } 
    self.onPulseStart();
    self.close();
    _base.getPin().pulse(millis);
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

RelayComponent.prototype.constructor = RelayComponent;
inherits(RelayComponent, RelayBase);

module.exports = RelayComponent;
