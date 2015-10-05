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
var extend = require('extend');
var MotorBase = require('./MotorBase.js');
var StepperMotor = require('./StepperMotor.js');
var MotorRotateEvent = require('./MotorRotateEvent.js');

/**
 * @classdesc A base class for stepper motor components.
 * @constructor
 * @implements {StepperMotor}
 * @extends {MotorBase}
 */
function StepperMotorBase() {
  StepperMotor.call(this);
  MotorBase.call(this);

  var self = this;
  var _stepIntervalMillis = 0;
  var _stepIntervalNanos = 0;
  var _stepSequence = [];
  var _stepsPerRevolution = 0;

  /**
   * Fires the rotation start event.
   * @param  {MotorRotateEvent} rotateEvent The event object.
   * @override
   */
  this.onRotationStarted = function(rotateEvent) {
    process.nextTick(function() {
      self.emit(StepperMotor.EVENT_ROTATION_STARTED, rotateEvent);
    });
  };

  /**
   * Fires the rotation stopped event.
   * @override
   */
  this.onRotationStopped = function() {
    process.nextTick(function() {
      self.emit(StepperMotor.EVENT_ROTATION_STOPPED);
    });
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

module.exports = extend(true, StepperMotorBase, MotorBase);
