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
var Button = require('./Button.js');
var ButtonState = require('./ButtonState.js');
var ButtonEvent = require('./ButtonEvent.js');
var EventEmitter = require('events').EventEmitter;
var ComponentBase = require('../ComponentBase.js');
var ObjectDisposedException = require('../../ObjectDisposedException.js');

/**
 * Base class for button device abstraction components.
 * @constructor
 * @implements {Button}
 * @extends {ComponentBase}
 */
function ButtonBase() {
  Button.call(this);

  var self = this;
  var _base = new ComponentBase();
  this._emitter = new EventEmitter();
  var _baseState = ButtonState.Released;
  var _holdTimer = null;

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
   * Determines whether or not the current instance has been disposed.
   * @return {Boolean} true if disposed; Otherwise, false.
   * @override
   */
  this.isDisposed = function() {
    return _base.isDisposed();
  };

  /**
   * Overrides state with the specified state.
   * @param  {ButtonState} state The state to set.
   * @protected
   */
  this._setState = function(state) {
    _baseState = state;
  };

  /**
   * Gets the button state.
   * @return {ButtonState} Gets the state of the button.
   */
  this.getState = function() {
    return _baseState;
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
    if (self.isDisposed()) {
      throw new ObjectDisposedException("GpioBase");
    }
    self._emitter.on(evt, callback);
  };

  /**
   * Emits the specified event.
   * @param  {String} evt  The name of the event to emit.
   * @param  {Object} args The object that provides arguments to the event.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @override
   */
  this.emit = function(evt, args) {
    if (self.isDisposed()) {
      throw new ObjectDisposedException("GpioBase");
    }
    self._emitter.emit(evt, args);
  };

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
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @override
   * @protected
   */
  this.onButtonHold = function(btnEvent) {
    if (self.isDisposed()) {
      throw new ObjectDisposedException("GpioBase");
    }

    var e = self._emitter;
    var evt = btnEvent;
    process.nextTick(function() {
      e.emit(Button.EVENT_HOLD, evt);
    }.bind(this));
  };

  /**
   * Timer elapsed callback. This fires the button hold event if the button is
   * pressed.
   * @param  {ButtonEvent} btnEvent The button event info.
   * @throws {ObjectDisposedException} if this instance has been disposed.
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
    if (!util.isNullOrUndefined(_holdTimer)) {
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
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @override
   * @protected
   */
  this.onButtonPressed = function(btnEvent) {
    if (self.isDisposed()) {
      throw new ObjectDisposedException("GpioBase");
    }

    var e = self._emitter;
    var evt = btnEvent;
    process.nextTick(function() {
      e.emit(Button.EVENT_PRESSED, evt);
    }.bind(this));
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
    if (self.isDisposed()) {
      throw new ObjectDisposedException("GpioBase");
    }

    var e = self._emitter;
    var evt = btnEvent;
    process.nextTick(function() {
      e.emit(Button.EVENT_RELEASED, evt);
    }.bind(this));
    stopHoldTimer();
  };

  /**
   * Fires the button state changed event.
   * @param  {ButtonEvent} btnEvent The event info.
   * @override
   * @protected
   */
  this.onStateChanged = function(btnEvent) {
    if (self.isDisposed()) {
      throw new ObjectDisposedException("GpioBase");
    }

    var e = self._emitter;
    var evt = btnEvent;
    process.nextTick(function() {
      e.emit(Button.EVENT_STATE_CHANGED, evt);
    }.bind(this));

    if (btnEvent.isPressed()) {
      self.onButtonPressed(evt);
    }

    if (btnEvent.isReleased()) {
      self.onButtonReleased(evt);
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
   * @override
   */
  this.setProperty = function(key, value) {
    _base.setProperty(key, value);
  };

  /**
   * Returns the string representation of this object. In this case, it simply
   * returns the component name.
   * @return {String} The name of this component.
   */
  this.toString = function() {
    return self.componentName;
  };

  /**
   * Releases all resources used by the GpioBase object.
   * @override
   */
  this.dispose = function() {
    if (self.isDisposed()) {
      return;
    }

    self._emitter.removeAllListeners();
    stopHoldTimer();
    _base.dispose();
    self._emitter = undefined;
  };
}

ButtonBase.prototype.constructor = ButtonBase;
inherits(ButtonBase, Button);

module.exports = ButtonBase;
