"use strict";

//
//  Motor.js
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

const Component = require('../Component.js');
const MotorState = require('./MotorState.js');

const STATE_CHANGED = "motorStateChanged";
const STOPPED = "motorStopped";
const FORWARD = "motorForward";
const REVERSE = "motorReverse";

/**
 * A motor abstraction interface.
 * @interface
 * @extends {Component}
 */
class Motor extends Component {
  /**
   * Initializes a new instance of the jsrpi.Components.Motors.Motor interface.
   */
  constructor() {
    super();
  }

  /**
   * In a derived class, fires the motor state change event.
   * @param  {MotorStateChangeEvent} stateChangeEvent The event info object.
   */
  onMotorStateChange(stateChangeEvent) {}

  /**
   * In a derived class, gets or sets the state of the motor.
   * @property {MotorState} state - The motor state.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  get state() { return MotorState.Stop; }

  set state(s) {}

  /**
   * In a derived class, checks to see if the motor is stopped.
   * @property {Boolean} isStopped - true if stopped; Otherwise, false.
   * @readonly
   */
  get isStopped() { return false; }

  /**
   * In a derived class, tells the motor to move forward for the specified amount
   * of time.
   * @param  {Number} millis The number of milliseconds to continue moving forward
   * for. If zero, null, or undefined, then moves forward continuously until stopped.
   */
  forward(millis) {}

  /**
   * In a derived class, tells the motor to move in reverse for the specified
   * amount of time.
   * @param  {Number} millis The number of milliseconds to continue moving in
   * reverse for. If zero, null, or undefined, then moves in reverse continuously
   * until stopped.
   */
  reverse(millis) {}

  /**
   * In a derived class, stops the motor's movement.
   */
  stop() {}

  /**
   * In a derived class, determines whether the motor's current state is the
   * specified state.
   * @param  {MotorState} state The state to check for.
   * @return {Boolean}       true if the motor is in the specified state;
   * Otherwise, false.
   */
  isState(state) { return false; }

  /**
   * The name of the motor state change event.
   * @type {String}
   * @const
   */
  static get EVENT_STATE_CHANGED() { return STATE_CHANGED; }

  /**
   * The name of the motor stopped event.
   * @type {String}
   * @const
   */
  static get EVENT_STOPPED() { return STOPPED; }

  /**
   * The name of the motor forward movement event.
   * @type {String}
   * @const
   */
  static get EVENT_FORWARD() { return FORWARD; }

  /**
   * The name of the motor reverse movement event.
   * @type {String}
   * @const
   */
  static get EVENT_REVERSE() { return REVERSE; }
}

module.exports = Motor;
