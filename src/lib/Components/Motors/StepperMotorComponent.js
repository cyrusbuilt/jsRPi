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

const util = require('util');
const CoreUtils = require('../../PiSystem/CoreUtils.js');
const StepperMotorBase = require('./StepperMotorBase.js');
const MotorState = require('./MotorState.js');
const PinState = require('../../IO/PinState.js');
const ArgumentNullException = require('../../ArgumentNullException.js');
const ObjectDisposedException = require('../../ObjectDisposedException.js');
const MotorStateChangeEvent = require('./MotorStateChangeEvent.js');
const MotorRotateEvent = require('./MotorRotateEvent.js');

/**
 * @classdesc A component that is an abstraction of a stepper motor.
 * @extends {StepperMotorBase}
 */
class StepperMotorComponent extends StepperMotorBase {
  /**
   * Initializes a new instance of the jsrpi.Components.Motors.StepperMotorComponent
   * class with the pins used to control the stepper motor.
   * @param {Array} pins The output pins for each controller in the stepper motor.
   * This should be an array of Gpio (or derivative) objects.
   * @throws {ArgumentNullException} if pins is null, undefined, or zero-length.
   * @constructor
   */
  constructor(pins) {
    super();

    if ((util.isNullOrUndefined(pins)) || (pins.length === 0)) {
      throw new ArgumentNullException("'pins' cannot be null, undefined, or an empty array.");
    }

    this._sequenceIndex = 0;
    this._controlTimer = null;
    this._pins = pins;
    for (let pin of this._pins) {
      pin.provision();
    }
  }

  /**
   * Stops the continuous movement timer.
   * @private
   */
  _killTimer() {
    if (!util.isNullOrUndefined(this._controlTimer)) {
      clearInterval(this._controlTimer);
      this._controlTimer = null;
    }
  }

  /**
   * Steps the the motor forward or backward.
   * @param  {Boolean} forward Set true if moving forward.
   * @private
   */
  _doStep(forward) {
    if (forward) {
      this._sequenceIndex++;
    }
    else {
      this._sequenceIndex--;
    }

    // Check sequence bounds; rollover if needed.
    let seq = this.stepSequence;
    if (this._sequenceIndex >= seq.length) {
      this._sequenceIndex = 0;
    }
    else if (this._sequenceIndex < 0) {
      this._sequenceIndex = (seq.length - 1);
    }

    // Start cycling through GPIO pins to move the motor forward or reverse.
    let nib = 0;
    for (let i = 0; i < this._pins.length; i++) {
      nib = Math.pow(2, i);
      if ((seq[this._sequenceIndex] & parseInt(nib.toString())) > 0) {
        this._pins[i].write(PinState.High);
      }
      else {
        this._pins[i].write(PinState.Low);
      }
    }

    let millis = this.stepIntervalMillis;
    let nanos = this.stepIntervalNanos;
    CoreUtils.sleepMicroseconds((millis + (nanos * 1000000)) * 1000);
  }

  /**
   * Helper method for executing or ending movement.
   * @private
   */
  _asyncExecMovement() {
    if (super.state !== MotorState.Stop) {
      this._doStep(super.state === MotorState.Forward);
      return;
    }

    for (let pin of this._pins) {
      pin.write(PinState.Low);
    }

    this._killTimer();
  }

  /**
   * Asynchronously executes or ends movement based on motor state.
   * @private
   */
  _executeMovement() {
    if (this.state === MotorState.Stop) {
      for (let pin of this._pins) {
        pin.write(PinState.Low);
      }

      this._killTimer();
      return;
    }

    this._controlTimer = setInterval(() => { this._asyncExecMovement(); }, 10);
  }

  /**
   * Gets or sets the state of the motor.
   * @property {MotorState} state - The motor state.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @override
   */
  get state() {
    return super.state;
  }

  set state(s) {
    if (this.isDisposed) {
      throw new ObjectDisposedException('StepperMotorComponent');
    }

    let oldState = this.state;
    if (this.state !== s) {
      super.state = s;
      let evt = new MotorStateChangeEvent(oldState, s);
      this.onMotorStateChange(evt);
      this._executeMovement();
    }
  }

  /**
   * Stops the motor's movement.
   * @override
   */
  stop() {
    for (let pin of this._pins) {
      pin.write(PinState.Low);
    }
    super.stop();
  }

  /**
   * Step the motor the specified steps.
   * @param  {Number} steps The number of steps to rotate.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @override
   */
  step(steps) {
    if (this.isDisposed) {
      throw new ObjectDisposedException('StepperMotorComponent');
    }

    if (steps === 0) {
      this.state = MotorState.Stop;
      return;
    }

    // Perform step in positive or negative direction from current position.
    super.step(steps);
    let evt = new MotorRotateEvent(steps);
    this.onRotationStarted(evt);
    if (steps > 0) {
      for (let i = 0; i < steps; i++) {
        this._doStep(true);
      }
    }
    else {
      for (let j = steps; j < 0; j++) {
        this._doStep(false);
      }
    }

    // Stop movement.
    this.stop();
    this.onRotationStopped();
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
   * reverse for. If zero, null, or undefined, then moves in reverse continuously
   * until stopped.
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

  /**
   * Rotate the specified revolutions.
   * @param  {Number} revolutions The number of revolutions to rotate.
   * @override
   */
  rotate(revolutions) {
    let steps = Math.round(this.stepsPerRevolution * revolutions);
    let stepsActual = parseInt(steps.toString());
    this.onRotationStarted(new MotorRotateEvent(stepsActual));
    this.step(stepsActual);
    this.onRotationStopped();
  }

  /**
   * Releases all resources used by the GpioBase object.
   * @override
   */
  dispose() {
    if (this.isDisposed) {
      return;
    }

    this._killTimer();
    this.state = MotorState.Stop;
    this._sequenceIndex = 0;
    if ((!util.isNullOrUndefined(this._pins)) && (this._pins.length > 0)) {
      for (let pin of this._pins) {
        pin.write(PinState.Low);
        pin.dispose();
      }
      this._pins = undefined;
    }

    super.dispose();
  }

  /**
   * Converts the current instance to it's string representation. This method
   * simply returns the component name.
   * @return {String} The component name.
   * @override
   */
  toString() {
    return this.componentName;
  }
}

module.exports = StepperMotorComponent;
