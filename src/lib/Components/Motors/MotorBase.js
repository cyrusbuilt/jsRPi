"use strict";

//
//  MotorBase.js
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
var Motor = require('./Motor.js');
var MotorState = require('./MotorState.js');
var ComponentBase = require('../ComponentBase.js');
var EventEmitter = require('events').EventEmitter;
var MotorStateChangeEvent = require('./MotorStateChangeEvent.js');

/**
 * @classdesc Base class for motor abstraction components.
 * @constructor
 * @implements {Motor}
 * @extends {ComponentBase}
 * @extends {EventEmitter}
 */
function MotorBase() {
  Motor.call(this);
  ComponentBase.call(this);
  EventEmitter.call(this);
  var self = this;

  /**
   * Fires the motor state change event.
   * @param  {MotorStateChangeEvent} stateChangeEvent The event info object.
   * @override
   */
  this.onMotorStateChange = function(stateChangeEvent) {
    process.nextTick(function() {
      self.emit(Motor.EVENT_STATE_CHANGED, stateChangeEvent);
    });
  };

  /**
   * Determines whether the motor's current state is the specified state.
   * @param  {MotorState} state The state to check for.
   * @return {Boolean}       true if the motor is in the specified state;
   * Otherwise, false.
   * @override
   */
  this.isState = function(state) {
    return (self.getState() === state);
  };

  /**
   * Checks to see if the motor is stopped.
   * @return {Boolean} true if stopped; Otherwise, false.
   * @override
   */
  this.isStopped = function() {
    return self.isState(MotorState.Stop);
  };

  /**
   * Stops the motor's movement.
   * @override
   */
  this.stop = function() {
    if (self.getState() === MotorState.Stop) {
      return;
    }
    var oldState = self.getState();
    self.setState(MotorState.Stop);
    self.onMotorStateChange(new MotorStateChangeEvent(oldState, self.getState()));
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
    self.onMotorStateChange(new MotorStateChangeEvent(oldState, self.getState()));

    var ms = millis || 0;
    if (ms > 0) {
      setTimeout(self.stop(), ms);
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
    self.onMotorStateChange(new MotorStateChangeEvent(oldState, self.getState()));

    var ms = millis || 0;
    if (ms > 0) {
      setTimeout(self.stop(), ms);
    }
  };
}

MotorBase.prototype.constructor = MotorBase;
inherits(MotorBase, Motor);

module.exports = extend(true, MotorBase, ComponentBase, EventEmitter);
