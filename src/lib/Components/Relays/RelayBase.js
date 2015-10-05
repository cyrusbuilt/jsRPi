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
var extend = require('extend');
var ComponentBase = require('../ComponentBase.js');
var Relay = require('./Relay.js');
var RelayState = require('./RelayState.js');
var ArgumentNullException = require('../../ArgumentNullException.js');
var RelayStateChangeEvent = require('./RelayStateChangeEvent.js');
var EventEmitter = require('events').EventEmitter;

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
  ComponentBase.call(this);
  EventEmitter.call(this);

  if (util.isNullOrUndefined(pin)) {
    throw new ArgumentNullException("'pin' cannot be null or undefined.");
  }

  var self = this;
  var _pin = pin;
  _pin.provision();

  /**
   * Releases all resources used by the GpioBase object.
   * @override
   */
  this.dispose = function() {
    if (ComponentBase.prototype.isDisposed.call(this)) {
      return;
    }

    if (!util.isNullOrUndefined(_pin)) {
      _pin.dispose();
      _pin = undefined;
    }

    self.removeAllListeners();
    ComponentBase.prototype.dispose.call(this);
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
    process.nextTick(function() {
      self.emit(Relay.EVENT_STATE_CHANGED, relayStateChangeEvent);
    });
  };

  /**
   * Fires the pulse start event.
   * @override
   */
  this.onPulseStart = function() {
    process.nextTick(function() {
      self.emit(Relay.EVENT_PULSE_START);
    });
  };

  /**
   * Fires the pulse stop event.
   * @override
   */
  this.onPulseStop = function() {
    process.nextTick(function() {
      self.emit(Relay.EVENT_PULSE_STOPPED);
    });
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
    return ComponentBase.prototype.componentName;
  };
}

RelayBase.prototype.constructor = RelayBase;
inherits(RelayBase, Relay);

module.exports = extend(true, RelayBase, ComponentBase, EventEmitter);
