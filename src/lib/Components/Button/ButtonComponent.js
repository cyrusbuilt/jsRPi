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

var util = require('util');
var inherits = require('util').inherits;
var ButtonBase = require('./ButtonBase.js');
var ArgumentNullException = require('../../ArgumentNullException.js');
var Gpio = require('../../IO/Gpio.js');
var PinState = require('../../IO/PinState.js');
var PinMode = require('../../IO/PinMode.js');
var ButtonState = require('./ButtonState.js');
var ButtonEvent = require('./ButtonEvent.js');
var ObjectDisposedException = require('../../ObjectDisposedException.js');
var InvalidOperationException = require('../../InvalidOperationException.js');

var PRESSED_STATE = PinState.High;
var RELEASED_STATE = PinState.Low;

/**
 * A component that is an abstraction of a button. This is an implementation
 * of {ButtonBase}.
 * @param {Gpio} pin The input pin the button is wired to.
 * @throws {ArgumentNullException} if the pin param is null or undefined.
 * @constructor
 * @extends {ButtonBase}
 */
function ButtonComponent(pin) {
  ButtonBase.call(this);

  if (util.isNullOrUndefined(pin)) {
    throw new ArgumentNullException("'pin' param cannot be null or undefined.");
  }

  /**
   * Handles the pin state change event. This verifies the state has actually
   * changed, then fires the button state change event.
   * @param  {PinStateChangeEvent} psce The pin state change event info.
   * @private
   */
  var onPinStateChanged = function(psce) {
    if (psce.getNewState() !== psce.getOldState()) {
      ButtonBase.prototype.onStateChanged.call(this, new ButtonEvent(self));
    }
  };

  var self = this;
  var _pin = pin;
  _pin.provision();
  _pin.on(Gpio.EVENT_STATE_CHANGED, onPinStateChanged);
  var _isPolling = false;
  var _pollTimer = null;

  /**
   * Gets the button state.
   * @return {ButtonState} Gets the state of the button.
   * @override
   */
  this.getState = function() {
    if (_pin.state() === PRESSED_STATE) {
      return ButtonState.Pressed;
    }
    return ButtonState.Released;
  };

  /**
   * Checks to see if the button is in poll mode, where it reads the button
   * state every 500ms and fires state change events when the state changes.
   * @return {Boolean} true if the button is polling; Otherwise, false.
   */
  this.isPolling = function() {
    return _isPolling;
  };

  /**
   * Executes the poll cycle. This simply polls the pin, which in turn fires
   * pin state change events that we handle internally by firing button state
   * change events. This only occurs if polling is enabled.
   */
  var executePoll = function() {
    if (_isPolling) {
      _pin.read();
    }
  };

  /**
   * Starts the poll timer. Every time the timer elapses, executePoll() will be
   * called.
   */
  var startPollTimer = function() {
    _isPolling = true;
    _pollTimer = setInterval(executePoll, 500);
  };

  /**
   * Polls the button status.
   * @throws {ObjectDisposedException} if this instance has been disposed and
   * can no longer be used.
   * @throws {InvalidOperationException} if this button is attached to a pin
   * that has not been configured as an input.
   */
  this.poll = function() {
    if (ButtonBase.prototype.isDisposed.call(this)) {
      throw new ObjectDisposedException('ButtonComponent');
    }

    if (_pin.mode() !== PinMode.IN) {
      throw new InvalidOperationException("The pin this button is attached to" +
                                            " must be configured as an input.");
    }

    if (_isPolling) {
      return;
    }
    startPollTimer();
  };

  /**
   * Interrupts the poll cycle.
   */
  this.interruptPoll = function() {
    if (!_isPolling) {
      return;
    }

    if (_pollTimer != null) {
      clearInterval(_pollTimer);
      _pollTimer = null;
    }
    _isPolling = false;
  };

  /**
   * Gets the string representation of this button component instance. This is
   * basically just an alias to the name property.
   * @return {String} The name of this button component.
   * @override
   */
  this.toString = function() {
    return self.name;
  };

  /**
   * Releases all resources used by the GpioBase object.
   * @override
   */
  this.dispose = function() {
    if (ButtonBase.prototype.isDisposed.call(this)) {
      return;
    }

    self.interruptPoll();
    if (!util.isNullOrUndefined(_pin)) {
      _pin.dispose();
      _pin = undefined;
    }
    ButtonBase.prototype.dispose.call(this);
  };
}

ButtonComponent.prototype.constructor = ButtonBase;
inherits(ButtonComponent, ButtonBase);

module.exports = ButtonComponent;
