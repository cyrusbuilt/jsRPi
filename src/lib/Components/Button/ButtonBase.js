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

var inherits = require('util').inherits;
var extend = require('extend');
var Button = require('./Button.js');
var ButtonState = require('./ButtonState.js');
var ButtonEvent = require('./ButtonEvent.js');
var EventEmitter = require('events').EventEmitter;
var ComponentBase = require('../ComponentBase.js');

/**
 * Base class for button device abstraction components.
 * @constructor
 * @implements {Button}
 * @extends {ComponentBase}
 * @extends {EventEmitter}
 */
function ButtonBase() {
  Button.call(this);
  ComponentBase.call(this);
  EventEmitter.call(this);

  var self = this;
  var _holdTimer = null;
  var _isDisposed = false;

  /**
   * Gets a value indicating whether this instance is pressed.
   * @return {Boolean} true if pressed; Otherwise, false.
   * @override
   */
  this.isPressed = function() {
    return (self.getState() === ButtonState.Pressed);
  };

  /**
   * Gets a value indicating whether the button is released.
   * @return {Boolean} true if released; Otherwise, false.
   * @override
   */
  this.isReleased = function() {
    return (self.getState() === ButtonState.Released);
  };

  /**
   * Fires the button hold event.
   * @param  {ButtonEvent} btnEvent The event info.
   * @override
   * @protected
   */
  this.onButtonHold = function(btnEvent) {
    process.nextTick(function() {
      self.emit(Button.EVENT_HOLD, btnEvent);
    });
  };

  /**
   * Timer elapsed callback. This fires the button hold event if the button is
   * pressed.
   * @param  {ButtonEvent} btnEvent The button event info.
   * @private
   */
  var onHoldTimerElapsed = function(btnEvent) {
    if (self.isPressed()) {
      self.onButtonHold(new ButtonEvent(self));
    }
  };

  /**
   * Stops the button hold timer.
   * @private
   */
  var stopHoldTimer = function() {
    if (_holdTimer != null) {
      clearInterval(_holdTimer);
    }
    _holdTimer = null;
  };

  /**
   * Starts the button hold timer.
   * @private
   */
  var startHoldTimer = function() {
    _holdTimer = setInterval(onHoldTimerElapsed, 2000);
  };

  /**
   * Fires the button pressend event.
   * @param  {ButtonEvent} btnEvent The event info.
   * @override
   * @protected
   */
  this.onButtonPressed = function(btnEvent) {
    process.nextTick(function() {
      self.emit(Button.EVENT_PRESSED, btnEvent);
    });
    stopHoldTimer();
    startHoldTimer();
  };

  /**
   * Fires the button released event.
   * @param  {ButtonEvent} btnEvent The event info.
   * @override
   * @protected
   */
  this.onButtonReleased = function(btnEvent) {
    process.nextTick(function() {
      self.emit(Button.EVENT_RELEASED, btnEvent);
    });
    stopHoldTimer();
  };

  /**
   * Fires the button state changed event.
   * @param  {ButtonEvent} btnEvent The event info.
   * @override
   * @protected
   */
  this.onStateChanged = function(btnEvent) {
    process.nextTick(function() {
      self.emit(Button.EVENT_STATE_CHANGED, btnEvent);
    });

    if (btnEvent.isPressed()) {
      self.onButtonPressed();
    }

    if (btnEvent.isReleased()) {
      self.onButtonReleased();
    }
  };

  /**
   * Checks to see if the button is in a state matching the specified state.
   * @param  {ButtonState} state The state to check.
   * @return {Boolean}       true if the button is in the specified state;
   * Otherwise, false.
   * @override
   */
  this.isState = function(state) {
    return (self.getState() === state);
  };

  /**
   * Releases all resources used by the GpioBase object.
   * @override
   */
  this.dispose = function() {
    self.removeAllListeners();
    stopHoldTimer();
  };
}

ButtonBase.prototype.constructor = ButtonBase;
inherits(ButtonBase, Button);

module.exports = extend(true, ButtonBase, ComponentBase, EventEmitter);
