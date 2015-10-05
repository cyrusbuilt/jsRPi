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

var inherits = require('util').inherits;
var Component = require('../Component.js');

/**
 * A motion sensor abstraction component interface.
 * @interface
 * @extends {Component}
 */
function MotionSensor() {
  Component.call(this);
}

MotionSensor.prototype.constructor = MotionSensor;
inherits(MotionSensor, Component);

/**
 * In a derived class, fires the motion state changed event.
 * @param  {MotionDetectedEvent} motionEvent The motion detected event object.
 */
MotionSensor.prototype.onMotionStateChanged = function(motionEvent) {};

/**
 * In a derived class, gets the timestamp of the last time motion was detected.
 * @return {Date} The last motion timestamp.
 */
MotionSensor.prototype.getLastMotionTimestamp = function() {};

/**
 * In a derived class, the last inactivity timestamp.
 * @return {Date} The last inactivity timestamp.
 */
MotionSensor.prototype.getLastInactivityTimestamp = function() {};

/**
 * In a derived class, checks to see if motion was detected.
 * @return {Boolean} true if motion was detected; Otherwise, false.
 */
MotionSensor.prototype.isMotionDetected = function() { return false; };

/**
 * The name of the motion state change event.
 * @type {String}
 * @const
 */
MotionSensor.EVENT_MOTION_STATE_CHANGED = "motionStateChanged";

module.exports = MotionSensor;
