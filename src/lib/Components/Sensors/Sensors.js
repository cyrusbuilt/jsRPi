"use strict";
//
//  Sensors.js
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

/**
 * @fileOverview Contains classes, interfaces, etc for sensor abstraction
 * components.
 *
 * @module Sensors
 */

module.exports = {
  'sensor' : require('./Sensor.js'),
  'sensorState' : require('./SensorState.js'),
  'sensorStateChangeEvent' : require('./SensorStateChangeEvent.js'),
  'motionDetectedEvent' : require('./MotionDetectedEvent.js'),
  'MotionSensor' : require('./MotionSensor.js'),
  'sensorBase' : require('./SensorBase.js'),
  'sensorComponent' : require('./SensorComponent.js'),
  'motionSensorBase' : require('./MotionSensorBase.js'),
  'motionSensorComponent' : require('./MotionSensorComponent.js')
};
