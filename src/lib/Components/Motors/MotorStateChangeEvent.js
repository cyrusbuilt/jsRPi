"use strict";

//
//  MotorStateChangeEvent.js
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
const MotorState = require('./MotorState.js');

/**
 * @classdesc The event that gets raised when a motor changes state.
 * @event
 */
class MotorStateChangeEvent {
  /**
   * Initializes a new instance of the jsrpi.Components.Motors.MotorStateChangeEvent
   * class with the old and new state of the motor.
   * @param {MotorState} oldState The state the motor was in prior to the change.
   * @param {MotorState} newState The current state of the motor since the change
   * occurred.
   * @constructor
   */
  constructor(oldState, newState) {
    this._oldState = oldState;
    if (util.isNullOrUndefined(this._oldState)) {
      this._oldState = MotorState.Stop;
    }

    this._newState = newState;
    if (util.isNullOrUndefined(this._newState)) {
      this._newState = MotorState.Stop;
    }
  }

  /**
   * Gets the state the motor was in prior to the change.
   * @property {MotorState} oldState - The previous state.
   * @readonly
   */
  get oldState() {
    return this._oldState;
  }

  /**
   * Gets the new (current) state.
   * @property {MotorState} newState - The new (current) state.
   * @readonly
   */
  get newState() {
    return this._newState;
  }
}

module.exports = MotorStateChangeEvent;
