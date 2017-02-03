"use strict";

//
//  ButtonBase.js
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
const ButtonBase = require('./ButtonBase.js');
const ArgumentNullException = require('../../ArgumentNullException.js');
const Gpio = require('../../IO/Gpio.js');
const PinState = require('../../IO/PinState.js');
const PinMode = require('../../IO/PinMode.js');
const ButtonState = require('./ButtonState.js');
const ButtonEvent = require('./ButtonEvent.js');
const ObjectDisposedException = require('../../ObjectDisposedException.js');
const InvalidOperationException = require('../../InvalidOperationException.js');

const PRESSED_STATE = PinState.High;
const RELEASED_STATE = PinState.Low;

/**
* @class A component that is an abstraction of a button. This is an
* implementation of {ButtonBase}.
* @extends {ButtonBase}
*/
class ButtonComponent extends ButtonBase {
  /**
   * Initializes a new instance of the jsrpi.Components.ButtonComponent class
   * with the pin the button is attached to.
   * @param {Gpio} pin The input pin the button is wired to.
   * @throws {ArgumentNullException} if the pin param is null or undefined.
   * @constructor
   */
  constructor(pin) {
    super();

    if (util.isNullOrUndefined(pin)) {
      throw new ArgumentNullException("'pin' param cannot be null or undefined.");
    }

    this._pin = pin;
    this._pin.provision();
    this._pin.on(Gpio.EVENT_STATE_CHANGED, (psce) => {
        this._onPinStateChanged(psce);
    });
    this._isPolling = false;
    this._pollTimer = null;
  }

  /**
  * Handles the pin state change event. This verifies the state has actually
  * changed, then fires the button state change event.
  * @param  {PinStateChangeEvent} psce The pin state change event info.
  * @private
  */
  _onPinStateChanged(psce) {
    if (psce.newState !== psce.oldState) {
      this._setState(psce.newState);
      this.onStateChanged(new ButtonEvent(this));
    }
  }

  /**
  * Gets the underlying pin the button is attached to.
  * @property {Gpio} pin - The underlying phyiscal pin.
  * @readonly
  */
  get pin() {
    return this._pin;
  }

  /**
  * Gets the button state.
  * @property {ButtonState} state - The button state.
  * @override
  */
  get state() {
    if (this._pin.state === PRESSED_STATE) {
      return ButtonState.Pressed;
    }
    return ButtonState.Released;
  }

  /**
  * Checks to see if the button is in poll mode, where it reads the button
  * state every 500ms and fires state change events when the state changes.
  * @property {Boolean} isPolling - true if the button is polling; Otherwise,
  * false.
  * @readonly
  */
  get isPolling() {
    return this._isPolling;
  }

  /**
  * Executes the poll cycle. This simply polls the pin, which in turn fires
  * pin state change events that we handle internally by firing button state
  * change events. This only occurs if polling is enabled.
  * @private
  */
  _executePoll() {
    if (this._isPolling) {
      this._pin.read();
    }
  }

  /**
  * Starts the poll timer. Every time the timer elapses, executePoll() will be
  * called.
  * @private
  */
  _startPollTimer() {
    this._isPolling = true;
    this._pollTimer = setInterval(() => { this._executePoll(); }, 500);
  }

  /**
  * Polls the button status.
  * @throws {ObjectDisposedException} if this instance has been disposed and
  * can no longer be used.
  * @throws {InvalidOperationException} if this button is attached to a pin
  * that has not been configured as an input.
  */
  poll() {
    if (this.isDisposed) {
      throw new ObjectDisposedException('ButtonComponent');
    }

    if (this._pin.mode !== PinMode.IN) {
      throw new InvalidOperationException("The pin this button is attached to" +
      " must be configured as an input.");
    }

    if (this._isPolling) {
      return;
    }

    this._startPollTimer();
  }

  /**
  * Interrupts the poll cycle.
  */
  interruptPoll() {
    if (!this._isPolling) {
      return;
    }

    if (this._pollTimer != null) {
      clearInterval(this._pollTimer);
      this._pollTimer = null;
    }
    this._isPolling = false;
  }

  /**
  * Releases all resources used by the GpioBase object.
  * @override
  */
  dispose() {
    if (this.isDisposed) {
      return;
    }

    this.interruptPoll();
    if (!util.isNullOrUndefined(this._pin)) {
      this._pin.dispose();
      this._pin = undefined;
    }

    super.dispose();
  }
}

module.exports = ButtonComponent;
