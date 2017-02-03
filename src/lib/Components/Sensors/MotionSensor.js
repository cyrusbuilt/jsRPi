"use strict";
//
//  MotionSensor.js
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

const MOTION_STATE_CHANGED = "motionStateChanged";

/**
 * A motion sensor abstraction component interface.
 * @interface
 * @extends {Component}
 */
class MotionSensor extends Component {
  /**
   * Initializes a new instance of the jsrpi.Components.Sensors.MotionSensor
   * interface.
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * In a derived class, fires the motion state changed event.
   * @param {MotionDetectedEvent} motionEvent The motion detected event object.
   */
  onMotionStateChanged(motionEvent) {}

  /**
   * In a derived class, gets the timestamp of the last time motion was detected.
   * @property {Date} lastMotionTimestamp - The timestamp of when motion was
   * detected.
   * @readonly
   */
  get lastMotionTimestamp() { return null; }

  /**
   * In a derived class, the last inactivity timestamp.
   * @property {Date} lastInactivityTimestamp - The timestamp of the last time
   * the sensor went idle.
   * @readonly
   */
  get lastInactivityTimestamp() { return null; }

  /**
   * In a derived class, checks to see if motion was detected.
   * @property {Boolean} isMotionDetected - true if motion was detected;
   * Otherwise, false.
   * @readonly
   */
  get isMotionDetected() { return false; }

  /**
   * The name of the motion state change event.
   * @type {String}
   * @const
   */
  static get EVENT_MOTION_STATE_CHANGED() { return MOTION_STATE_CHANGED; }
}

module.exports = MotionSensor;
