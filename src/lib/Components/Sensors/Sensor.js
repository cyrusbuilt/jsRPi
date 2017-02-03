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

const Component = require('../Component.js');
const SensorState = require('./SensorState.js');

const STATE_CHANGED = "sensorStateChanged";

/**
 * A sensor abstraction component interface.
 * @interface
 * @extends {Component}
 */
class Sensor extends Component {
  /**
   * Initializes a new instance of the jsrpi.Components.Sensors.Sensor interface.
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * In a derived class, fires the sensor state change event.
   * @param  {SensorStateChangeEvent} stateChangeEvent The state change event object.
   */
  onSensorStateChange(stateChangeEvent) {}

  /**
   * In a derived class, gets a value indicating whether this sensor is open.
   * @property {Boolean} isOpen - true if open; Otherwise, false.
   * @readonly
   */
  get isOpen() { return false; }

  /**
   * In a derived class, gets a value indicating whether this sensor is closed.
   * @property {Boolean} isClosed - true if closed; Otherwise, false.
   * @readonly
   */
  get isClosed() { return false; }

  /**
   * In a derived class, gets the state of the sensor.
   * @property {SensorState} state - The sensor state.
   * @readonly
   */
  get state() { return SensorState.Open; }

  /**
   * In derived class, checks to see if the sensor is in the specified state.
   * @param  {SensorState} state The state to check.
   * @return {Boolean}       true if the sensor is in the specified state;
   * Otherwise, false.
   */
  isState(state) { return false; }

  /**
   * The name of the state change event.
   * @type {String}
   * @const
   */
  static get EVENT_STATE_CHANGED() { return STATE_CHANGED; }
}

module.exports = Sensor;
