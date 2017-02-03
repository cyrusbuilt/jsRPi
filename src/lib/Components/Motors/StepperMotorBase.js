"use strict";

//
//  StepperMotorBase.js
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
const MotorBase = require('./MotorBase.js');
const StepperMotor = require('./StepperMotor.js');
const MotorRotateEvent = require('./MotorRotateEvent.js');
const ObjectDisposedException = require('../../ObjectDisposedException.js');

/**
 * @classdesc A base class for stepper motor components.
 * @implements {StepperMotor}
 * @extends {MotorBase}
 */
class StepperMotorBase extends StepperMotor {
  /**
   * Initializes a new instance of the jsrpi.Components.Motors.StepperMotorBase
   * class.
   * @constructor
   */
  constructor() {
    super();

    this._base = new MotorBase();
    this._stepIntervalMillis = 0;
    this._stepIntervalNanos = 0;
    this._stepSequence = [];
    this._stepsPerRevolution = 0;
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
   * Releases all resources used by the GpioBase object.
   * @override
   */
  dispose() {
    if (this.isDisposed) {
      return;
    }

    this._stepSequence.length = 0;
    this._stepsPerRevolution = 0;
    this._stepIntervalNanos = 0;
    this._stepIntervalMillis = 0;
    this._base.dispose();
  }

  /**
   * Removes all event listeners.
   * @override
   */
  removeAllListeners() {
    if (!this._base.isDisposed) {
      this._base.removeAllListeners();
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
    this._base.on(evt, callback);
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
    this._base.emit(evt, args);
  }

  /**
   * Fires the motor state change event.
   * @param  {MotorStateChangeEvent} stateChangeEvent The event info object.
   * @override
   */
  onMotorStateChange(stateChangeEvent) {
    this._base.onMotorStateChange(stateChangeEvent);
  }

  /**
   * Fires the rotation start event.
   * @param  {MotorRotateEvent} rotateEvent The event object.
   * @override
   */
  onRotationStarted(rotateEvent) {
    if (this.isDisposed) {
      throw new ObjectDisposedException("MotorBase");
    }

    setImmediate(() => {
      this._base.emit(StepperMotor.EVENT_ROTATION_STARTED, rotateEvent);
    });
  }

  /**
   * Fires the rotation stopped event.
   * @override
   */
  onRotationStopped() {
    if (this.isDisposed) {
      throw new ObjectDisposedException("MotorBase");
    }

    setImmediate(() => {
      this._base.emit(StepperMotor.EVENT_ROTATION_STOPPED);
    });
  }

  /**
   * Gets or sets the state of the motor.
   * @property {MotorState} state - The motor state.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @override
   */
  get state() {
    return this._base.state;
  }

  set state(s) {
    this._base.state = s;
  }

  /**
   * Determines whether the motor's current state is the specified state.
   * @param  {MotorState} state The state to check for.
   * @return {Boolean}       true if the motor is in the specified state;
   * Otherwise, false.
   * @override
   */
  isState(state) {
    return this._base.isState(state);
  }

  /**
   * Checks to see if the motor is stopped.
   * @property {Boolean} isStopped - true if stopped; Otherwise, false.
   * @readonly
   * @override
   */
  get isStopped() {
    return this._base.isState(MotorState.Stop);
  }

  /**
   * Gets or sets the number of steps per revolution.
   * @property {Number} stepsPerRevolution - The number of steps per revolution.
   * @override
   */
  get stepsPerRevolution() {
    return this._stepsPerRevolution;
  }

  set stepsPerRevolution(steps) {
    this._stepsPerRevolution = steps || 0;
  }

  /**
   * Gets or sets an array of bytes representing the step sequence.
   * @property {Array} stepSequence - The step sequence.
   * @override
   */
  get stepSequence() {
    return this._stepSequence;
  }

  set stepSequence(seq) {
    this._stepSequence = seq || [];
  }

  /**
   * Stops the motor's movement.
   * @override
   */
  stop() {
    this._base.stop();
  }

  /**
   * Tells the motor to move forward for the specified amount of time.
   * @param  {Number} millis The number of milliseconds to continue moving
   * forward for. If zero, null, or undefined, then moves forward continuously
   * until stopped.
   * @override
   */
  forward(millis) {
    this._base.forward(millis);
  }

  /**
   * Tells the motor to move in reverse for the specified amount of time.
   * @param  {Number} millis The number of milliseconds to continue moving in
   * reverse for. If zero, null, or undefined, then moves in reverse continuously
   * until stopped.
   * @override
   */
  reverse(millis) {
    this._base.reverse(millis);
  }

  /**
   * Gets the step interval in milliseconds.
   * @property {Number} stepIntervalMillis - The step interval.
   * @readonly
   */
  get stepIntervalMillis() {
    return this._stepIntervalMillis;
  }

  /**
   * Gets the step interval in nanoseconds.
   * @property {Number} stepIntervalNanos - The step interval.
   * @readonly
   */
  get stepIntervalNanos() {
    return this._stepIntervalNanos;
  }

  /**
   * Sets the step interval.
   * @param  {Number} millis      The milliseconds between steps.
   * @param  {Number} nanoseconds The nanoseconds between steps.
   * @override
   */
  setStepInterval(millis, nanos) {
    this._stepIntervalMillis = millis || 0;
    this._stepIntervalNanos = nanos || 0;
  }

  /**
   * Step the motor the specified steps.
   * @param  {Number} steps The number of steps to rotate.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @override
   */
  step(steps) {
    if (steps === 0) {
      this.state = MotorState.Stop;
      return;
    }

    if (steps < 0) {
      this.state = MotorState.Reverse;
    }
    else if (steps > 0) {
      this.state = MotorState.Forward;
    }
  }

  /**
   * Rotate the specified revolutions.
   * @param  {Number} revolutions The number of revolutions to rotate.
   * @override
   */
  rotate(revolutions) {
    let steps = Math.round(this._stepsPerRevolution * revolutions);
    let stepsActual = parseInt(steps.toString());
    this.onRotationStarted(new MotorRotateEvent(stepsActual));
    this.step(stepsActual);
    this.onRotationStopped();
  }
}

module.exports = StepperMotorBase;
