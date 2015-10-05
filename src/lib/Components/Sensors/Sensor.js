"use strict";
//
//  Sensor.js
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
var SensorState = require('./SensorState.js');

/**
 * A sensor abstraction component interface.
 * @interface
 * @extends {Component}
 */
function Sensor() {
  Component.call(this);
}

Sensor.prototype.constructor = Sensor;
inherits(Sensor, Component);

/**
 * In a derived class, fires the sensor state change event.
 * @param  {SensorStateChangeEvent} stateChangeEvent The state change event object.
 */
Sensor.prototype.onSensorStateChange = function(stateChangeEvent) {};

/**
 * In a derived class, gets a value indicating whether this sensor is open.
 * @return {Boolean} true if open; Otherwise, false.
 */
Sensor.prototype.isOpen = function() { return false; };

/**
 * In a derived class, gets a value indicating whether this sensor is closed.
 * @return {Boolean} true if closed; Otherwise, false.
 */
Sensor.prototype.isClosed = function() { return false; };

/**
 * In a derived class, gets the state of the sensor.
 * @return {SensorState} The state of the sensor.
 */
Sensor.prototype.getState = function() { return SensorState.Open; };

/**
 * In derived class, checks to see if the sensor is in the specified state.
 * @param  {SensorState} state The state to check.
 * @return {Boolean}       true if the sensor is in the specified state;
 * Otherwise, false.
 */
Sensor.prototype.isState = function(state) { return false; };

/**
 * The name of the state change event.
 * @type {String}
 * @const
 */
Sensor.EVENT_STATE_CHANGED = "sensorStateChanged";

module.exports = Sensor;
