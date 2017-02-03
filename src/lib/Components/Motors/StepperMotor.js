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

const Motor = require('./Motor.js');

const ROTATION_STARTED = "stepperMotorRotationStarted";
const ROTATION_STOPPED = "stepperMotorRotationStopped";

/**
 * A stepper motor abstraction interface.
 * @interface
 * @extends {Motor}
 */
class StepperMotor extends Motor {
  /**
   * Initializes a new instance of the jsrpi.Components.Motors.StepperMotor
   * interface.
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * In a derived class, fires the rotation start event.
   * @param  {MotorRotateEvent} rotateEvent The event object.
   */
  onRotationStarted(rotateEvent) {}

  /**
   * In a derived class, fires the rotation stopped event.
   */
  onRotationStopped() {}

  /**
   * In a derived class, gets or sets the number of steps per revolution.
   * @property {Number} stepsPerRevolution - The steps per revolution.
   */
  get stepsPerRevolution() { return 0; }

  set stepsPerRevolution(steps) {}

  /**
   * In a derived class, gets or sets an array of bytes representing the step
   * sequence.
   * @property {Array} stepSequence - The step sequence.
   */
  get stepSequence() { return []; }

  set stepSequence(seq) {}

  /**
   * In a derived class, sets the step interval.
   * @param  {Number} millis      The milliseconds between steps.
   * @param  {Number} nanoseconds The nanoseconds between steps.
   */
  setStepInterval(millis, nanoseconds) {}

  /**
   * In a derived class, rotate the specified revolutions.
   * @param  {Number} revolutions The number of revolutions to rotate.
   */
  rotate(revolutions) {}

  /**
   * In a derived class, step the motor the specified steps.
   * @param  {Number} steps The number of steps to rotate.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  step(steps) {}

  /**
   * The name of the motor rotation start event.
   * @type {String}
   * @const
   */
  static get EVENT_ROTATION_STARTED() { return ROTATION_STARTED; }

  /**
   * The name of the motor rotation stop event.
   * @type {String}
   * @const
   */
  static get EVENT_ROTATION_STOPPED() { return ROTATION_STOPPED; }
}

module.exports = StepperMotor;
