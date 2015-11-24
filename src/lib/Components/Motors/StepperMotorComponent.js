"use strict";

//
//  StepperMotorComponent.js
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
var CoreUtils = require('../../PiSystem/CoreUtils.js');
var inherits = require('util').inherits;
var StepperMotorBase = require('./StepperMotorBase.js');
var MotorState = require('./MotorState.js');
var PinState = require('../../IO/PinState.js');
var ArgumentNullException = require('../../ArgumentNullException.js');
var ObjectDisposedException = require('../../ObjectDisposedException.js');
var MotorStateChangeEvent = require('./MotorStateChangeEvent.js');
var MotorRotateEvent = require('./MotorRotateEvent.js');

/**
 * @classdesc A component that is an abstraction of a stepper motor.
 * @param {Array} pins The output pins for each controller in the stepper motor.
 * This should be an array of Gpio (or derivative) objects.
 * @throws {ArgumentNullException} if pins is null, undefined, or zero-length.
 * @constructor
 * @extends {StepperMotorBase}
 */
function StepperMotorComponent(pins) {
  StepperMotorBase.call(this);

  if ((util.isNullOrUndefined(pins)) || (pins.length === 0)) {
    throw new ArgumentNullException("'pins' cannot be null, undefined, or an empty array.");
  }

  var self = this;
  var _base = new StepperMotorBase();
  var _sequenceIndex = 0;
  var _controlTimer = null;
  var _pins = pins;
  for (var i = 0; i < _pins.length; i++) {
    _pins[i].provision();
  }

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
   * Stops the continuous movement timer.
   * @private
   */
  var killTimer = function() {
    if (!util.isNullOrUndefined(_controlTimer)) {
      clearInterval(_controlTimer);
      _controlTimer = null;
    }
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
    _base.emit(evt, args);
  };

  /**
   * Fires the motor state change event.
   * @param  {MotorStateChangeEvent} stateChangeEvent The event info object.
   * @override
   */
  this.onMotorStateChange = function(stateChangeEvent) {
    _base.onMotorStateChange(stateChangeEvent);
  };

  /**
   * Fires the rotation start event.
   * @param  {MotorRotateEvent} rotateEvent The event object.
   * @override
   */
  this.onRotationStarted = function(rotateEvent) {
    _base.onRotationStarted(rotateEvent);
  };

  /**
   * Fires the rotation stopped event.
   * @override
   */
  this.onRotationStopped = function() {
    _base.onRotationStopped();
  };

  /**
   * Gets the state of the motor.
   * @return {MotorState} The motor state.
   * @override
   */
  this.getState = function() {
    return _base.getState();
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
    return _base.getStepsPerRevolution();
  };

  /**
   * Sets the number of steps per revolution.
   * @param  {Number} steps The steps per revolution.
   * @override
   */
  this.setStepsPerRevolution = function(steps) {
    _base.setStepsPerRevolution(steps);
  };

  /**
   * Fets the step sequence.
   * @return {Array} An array of bytes representing the step sequence.
   * @override
   */
  this.getStepSequence = function() {
    return _base.getStepSequence();
  };

  /**
   * Sets the step sequence.
   * @param  {Array} seq An array of bytes representing the step sequence.
   * @override
   */
  this.setStepSequence = function(seq) {
    _base.setStepSequence(seq);
  };

  /**
   * Gets the step interval in milliseconds.
   * @return {Number} The step interval in milliseconds.
   */
  this.getStepIntervalMillis = function() {
    return _base.getStepIntervalMillis();
  };

  /**
   * Gets the step interval in nanoseconds.
   * @return {Number} The step interval in nanoseconds.
   */
  this.getStepIntervalNanos = function() {
    return _base.getStepIntervalNanos();
  };

  /**
   * Sets the step interval.
   * @param  {Number} millis      The milliseconds between steps.
   * @param  {Number} nanoseconds The nanoseconds between steps.
   * @override
   */
  this.setStepInterval = function(millis, nanos) {
    _base.setStepInterval(millis, nanos);
  };

  /**
   * Steps the the motor forward or backward.
   * @param  {Boolean} forward Set true if moving forward.
   * @private
   */
  var doStep = function(forward) {
    if (forward) {
      _sequenceIndex++;
    }
    else {
      _sequenceIndex--;
    }

    // Check sequence bounds; rollover if needed.
    var seq = _base.getStepSequence();
    if (_sequenceIndex >= seq.length) {
      _sequenceIndex = 0;
    }
    else if (_sequenceIndex < 0) {
      _sequenceIndex = (seq.length - 1);
    }

    // Start cycling through GPIO pins to move the motor forward or reverse.
    var nib = 0;
    for (var i = 0; i < _pins.length; i++) {
      nib = Math.pow(2, i);
      if ((seq[_sequenceIndex] & parseInt(nib.toString())) > 0) {
        _pins[i].write(PinState.High);
      }
      else {
        _pins[i].write(PinState.Low);
      }
    }

    var millis = _base.getStepIntervalMillis();
    var nanos = _base.getStepIntervalNanos();
    CoreUtils.sleepMicroseconds((millis + (nanos * 1000000)) * 1000);
  };

  /**
   * Helper method for executing or ending movement.
   * @private
   */
  var asyncExecMovement = function() {
    if (self.getState() !== MotorState.Stop) {
      doStep(self.getState() === MotorState.Forward);
      return;
    }

    for (var i = 0; i < _pins.length; i++) {
      _pins[i].write(PinState.Low);
    }
    killTimer();
  };

  /**
   * Asynchronously executes or ends movement based on motor state.
   * @private
   */
  var executeMovement = function() {
    if (self.getState() === MotorState.Stop) {
      for (var i = 0; i < _pins.length; i++) {
        _pins[i].write(PinState.Low);
      }
      killTimer();
      return;
    }

    _controlTimer = setInterval(asyncExecMovement, 10);
  };

  /**
   * Sets the state of the motor.
   * @param  {MotorState} state The state to set the motor to.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @override
   */
  this.setState = function(state) {
    if (_base.isDisposed()) {
      throw new ObjectDisposedException('StepperMotorComponent');
    }

    var oldState = _base.getState();
    if (_base.getState() !== state) {
      _base.setState(state);
      var evt = new MotorStateChangeEvent(oldState, state);
      _base.onMotorStateChange(evt);
      executeMovement();
    }
  };

  /**
   * Stops the motor's movement.
   * @override
   */
  this.stop = function() {
    for (var i = 0; i < _pins.length; i++) {
      _pins[i].write(PinState.Low);
    }
    _base.stop();
  };

  /**
   * Step the motor the specified steps.
   * @param  {Number} steps The number of steps to rotate.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @override
   */
  this.step = function(steps) {
    if (_base.isDisposed()) {
      throw new ObjectDisposedException('StepperMotorComponent');
    }

    if (steps === 0) {
      self.setState(MotorState.Stop);
      return;
    }

    // Perform step in positive or negative direction from current position.
    _base.step(steps);
    var evt = new MotorRotateEvent(steps);
    _base.onRotationStarted(evt);
    if (steps > 0) {
      for (var i = 0; i < steps; i++) {
        doStep(true);
      }
    }
    else {
      for (var j = steps; j < 0; j++) {
        doStep(false);
      }
    }

    // Stop movement.
    _base.stop();
    _base.onRotationStopped();
  };

  /**
   * Tells the motor to move forward for the specified amount of time.
   * @param  {Number} millis The number of milliseconds to continue moving
   * forward for. If zero, null, or undefined, then moves forward continuously
   * until stopped.
   * @override
   */
  this.forward = function(millis) {
    if (self.getState() === MotorState.Forward) {
      return;
    }
    var oldState = self.getState();
    self.setState(MotorState.Forward);
    self.onMotorStateChange(new MotorStateChangeEvent(oldState, MotorState.Forward));

    var ms = millis || 0;
    if (ms > 0) {
      setTimeout(function() {
        self.stop();
      }, ms);
    }
  };

  /**
   * Tells the motor to move in reverse for the specified amount of time.
   * @param  {Number} millis The number of milliseconds to continue moving in
   * reverse for. If zero, null, or undefined, then moves in reverse continuously
   * until stopped.
   * @override
   */
  this.reverse = function(millis) {
    if (self.getState() === MotorState.Reverse) {
      return;
    }
    var oldState = self.getState();
    self.setState(MotorState.Reverse);
    self.onMotorStateChange(new MotorStateChangeEvent(oldState, MotorState.Reverse));

    var ms = millis || 0;
    if (ms > 0) {
      setTimeout(function() {
        self.stop();
      }, ms);
    }
  };

  /**
   * Rotate the specified revolutions.
   * @param  {Number} revolutions The number of revolutions to rotate.
   * @override
   */
  this.rotate = function(revolutions) {
    var steps = Math.round(_base.getStepsPerRevolution() * revolutions);
    var stepsActual = parseInt(steps.toString());
    self.onRotationStarted(new MotorRotateEvent(stepsActual));
    self.step(stepsActual);
    self.onRotationStopped();
  };

  /**
   * Releases all resources used by the GpioBase object.
   * @override
   */
  this.dispose = function() {
    if (_base.isDisposed()) {
      return;
    }

    killTimer();
    self.setState(MotorState.Stop);
    _sequenceIndex = 0;
    if ((!util.isNullOrUndefined(_pins)) && (_pins.length > 0)) {
      for (var i = 0; i < _pins.length; i++) {
        _pins[i].write(PinState.Low);
        _pins[i].dispose();
      }
      _pins = undefined;
    }

    _base.dispose();
  };

  /**
   * Converts the current instance to it's string representation. This method
   * simply returns the component name.
   * @return {String} The component name.
   * @override
   */
  this.toString = function() {
    return self.componentName;
  };
}

StepperMotorComponent.prototype.constructor = StepperMotorComponent;
inherits(StepperMotorComponent, StepperMotorBase);

module.exports = StepperMotorComponent;
