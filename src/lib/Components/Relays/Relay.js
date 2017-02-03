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

const Component = require('../Component.js');
const RelayState = require('./RelayState.js');
const PinState = require('../../IO/PinState.js');

const STATE_CHANGE = "stateChanged";
const PULSE_START = "pulseStarted";
const PULSE_STOP = "pulseStopped";

/**
 * A relay component abstraction interface.
 * @interface
 * @extends {Component}
 */
class Relay extends Component {
  /**
   * Initializes a new instance of the jsrpi.Components.Relays.Relay interface.
   */
  constructor() {
    super();
  }

  /**
   * In a derivative class, fires the relay state change event.
   * @param  {RelayStateChangeEvent} stateChangeEvent The state change event object.
   */
  onRelayStateChanged(stateChangeEvent) {}

  /**
   * In a derivative class, fires the pulse start event.
   */
  onPulseStart() {}

  /**
   * In a derivate class, fires the pulse stop event.
   */
  onPulseStop() {}

  /**
   * In a derivative class, gets or sets the relay state.
   * @property {RelayState} state - The state of the relay.
   */
  get state() { return RelayState.Closed; }

  set state(s) {}

  /**
   * In a derivative class, checks to see if the relay is in an open state.
   * @property {Boolean} isOpen - true if open; Otherwise, false.
   * @readonly
   */
  get isOpen() { return false; }

  /**
   * In a derivative class, checks to see if the relay is in a closed state.
   * @property {Boolean} isClosed - true if closed; Otherwise, false.
   * @readonly
   */
  get isClosed() { return false; }

  /**
   * In a derivative class, opens (deactivates) the relay.
   */
  open() {}

  /**
   * In a derivative class, closes (activates) the relay.
   */
  close() {}

  /**
   * In a derivative class, toggles the relay (switch on, then off);
   */
  toggle() {}

  /**
   * In a derivative class, pulses the relay on for the specified number of
   * milliseconds, then back off again.
   * @param  {Number} millis The number of milliseconds to wait before switching
   * back off. If not specified or invalid, then pulses for DEFAULT_PULSE_MILLISECONDS.
   */
  pulse(millis) {}

  /**
   * The name of the state change event.
   * @type {String}
   * @const
   */
  static get EVENT_STATE_CHANGED() { return STATE_CHANGE; }

  /**
   * The name of the pulse start event.
   * @type {String}
   * @const
   */
  static get EVENT_PULSE_START() { return PULSE_START; }

  /**
   * The name of the pulse stop event.
   * @type {String}
   * @const
   */
  static get EVENT_PULSE_STOPPED() { return PULSE_STOP; }

  /**
   * The pin state when the relay is open.
   * @type {PinState}
   * @const
   */
  static get OPEN_STATE() { return PinState.Low; }

  /**
   * The pin state when the relay is closed.
   * @type {PinState}
   * @const
   */
  static get CLOSED_STATE() { return PinState.High; }

  /**
   * The default pulse time (500ms [.2s]).
   * @type {Number}
   * @const
   */
  static get DEFAULT_PULSE_MILLISECONDS() { return 200; }
}

module.exports = Relay;
