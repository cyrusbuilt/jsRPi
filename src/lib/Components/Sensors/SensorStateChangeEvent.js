"use strict";
//
//  SensorStateChangeEvent.js
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
const SensorState = require('./SensorState.js');
const Sensor = require('./Sensor.js');

/**
 * @classdesc The event that gets raised when a sensor changes state.
 * @event
 */
class SensorStateChangeEvent {
  /**
   * Initializes a new instance of the jsrpi.Components.Sensors.SensorStateChangeEvent
   * class with the sensor that changed states as well as the new and old states.
   * @param {Sensor} sensor   The sensor that changed state.
   * @param {SensorState} oldState The previous state.
   * @param {SensorState} newState The current state.
   * @constructor
   */
  constructor(sensor, oldState, newState) {
    this._sensor = sensor;
    this._oldState = oldState;
    if (util.isNullOrUndefined(this._oldState)) {
      this._oldState = SensorState.Open;
    }

    this._newState = newState;
    if (util.isNullOrUndefined(this._newState)) {
      this._newState = SensorState.Open;
    }
  }

  /**
   * Gets the sensor that changed state.
   * @property {Sensor} sensor - The sensor.
   * @readonly
   */
  get sensor() {
    return this._sensor;
  }

  /**
   * Gets the previous state of the sensor.
   * @property {SensorState} oldState - The previous state.
   * @readonly
   */
  get oldState() {
    return this._oldState;
  }

  /**
   * Gets the current sensor state.
   * @property {SensorState} newState - The new (current) state.
   * @readonly
   */
  get newState() {
    return this._newState;
  }
}

module.exports = SensorStateChangeEvent;
