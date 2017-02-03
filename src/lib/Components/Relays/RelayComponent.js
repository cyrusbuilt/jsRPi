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

const util = require('util');
const Relay = require('./Relay.js');
const RelayBase = require('./RelayBase.js');
const RelayState = require('./RelayState.js');
const RelayStateChangeEvent = require('./RelayStateChangeEvent.js');
const PinState = require('../../IO/PinState.js');

/**
 * @classdesc A component that is an abstraction of a relay.
 * @extends {RelayBase}
 */
class RelayComponent extends RelayBase {
  /**
   * Initializes a new instance of the jsrpi.Components.Relays.RelayComponent
   * class with the pin the relay is attached to.
   * @param {Gpio} pin The I/O pin to use to drive the relay.
   * @throws {ArgumentNullException} if the pin is null or undefined.
   * @constructor
   */
  constructor(pin) {
    super(pin);
  }

  /**
   * Gets or sets the relay state.
   * @property {RelayState} state - The state of the relay.
   * @override
   */
  get state() {
    if (this.pin.state === Relay.OPEN_STATE) {
      return RelayState.Open;
    }
    return RelayState.Closed;
  }

  set state(s) {
    let oldState = this.state;
    if (oldState !== s) {
      switch(s) {
        case RelayState.Open:
          if (!this.isOpen) {
            this.pin.write(PinState.Low);
            super.state = s;
          }
          break;
        case RelayState.Closed:
          if (!this.isClosed) {
            this.pin.write(PinState.High);
            super.state = s;
          }
          break;
        default:
          break;
      }

      let evt = new RelayStateChangeEvent(oldState, s);
      this.onRelayStateChanged(evt);
    }
  }

  /**
   * Checks to see if the relay is in an open state.
   * @property {Boolean} isOpen - true if open; Otherwise, false.
   * @readonly
   * @override
   */
  get isOpen() {
    return (this.state === RelayState.Open);
  }

  /**
   * Checks to see if the relay is in a closed state.
   * @property {Boolean} isClosed - true if closed; Otherwise, false.
   * @override
   */
  get isClosed() {
    return (this.state === RelayState.Closed);
  }

  /**
   * Checks to see if the relay is in an open state.
   * @override
   */
  open() {
    this.state = RelayState.Open;
  }

  /**
   * Closes (activates) the relay.
   * @override
   */
  close() {
    this.state = RelayState.Closed;
  }

  /**
  * Pulses the relay on for the specified number of
  * milliseconds, then back off again.
  * @param  {Number} millis The number of milliseconds to wait before switching
  * back off. If not specified or invalid, then pulses for DEFAULT_PULSE_MILLISECONDS.
  * @override
  */
  pulse(millis) {
    if (util.isNullOrUndefined(millis)) {
      millis = Relay.DEFAULT_PULSE_MILLISECONDS;
    }

    this.onPulseStart();
    this.close();
    this.pin.pulse(millis);
    this.open();
    this.onPulseStop();
  }

  /**
   * Toggles the relay (switch on, then off);
   * @override
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    }
    else {
      this.open();
    }
  }

  /**
   * Checks to see if the relay is in the specified state.
   * @param  {RelayState} state The state to check.
   * @return {Boolean}       true if in the specified state; Otherwise, false.
   * @override
   */
  isState(state) {
    return (this.state === state);
  }
}

module.exports = RelayComponent;
