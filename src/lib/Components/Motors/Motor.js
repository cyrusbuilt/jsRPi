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

var inherits = require('util').inherits;
var Component = require('../Component.js');
var MotorState = require('./MotorState.js');

/**
 * A motor abstraction interface.
 * @interface
 * @extends {Component}
 */
function Motor() {
  Component.call(this);
}

Motor.prototype.constructor = Motor;
inherits(Motor, Component);

/**
 * In a derived class, fires the motor state change event.
 * @param  {MotorStateChangeEvent} stateChangeEvent The event info object.
 */
Motor.prototype.onMotorStateChange = function(stateChangeEvent) {};

/**
 * In a derived class, gets the state of the motor.
 * @return {MotorState} The motor state.
 */
Motor.prototype.getState = function() { return MotorState.Stop; };

/**
 * In a derived class, sets the state of the motor.
 * @param  {MotorState} state The state to set the motor to.
 * @throws {ObjectDisposedException} if this instance has been disposed.
 */
Motor.prototype.setState = function(state) {};

/**
 * In a derived class, checks to see if the motor is stopped.
 * @return {Boolean} true if stopped; Otherwise, false.
 */
Motor.prototype.isStopped = function() { return false; };

/**
 * In a derived class, tells the motor to move forward for the specified amount
 * of time.
 * @param  {Number} millis The number of milliseconds to continue moving forward
 * for. If zero, null, or undefined, then moves forward continuously until stopped.
 */
Motor.prototype.forward = function(millis) {};

/**
 * In a derived class, tells the motor to move in reverse for the specified
 * amount of time.
 * @param  {Number} millis The number of milliseconds to continue moving in
 * reverse for. If zero, null, or undefined, then moves in reverse continuously
 * until stopped.
 */
Motor.prototype.reverse = function(millis) {};

/**
 * In a derived class, stops the motor's movement.
 */
Motor.prototype.stop = function() {};

/**
 * In a derived class, determines whether the motor's current state is the
 * specified state.
 * @param  {MotorState} state The state to check for.
 * @return {Boolean}       true if the motor is in the specified state;
 * Otherwise, false.
 */
Motor.prototype.isState = function(state) { return false; };

/**
 * The name of the motor state change event.
 * @type {String}
 * @const
 */
Motor.EVENT_STATE_CHANGED = "motorStateChanged";

/**
 * The name of the motor stopped event.
 * @type {String}
 * @const
 */
Motor.EVENT_STOPPED = "motorStopped";

/**
 * The name of the motor forward movement event.
 * @type {String}
 * @const
 */
Motor.EVENT_FORWARD = "motorForward";

/**
 * The name of the motor reverse movement event.
 * @type {String}
 * @const
 */
Motor.EVENT_REVERSE = "motorReverse";

module.exports = Motor;
