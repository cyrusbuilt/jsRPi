"use strict";

//
//  StepperMotor.js
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

/**
 * A stepper motor abstraction interface.
 * @interface
 * @extends {Motor}
 */
function StepperMotor() {
  Motor.call(this);
}

StepperMotor.prototype.constructor = StepperMotor;
inherits(StepperMotor, Motor);

/**
 * In a derived class, fires the rotation start event.
 * @param  {MotorRotateEvent} rotateEvent The event object.
 */
StepperMotor.prototype.onRotationStarted = function(rotateEvent) {};

/**
 * In a derived class, fires the rotation stopped event.
 */
StepperMotor.prototype.onRotationStopped = function() {};

/**
 * In a derived class, gets the number of steps per revolution.
 * @return {Number} The steps per revolution.
 */
StepperMotor.prototype.getStepsPerRevolution = function() { return 0; };

/**
 * In a derived class, sets the number of steps per revolution.
 * @param  {Number} steps The steps per revolution.
 */
StepperMotor.prototype.setStepsPerRevolution = function(steps) {};

/**
 * In a derived class, gets the step sequence.
 * @return {Array} An array of bytes representing the step sequence.
 */
StepperMotor.prototype.getStepSequence = function() { return []; };

/**
 * In a derived class, sets the step sequence.
 * @param  {Array} seq An array of bytes representing the step sequence.
 */
StepperMotor.prototype.setStepSequence = function(seq) {};

/**
 * In a derived class, sets the step interval.
 * @param  {Number} millis      The milliseconds between steps.
 * @param  {Number} nanoseconds The nanoseconds between steps.
 */
StepperMotor.prototype.setStepInterval = function(millis, nanoseconds) {};

/**
 * In a derived class, rotate the specified revolutions.
 * @param  {Number} revolutions The number of revolutions to rotate.
 */
StepperMotor.prototype.rotate = function(revolutions) {};

/**
 * In a derived class, step the motor the specified steps.
 * @param  {Number} steps The number of steps to rotate.
 * @throws {ObjectDisposedException} if this instance has been disposed.
 */
StepperMotor.prototype.step = function(steps) {};

/**
 * The name of the motor rotation start event.
 * @type {String}
 * @const
 */
StepperMotor.EVENT_ROTATION_STARTED = "stepperMotorRotationStarted";

/**
 * The name of the motor rotation stop event.
 * @type {String}
 * @const
 */
StepperMotor.EVENT_ROTATION_STOPPED = "stepperMotorRotationStopped";

module.exports = StepperMotor;
