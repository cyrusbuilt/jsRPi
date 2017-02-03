"use strict";

//
//  MotorBase.js
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

const Motor = require('./Motor.js');
const MotorState = require('./MotorState.js');
const ComponentBase = require('../ComponentBase.js');
const EventEmitter = require('events').EventEmitter;
const MotorStateChangeEvent = require('./MotorStateChangeEvent.js');
const ObjectDisposedException = require('../../ObjectDisposedException.js');

/**
 * @classdesc Base class for motor abstraction components.
 * @implements {Motor}
 * @extends {ComponentBase}
 * @extends {EventEmitter}
 */
class MotorBase extends Motor {
  /**
   * Initializes a new instance of the jsrpi.Components.Motors.MotorBase class.
   * @constructor
   */
  constructor() {
    super();

    this._base = new ComponentBase();
    this._emitter = new EventEmitter();
    this._state = MotorState.Stop;
  }

  /**
   * Gets or sets the name of this component.
   * @property {String} componentName - The name of the component.
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
   * @return {Boolean} true if the property collection contains the key;
   * Otherwise, false.
   * @override
   */
  hasProperty(key) {
    return this._base.hasProperty(key);
  }

  /**
   * Sets the value of the specified property. If the property does not already
   * exist in the property collection, it will be added.
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
   * Fires the motor state change event.
   * @param  {MotorStateChangeEvent} stateChangeEvent The event info object.
   * @override
   */
  onMotorStateChange(stateChangeEvent) {
    if (this.isDisposed) {
      throw new ObjectDisposedException("MotorBase");
    }

    setImmediate(() => {
      this.emit(Motor.EVENT_STATE_CHANGED, stateChangeEvent);
      switch (stateChangeEvent.newState) {
        case MotorState.Stop:
          this.emit(Motor.EVENT_STOPPED);
          break;
        case MotorState.Forward:
          this.emit(Motor.EVENT_FORWARD);
          break;
        case MotorState.Reverse:
          this.emit(Motor.EVENT_REVERSE);
          break;
        default:
          break;
      }
    });
  }

  /**
   * Gets or sets the state of the motor.
   * @property {MotorState} state - The motor state.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @override
   */
  get state() {
    return this._state;
  }

  set state(s) {
    if (this.isDisposed) {
      throw new ObjectDisposedException("MotorBase");
    }
    this._state = s;
  }

  /**
   * Determines whether the motor's current state is the specified state.
   * @param  {MotorState} state The state to check for.
   * @return {Boolean} true if the motor is in the specified state; Otherwise,
   * false.
   * @override
   */
  isState(s) {
    return (this.state === s);
  }

  /**
   * Checks to see if the motor is stopped.
   * @property {Boolean} isStopped - true if stopped; Otherwise, false.
   * @readonly
   * @override
   */
  get isStopped() {
    return this.isState(MotorState.Stop);
  }

  /**
   * Stops the motor's movement.
   * @override
   */
  stop() {
    if (this.state === MotorState.Stop) {
      return;
    }
    let oldState = this.state;
    this.state = MotorState.Stop;
    this.onMotorStateChange(new MotorStateChangeEvent(oldState, MotorState.Stop));
  }

  /**
   * Tells the motor to move forward for the specified amount of time.
   * @param  {Number} millis The number of milliseconds to continue moving
   * forward for. If zero, null, or undefined, then moves forward continuously
   * until stopped.
   * @override
   */
  forward(millis) {
    if (this.state === MotorState.Forward) {
      return;
    }

    let oldState = this.state;
    this.state = MotorState.Forward;
    this.onMotorStateChange(new MotorStateChangeEvent(oldState, MotorState.Forward));

    let ms = millis || 0;
    if (ms > 0) {
      setTimeout(() => {
        this.stop();
      }, ms);
    }
  }

  /**
   * Tells the motor to move in reverse for the specified amount of time.
   * @param  {Number} millis The number of milliseconds to continue moving in
   * reverse for. If zero, null, or undefined, then moves in reverse
   * continuously until stopped.
   * @override
   */
  reverse(millis) {
    if (this.state === MotorState.Reverse) {
      return;
    }

    let oldState = this.state;
    this.state = MotorState.Reverse;
    this.onMotorStateChange(new MotorStateChangeEvent(oldState, MotorState.Reverse));

    let ms = millis || 0;
    if (ms > 0) {
      setTimeout(() => {
        this.stop();
      }, ms);
    }
  }
}

module.exports = MotorBase;
