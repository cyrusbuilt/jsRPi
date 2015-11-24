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

var util = require('util');
var SensorState = require('./SensorState.js');
var Sensor = require('./Sensor.js');

/**
 * @classdesc The event that gets raised when a sensor changes state.
 * @param {Sensor} sensor   The sensor that changed state.
 * @param {SensorState} oldState The previous state.
 * @param {SensorState} newState The current state.
 * @constructor
 * @event
 */
function SensorStateChangeEvent(sensor, oldState, newState) {
  var _sensor = sensor;
  var _oldState = oldState;
  if (util.isNullOrUndefined(_oldState)) {
    _oldState = SensorState.Open;
  }

  var _newState = newState;
  if (util.isNullOrUndefined(_newState)) {
    _newState = SensorState.Open;
  }

  /**
   * Gets the sensor that changed state.
   * @return {Sensor} The sensor that changed state.
   */
  this.getSensor = function() {
    return _sensor;
  };

  /**
   * Gets the previous state of the sensor.
   * @return {SensorState} The previous sensor state.
   */
  this.getOldState = function() {
    return _oldState;
  };

  /**
   * Gets the current sensor state.
   * @return {SensorState} The current sensor state.
   */
  this.getNewState = function() {
    return _newState;
  };
}

SensorStateChangeEvent.prototype.constructor = SensorStateChangeEvent;
module.exports = SensorStateChangeEvent;
