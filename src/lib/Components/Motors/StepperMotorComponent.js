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
  var _state = MotorState.Stop;
  var _sequenceIndex = 0;
  var _controlTimer = null;
  var _pins = pins;
  for (var i = 0; i < pins.length; i++) {
    _pins[i].provision();
  }

  /**
   * Gets the state of the motor.
   * @return {MotorState} The motor state.
   * @override
   */
  this.getState = function() {
    return _state;
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
    var seq = StepperMotorBase.prototype.getStepSequence.call(this);
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

    var millis = StepperMotorBase.prototype.getStepIntervalMillis.call(this);
    var nanos = StepperMotorBase.prototype.getStepIntervalNanos.call(this);
    CoreUtils.sleepMicroseconds((millis + (nanos * 1000000)) * 1000);
  };

  /**
   * Stops the continuous movement timer.
   * @private
   */
  var killTimer = function() {
    if (_controlTimer != null) {
      clearInterval(_controlTimer);
      _controlTimer = null;
    }
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
    if (StepperMotorBase.prototype.isDisposed.call(this)) {
      throw new ObjectDisposedException('StepperMotorComponent');
    }

    var oldState = _state;
    if (_state !== state) {
      _state = state;
      var evt = new MotorStateChangeEvent(oldState, _state);
      StepperMotorBase.prototype.onMotorStateChange(this, evt);
      executeMovement();
    }
  };

  /**
   * Step the motor the specified steps.
   * @param  {Number} steps The number of steps to rotate.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @override
   */
  this.step = function(steps) {
    if (StepperMotorBase.prototype.isDisposed.call(this)) {
      throw new ObjectDisposedException('StepperMotorComponent');
    }

    if (steps === 0) {
      self.setState(MotorState.Stop);
      return;
    }

    // Perform step in positive or negative direction from current position.
    var evt = new MotorRotateEvent(steps);
    StepperMotorBase.prototype.onRotationStarted.call(this, evt);
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
    StepperMotorBase.prototype.stop.call(this);
    StepperMotorBase.prototype.onRotationStopped.call(this);
  };

  /**
   * Releases all resources used by the GpioBase object.
   * @override
   */
  this.dispose = function() {
    if (StepperMotorBase.prototype.isDisposed.call(this)) {
      return;
    }

    if (!util.isNullOrUndefined(_controlTimer)) {
      killTimer();
    }

    self.setState(MotorState.Stop);
    _sequenceIndex = 0;
    if ((!util.isNullOrUndefined(_pins)) && (_pins.length > 0)) {
      for (var i = 0; i < _pins.length; i++) {
        _pins[i].write(PinState.Low);
        _pins[i].dispose();
      }
      _pins = undefined;
    }

    StepperMotorBase.prototype.dispose.call(this);
  };

  /**
   * Converts the current instance to it's string representation. This method
   * simply returns the component name.
   * @return {String} The component name.
   * @override
   */
  this.toString = function() {
    return StepperMotorBase.prototype.componentName;
  };
}

StepperMotorComponent.prototype.constructor = StepperMotorComponent;
inherits(StepperMotorComponent, StepperMotorBase);

module.exports = StepperMotorComponent;
