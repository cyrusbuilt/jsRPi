"use strict";

//
//  MomentarySwitchComponent.js
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
var SwitchBase = require('./SwitchBase.js');
var Switch = require('./Switch.js');
var SwitchState = require('./SwitchState.js');
var PinState = require('../../IO/PinState.js');
var PinMode = require('../../IO/PinMode.js');
var Gpio = require('../../IO/Gpio.js');
var SwitchStateChangeEvent = require('./SwitchStateChangeEvent.js');
var ArgumentNullException = require('../../ArgumentNullException.js');
var ObjectDisposedException = require('../../ObjectDisposedException.js');
var InvalidOperationException = require('../../InvalidOperationException.js');

/**
 * @classdesc A component that is an abstraction of a momentary switch. This is
 * an implementation of SwitchBase.
 * @param {Gpio} pin The input pin the switch is attached to.
 * @throws {ArgumentNullException} if pin is null or undefined.
 * @constructor
 * @extends {SwitchBase}
 */
function MomentarySwitchComponent(pin) {
  SwitchBase.call(this);

  if (util.isNullOrUndefined(pin)) {
    throw new ArgumentNullException("'pin' param cannot be null or undefined.");
  }

  var OFF_STATE = PinState.Low;
  var ON_STATE = PinState.High;
  var self = this;
  var _pin = pin;
  var _isPolling = false;
  var _pollTimer = null;

  /**
   * Handles the pin state change event. This verifies the state has actually
   * changed, then fires the switch state change event.
   * @param  {PinStateChangeEvent} psce The pin state change event info.
   * @private
   */
  var onPinStateChanged = function(psce) {
    if (psce.getNewState() !== psce.getOldState()) {
      var evt = null;
      if (psce.getNewState() === ON_STATE) {
        evt = new SwitchStateChangeEvent(SwitchState.Off, SwitchState.On);
      }
      else {
        evt = new SwitchStateChangeEvent(SwitchState.On, SwitchState.Off);
      }

      SwitchBase.prototype.onSwitchStateChanged.call(this, evt);
    }
  };

  _pin.provision();
  _pin.on(Gpio.EVENT_STATE_CHANGED, onPinStateChanged);

  /**
   * Gets the state of the switch.
   * @return {SwitchState} The state of the switch.
   * @override
   */
  this.getState = function() {
    if (_pin.state() === ON_STATE) {
      return SwitchState.On;
    }
    return SwitchState.Off;
  };

  /**
   * Checks to see if the switch is in poll mode, where it reads the switch
   * state every 500ms and fires state change events when the state changes.
   * @return {Boolean} true if the switch is polling; Otherwise, false.
   */
  this.isPolling = function() {
    return _isPolling;
  };

  /**
   * Executes the poll cycle. This simply polls the pin, which in turn fires
   * pin state change events that we handle internally by firing switch state
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
   * Polls the switch status.
   * @throws {ObjectDisposedException} if this instance has been disposed and
   * can no longer be used.
   * @throws {InvalidOperationException} if this switch is attached to a pin
   * that has not been configured as an input.
   */
  this.poll = function() {
    if (SwitchBase.prototype.isDisposed.call(this)) {
      throw new ObjectDisposedException('SwitchComponent');
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
   * Releases all resources used by the GpioBase object.
   * @override
   */
  this.dispose = function() {
    if (SwitchBase.prototype.isDisposed.call(this)) {
      return;
    }

    self.interruptPoll();
    self.removeAllListeners();
    if (!util.isNullOrUndefined(_pin)) {
      _pin.dispose();
      _pin = undefined;
    }

    SwitchBase.prototype.dispose.call(this);
  };

  /**
   * Gets the string representation of this relay component instance. This is
   * basically just an alias to the componentName property.
   * @return {String} The name of this switch component.
   * @override
   */
  this.toString = function() {
    return SwitchBase.prototype.componentName;
  };
}

MomentarySwitchComponent.prototype.constructor = MomentarySwitchComponent;
inherits(MomentarySwitchComponent, SwitchBase);

module.exports = MomentarySwitchComponent;
