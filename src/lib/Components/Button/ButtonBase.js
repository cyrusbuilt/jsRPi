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
const Button = require('./Button.js');
const ButtonState = require('./ButtonState.js');
const ButtonEvent = require('./ButtonEvent.js');
const EventEmitter = require('events').EventEmitter;
const ComponentBase = require('../ComponentBase.js');
const ObjectDisposedException = require('../../ObjectDisposedException.js');

/**
* Base class for button device abstraction components.
* @implements {Button}
* @extends {ComponentBase}
*/
class ButtonBase extends Button {
  /**
   * Initializes a new instance of the jsrpi.Components.Button.ButtonBase class.
   * This is the default constructor.
   * @constructor
   */
  constructor() {
    super();

    this._base = new ComponentBase();
    this._emitter = new EventEmitter();
    this._baseState = ButtonState.Released;
    this._holdTimer = null;
  }

  /**
   * Gets or sets the name of this component.
   * @property {String} componentName - The component name.
   * @override
   */
  get componentName() {
    return this._base.componentName;
  }

  set componentName(name) {
    this._base.componentName = name;
  }

  /**
   * Gets or sets the object this component is tagged with (if set).
   * @property {Object} tag - The tag.
   * @override
   */
  get tag() {
    return this._base.tag;
  }

  set tag(t) {
    this._base.tag = t;
  }

  /**
  * Determines whether or not the current instance has been disposed.
  * @property {Boolean} isDisposed - true if disposed; Otherwise, false.
  * @readonly
  * @override
  */
  get isDisposed() {
    return this._base.isDisposed;
  }

  /**
  * Overrides state with the specified state.
  * @param  {ButtonState} state The state to set.
  * @protected
  */
  _setState(state) {
    this._baseState = state;
  }

  /**
  * Gets the button state.
  * @property {ButtonState} state - The button state.
  * @override
  */
  get state() {
    return this._baseState;
  }

  /**
  * Attaches a listener (callback) for the specified event name.
  * @param  {String}   evt      The name of the event.
  * @param  {Function} callback The callback function to execute when the
  * event is raised.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @override
  */
  on(evt, callback) {
    if (this.isDisposed) {
      throw new ObjectDisposedException("GpioBase");
    }
    this._emitter.on(evt, callback);
  }

  /**
  * Emits the specified event.
  * @param  {String} evt  The name of the event to emit.
  * @param  {Object} args The object that provides arguments to the event.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @override
  */
  emit(evt, args) {
    if (this.isDisposed) {
      throw new ObjectDisposedException("GpioBase");
    }

    this._emitter.emit(evt, args);
  }

  /**
  * Gets a value indicating whether this instance is pressed.
  * @property {Boolean} isPressed - true if pressed; Otherwise, false.
  * @readonly
  * @override
  */
  get isPressed() {
    return (this.state === ButtonState.Pressed);
  }

  /**
  * Gets a value indicating whether the button is released.
  * @property {Boolean} isReleased - true if released; Otherwise, false.
  * @readonly
  * @override
  */
  get isReleased() {
    return (this.state === ButtonState.Released);
  }

  /**
  * Fires the button hold event.
  * @param  {ButtonEvent} btnEvent The event info.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @override
  * @protected
  */
  onButtonHold(btnEvent) {
    if (this.isDisposed) {
      throw new ObjectDisposedException("GpioBase");
    }

    setImmediate(() => {
      this.emit(Button.EVENT_HOLD, btnEvent);
    });
  }

  /**
  * Timer elapsed callback. This fires the button hold event if the button is
  * pressed.
  * @param  {ButtonEvent} btnEvent The button event info.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @private
  */
  _onHoldTimerElapsed(btnEvent) {
    if (this.isPressed) {
      this.onButtonHold(new ButtonEvent(this));
    }
  }

  /**
  * Stops the button hold timer.
  * @private
  */
  _stopHoldTimer() {
    if (!util.isNullOrUndefined(this._holdTimer)) {
      clearInterval(this._holdTimer);
    }
    this._holdTimer = null;
  }

  /**
  * Starts the button hold timer.
  * @private
  */
  _startHoldTimer() {
    this._holdTimer = setInterval((btnEvent) => {
        this._onHoldTimerElapsed(btnEvent);
    }, 2000);
  }

  /**
  * Fires the button pressend event.
  * @param  {ButtonEvent} btnEvent The event info.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @override
  * @protected
  */
  onButtonPressed(btnEvent) {
    if (this.isDisposed) {
      throw new ObjectDisposedException("GpioBase");
    }

    setImmediate(() => {
      this.emit(Button.EVENT_PRESSED, btnEvent);
    });
    this._stopHoldTimer();
    this._startHoldTimer();
  }

  /**
  * Fires the button released event.
  * @param  {ButtonEvent} btnEvent The event info.
  * @override
  * @protected
  */
  onButtonReleased(btnEvent) {
    if (this.isDisposed) {
      throw new ObjectDisposedException("GpioBase");
    }

    setImmediate(() => {
      this.emit(Button.EVENT_RELEASED, btnEvent);
    });
    this._stopHoldTimer();
  }

  /**
  * Fires the button state changed event.
  * @param  {ButtonEvent} btnEvent The event info.
  * @override
  * @protected
  */
  onStateChanged(btnEvent) {
    if (this.isDisposed) {
      throw new ObjectDisposedException("GpioBase");
    }

    setImmediate(() => {
      this.emit(Button.EVENT_STATE_CHANGED, btnEvent);
    });

    if (btnEvent.isPressed) {
      this.onButtonPressed(btnEvent);
    }

    if (btnEvent.isReleased) {
      this.onButtonReleased(btnEvent);
    }
  }

  /**
  * Checks to see if the button is in a state matching the specified state.
  * @param  {ButtonState} s The state to check.
  * @return {Boolean} true if the button is in the specified state; Otherwise,
  * false.
  * @override
  */
  isState(s) {
    return (this.state === s);
  }

  /**
  * Gets the custom property collection.
  * @property {Array} propertyCollection - The property collection.
  * @readonly
  * @override
  */
  get propertyCollection() {
    return this._base.propertyCollection;
  }

  /**
  * Checks to see if the property collection contains the specified key.
  * @param  {String} key The key name of the property to check for.
  * @return {Boolean}    true if the property collection contains the key;
  * Otherwise, false.
  * @override
  */
  hasProperty(key) {
    return this._base.hasProperty(key);
  }

  /**
  * Sets the value of the specified property. If the property does not already exist
  * in the property collection, it will be added.
  * @param  {String} key   The property name (key).
  * @param  {String} value The value to assign to the property.
  * @override
  */
  setProperty(key, value) {
    this._base.setProperty(key, value);
  }

  /**
  * Returns the string representation of this object. In this case, it simply
  * returns the component name.
  * @return {String} The name of this component.
  * @override
  */
  toString() {
    return this.componentName;
  }

  /**
  * Releases all resources used by the GpioBase object.
  * @override
  */
  dispose() {
    if (this.isDisposed) {
      return;
    }

    this._emitter.removeAllListeners();
    this._stopHoldTimer();
    this._base.dispose();
    this._emitter = undefined;
  }
}

module.exports = ButtonBase;
