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

var inherits = require('util').inherits;
var Motor = require('./Motor.js');
var MotorState = require('./MotorState.js');
var MotorBase = require('./MotorBase.js');
var StepperMotor = require('./StepperMotor.js');
var MotorRotateEvent = require('./MotorRotateEvent.js');
var ObjectDisposedException = require('../../ObjectDisposedException.js');

/**
 * @classdesc A base class for stepper motor components.
 * @constructor
 * @implements {StepperMotor}
 * @extends {MotorBase}
 */
function StepperMotorBase() {
  StepperMotor.call(this);

  var self = this;
  var _base = new MotorBase();
  var _stepIntervalMillis = 0;
  var _stepIntervalNanos = 0;
  var _stepSequence = [];
  var _stepsPerRevolution = 0;

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
   */
  this.setProperty = function(key, value) {
    _base.setProperty(key, value);
  };

  /**
   * Determines whether or not this instance has been disposed.
   * @return {Boolean} true if disposed; Otherwise, false.
   * @override
   */
  this.isDisposed = function() {
    return _base.isDisposed();
  };

  /**
   * Releases all resources used by the GpioBase object.
   * @override
   */
  this.dispose = function() {
    if (_base.isDisposed()) {
      return;
    }

    _stepSequence.length = 0;
    _stepsPerRevolution = 0;
    _stepIntervalNanos = 0;
    _stepIntervalMillis = 0;
    _base.dispose();
  };

  /**
   * Removes all event listeners.
   * @override
   */
  this.removeAllListeners = function() {
    if (!_base.isDisposed()) {
      _base.removeAllListeners();
    }
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
    if (_base.isDisposed()) {
      throw new ObjectDisposedException("MotorBase");
    }
    _base.on(evt, callback);
  };

  /**
   * Emits the specified event.
   * @param  {String} evt  The name of the event to emit.
   * @param  {Object} args The object that provides arguments to the event.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @override
   */
  this.emit = function(evt, args) {
    if (_base.isDisposed()) {
      throw new ObjectDisposedException("MotorBase");
    }
    _base.emit(evt, args);
  };

  /**
   * Fires the motor state change event.
   * @param  {MotorStateChangeEvent} stateChangeEvent The event info object.
   * @override
   */
  this.onMotorStateChange = function(stateChangeEvent) {
    if (_base.isDisposed()) {
      throw new ObjectDisposedException("MotorBase");
    }

    process.nextTick(function() {
      _base.emit(Motor.EVENT_STATE_CHANGED, stateChangeEvent);
    });
  };

  /**
   * Fires the rotation start event.
   * @param  {MotorRotateEvent} rotateEvent The event object.
   * @override
   */
  this.onRotationStarted = function(rotateEvent) {
    if (_base.isDisposed()) {
      throw new ObjectDisposedException("MotorBase");
    }

    process.nextTick(function() {
      _base.emit(StepperMotor.EVENT_ROTATION_STARTED, rotateEvent);
    });
  };

  /**
   * Fires the rotation stopped event.
   * @override
   */
  this.onRotationStopped = function() {
    if (_base.isDisposed()) {
      throw new ObjectDisposedException("MotorBase");
    }

    process.nextTick(function() {
      _base.emit(StepperMotor.EVENT_ROTATION_STOPPED);
    });
  };

  /**
   * Fets the state of the motor.
   * @return {MotorState} The motor state.
   */
  this.getState = function() {
    return _base.getState();
  };

  /**
   * Sets the state of the motor.
   * @param  {MotorState} state The state to set the motor to.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  this.setState = function(state) {
    _base.setState(state);
  };

  /**
   * Determines whether the motor's current state is the specified state.
   * @param  {MotorState} state The state to check for.
   * @return {Boolean}       true if the motor is in the specified state;
   * Otherwise, false.
   * @override
   */
  this.isState = function(state) {
    return _base.isState(state);
  };

  /**
   * Checks to see if the motor is stopped.
   * @return {Boolean} true if stopped; Otherwise, false.
   * @override
   */
  this.isStopped = function() {
    return _base.isState(MotorState.Stop);
  };

  /**
   * Gets the number of steps per revolution.
   * @return {Number} The steps per revolution.
   * @override
   */
  this.getStepsPerRevolution = function() {
    return _stepsPerRevolution;
  };

  /**
   * Sets the number of steps per revolution.
   * @param  {Number} steps The steps per revolution.
   * @override
   */
  this.setStepsPerRevolution = function(steps) {
    _stepsPerRevolution = steps || 0;
  };

  /**
   * Fets the step sequence.
   * @return {Array} An array of bytes representing the step sequence.
   * @override
   */
  this.getStepSequence = function() {
    return _stepSequence;
  };

  /**
   * Stops the motor's movement.
   * @override
   */
  this.stop = function() {
    _base.stop();
  };

  /**
   * Tells the motor to move forward for the specified amount of time.
   * @param  {Number} millis The number of milliseconds to continue moving
   * forward for. If zero, null, or undefined, then moves forward continuously
   * until stopped.
   * @override
   */
  this.forward = function(millis) {
    _base.forward(millis);
  };

  /**
   * Tells the motor to move in reverse for the specified amount of time.
   * @param  {Number} millis The number of milliseconds to continue moving in
   * reverse for. If zero, null, or undefined, then moves in reverse continuously
   * until stopped.
   * @override
   */
  this.reverse = function(millis) {
    _base.reverse(millis);
  };

  /**
   * Sets the step sequence.
   * @param  {Array} seq An array of bytes representing the step sequence.
   * @override
   */
  this.setStepSequence = function(seq) {
    _stepSequence = seq || [];
  };

  /**
   * Gets the step interval in milliseconds.
   * @return {Number} The step interval in milliseconds.
   */
  this.getStepIntervalMillis = function() {
    return _stepIntervalMillis;
  };

  /**
   * Gets the step interval in nanoseconds.
   * @return {Number} The step interval in nanoseconds.
   */
  this.getStepIntervalNanos = function() {
    return _stepIntervalNanos;
  };

  /**
   * Sets the step interval.
   * @param  {Number} millis      The milliseconds between steps.
   * @param  {Number} nanoseconds The nanoseconds between steps.
   * @override
   */
  this.setStepInterval = function(millis, nanos) {
    _stepIntervalMillis = millis || 0;
    _stepIntervalNanos = nanos || 0;
  };

  /**
   * Step the motor the specified steps.
   * @param  {Number} steps The number of steps to rotate.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @override
   */
  this.step = function(steps) {
    if (steps === 0) {
      self.setState(MotorState.Stop);
      return;
    }

    if (steps < 0) {
      self.setState(MotorState.Reverse);
    }
    else if (steps > 0) {
      self.setState(MotorState.Forward);
    }
  };

  /**
   * Rotate the specified revolutions.
   * @param  {Number} revolutions The number of revolutions to rotate.
   * @override
   */
  this.rotate = function(revolutions) {
    var steps = Math.round(_stepsPerRevolution * revolutions);
    var stepsActual = parseInt(steps.toString());
    self.onRotationStarted(new MotorRotateEvent(stepsActual));
    self.step(stepsActual);
    self.onRotationStopped();
  };
}

StepperMotorBase.prototype.constructor = StepperMotorBase;
inherits(StepperMotorBase, StepperMotor);

module.exports = StepperMotorBase;
