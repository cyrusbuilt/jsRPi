"use strict";
//
//  MotionDetectedEvent.js
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

/**
 * @classdesc The event that gets raised when motion is detected.
 * @event
 */
class MotionDetectedEvent {
  /**
   * Initializes a new instance of the jsrpi.Components.Sensors.MotionDetectedEvent
   * class with the flag indicating motion and a timestamp when the motion was
   * detected.
   * @param {Boolean} motion Set true if motion was detected.
   * @param {Date} timestamp The timestamp of when the state changed.
   * @constructor
   */
  constructor(motion, timestamp) {
    this._motionDetected = motion;
    if (util.isNullOrUndefined(this._motionDetected)) {
      this._motionDetected = false;
    }

    this._timestamp = timestamp;
    if (util.isNullOrUndefined(this._timestamp)) {
      this._timestamp = new Date();
    }
  }

  /**
   * Gets whether or not motion was detected.
   * @property {Boolean} isMotionDetected - true if motion detected; Otherwise,
   * false.
   * @readonly
   */
  get isMotionDetected() {
    return this._motionDetected;
  }

  /**
   * Gets the timestamp of when the state changed.
   * @property {Date} timestamp - The timestamp of when the event occurred.
   * @readonly
   */
  get timestamp() {
    return this._timestamp;
  }
}

module.exports = MotionDetectedEvent;
