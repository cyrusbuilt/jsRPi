"use strict";

//
//  Relay.js
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
var Component = require('../Component.js');
var RelayState = require('./RelayState.js');
var PinState = require('../../IO/PinState.js');

var STATE_CHANGE = "stateChanged";
var PULSE_START = "pulseStarted";
var PULSE_STOP = "pulseStopped";

/**
 * A relay component abstraction interface.
 * @interface
 * @extends {Component}
 */
function Relay() {
  Component.call(this);

  /**
   * In a derivative class, fires the relay state change event.
   * @param  {RelayStateChangeEvent} stateChangeEvent The state change event object.
   */
  this.onRelayStateChanged = function(stateChangeEvent) {};

  /**
   * In a derivative class, fires the pulse start event.
   */
  this.onPulseStart = function() {};

  /**
   * In a derivate class, fires the pulse stop event.
   */
  this.onPulseStop = function() {};

  /**
   * In a derivative class, gets the relay state.
   * @return {RelayState} The state of the relay.
   */
  this.getState = function() { return RelayState.Closed; };

  /**
   * In a derivative class, sets the state of the relay.
   * @param  {RelayState} state the state to set.
   */
  this.setState = function(state) {};

  /**
   * In a derivative class, checks to see if the relay is in an open state.
   * @return {Boolean} true if open; Otherwise, false.
   */
  this.isOpen = function() { return false; };

  /**
   * In a derivative class, checks to see if the relay is in a closed state.
   * @return {Boolean} true if closed; Otherwise, false.
   */
  this.isClosed = function() { return false; };

  /**
   * In a derivative class, opens (deactivates) the relay.
   */
  this.open = function() {};

  /**
   * In a derivative class, closes (activates) the relay.
   */
  this.close = function() {};

  /**
   * In a derivative class, toggles the relay (switch on, then off);
   */
  this.toggle = function() {};

  /**
   * In a derivative class, pulses the relay on for the specified number of
   * milliseconds, then back off again.
   * @param  {Number} millis The number of milliseconds to wait before switching
   * back off. If not specified or invalid, then pulses for DEFAULT_PULSE_MILLISECONDS.
   */
  this.pulse = function(millis) {};
}

Relay.prototype.constructor = Relay;
inherits(Relay, Component);

/**
 * The name of the state change event.
 * @type {String}
 * @const
 */
Relay.EVENT_STATE_CHANGED = STATE_CHANGE;

/**
 * The name of the pulse start event.
 * @type {String}
 * @const
 */
Relay.EVENT_PULSE_START = PULSE_START;

/**
 * The name of the pulse stop event.
 * @type {String}
 * @const
 */
Relay.EVENT_PULSE_STOPPED = PULSE_STOP;

/**
 * The pin state when the relay is open.
 * @type {PinState}
 * @const
 */
Relay.OPEN_STATE = PinState.Low;

/**
 * The pin state when the relay is closed.
 * @type {PinState}
 * @const
 */
Relay.CLOSED_STATE = PinState.High;

/**
 * The default pulse time (500ms [.2s]).
 * @type {Number}
 * @const
 */
Relay.DEFAULT_PULSE_MILLISECONDS = 200;

module.exports = Relay;
