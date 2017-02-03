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

const util = require('util');
const ComponentBase = require('../ComponentBase.js');
const Relay = require('./Relay.js');
const RelayState = require('./RelayState.js');
const ArgumentNullException = require('../../ArgumentNullException.js');
const RelayStateChangeEvent = require('./RelayStateChangeEvent.js');
const EventEmitter = require('events').EventEmitter;
const ObjectDisposedException = require('../../ObjectDisposedException.js');

/**
 * @classdesc Base class for relay abstraction components.
 * @implements {Relay}
 * @extends {ComponentBase}
 * @extends {EventEmitter}
 */
class RelayBase extends Relay {
  /**
   * Initializes a new instance of the jsrpi.Components.Relays.RelayBase class
   * with the pin the relay is attached to.
   * @param {Gpio} pin The output pin being used to control the relay.
   * @throws {ArgumentNullException} if pin is null or undefined.
   * @constructor
   */
  constructor(pin) {
    super();

    if (util.isNullOrUndefined(pin)) {
      throw new ArgumentNullException("'pin' cannot be null or undefined.");
    }

    this._base = new ComponentBase();
    this._emitter = new EventEmitter();
    this._state = RelayState.Open;
    this._pin = pin;
    this._pin.provision();
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
   * Gets or sets the object this component is tagged with.
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
   * Determines whether or not this instance has been disposed.
   * @property {Boolean} isDisposed - true if disposed; Otherwise, false.
   * @readonly
   * @override
   */
  get isDisposed() {
    return this._base.isDisposed;
  }

  /**
   * In subclasses, performs application-defined tasks associated with freeing,
   * releasing, or resetting resources.
   * @override
   */
  dispose() {
    if (this._base.isDisposed) {
      return;
    }

    if (!util.isNullOrUndefined(this._pin)) {
      this._pin.dispose();
      this._pin = undefined;
    }

    this._state = RelayState.Open;
    this._emitter.removeAllListeners();
    this._emitter = undefined;
    this._base.dispose();
  }

  /**
   * Removes all event listeners.
   * @override
   */
  removeAllListeners() {
    if (!this._base.isDisposed) {
      this._emitter.removeAllListeners();
    }
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
    if (this._base.isDisposed) {
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
    if (this._base.isDisposed) {
      throw new ObjectDisposedException("GpioBase");
    }
    this._emitter.emit(evt, args);
  }

  /**
   * Gets or sets the relay state.
   * @property {RelayState} state - The relay state.
   * @override
   */
  get state() {
    return this._state;
  }

  set state(s) {
    if (this.isDisposed) {
      throw new ObjectDisposedException("RelayBase");
    }
    this._state = s;
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
   * @readonly
   * @override
   */
  get isClosed() {
    return (this.state === RelayState.Closed);
  }

  /**
   * Gets the pin being used to drive the relay.
   * @property {Gpio} pin - The underlying physical pin.
   * @readonly
   */
  get pin() {
    return this._pin;
  }

  /**
   * Fires the relay state change event.
   * @param  {RelayStateChangeEvent} stateChangeEvent The state change event object.
   * @override
   */
  onRelayStateChanged(relayStateChangeEvent) {
    if (this.isDisposed) {
      throw new ObjectDisposedException("RelayBase");
    }

    setImmediate(() => {
      this.emit(Relay.EVENT_STATE_CHANGED, relayStateChangeEvent);
    });
  }

  /**
   * Fires the pulse start event.
   * @override
   */
  onPulseStart() {
    if (this.isDisposed) {
      throw new ObjectDisposedException("RelayBase");
    }

    setImmediate(() => {
      this.emit(Relay.EVENT_PULSE_START);
    });
  }

  /**
   * Fires the pulse stop event.
   * @override
   */
  onPulseStop() {
    if (this.isDisposed) {
      throw new ObjectDisposedException("RelayBase");
    }

    setImmediate(() => {
      this.emit(Relay.EVENT_PULSE_STOPPED);
    });
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
    this.onPulseStart();
    this.close();
    this._pin.pulse(millis);
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
   */
  isState(state) {
    return (this.state === state);
  }

  /**
   * Gets the string representation of this relay component instance. This is
   * basically just an alias to the componentName property.
   * @return {String} The name of this relay component.
   * @override
   */
  toString() {
    return this.componentName;
  }
}

module.exports = RelayBase;
