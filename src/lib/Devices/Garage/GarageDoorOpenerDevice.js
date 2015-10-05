"use strict";
//
//  GarageDoorOpenerDevice.js
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
var GarageDoorOpenerBase = require('./GarageDoorOpenerBase.js');

/**
 * @classdesc A device that is an abstraction of a garage door opener. This is
 * an implementation of GarageDoorOpenerBase.
 * @param {Relay} relay                The relay that controls the door.
 * @param {Sensor} doorSensor          The sensor that indicates the state of
 * the door.
 * @param {SensorState} doorSensorOpenState The sensor state that indicates the
 * door is open.
 * @param {Switch} lok                 The switch that controls the lock.
 * @constructor
 * @extends {garageDoorOpenerBase}
 */
function GarageDoorOpenerDevice(relay, doorSensor, doorSensorOpenState, lok) {
  GarageDoorOpenerBase.call(this, relay, doorSensor, doorSensorOpenState, lok);
}

GarageDoorOpenerDevice.prototype.constructor = GarageDoorOpenerDevice;
inherits(GarageDoorOpenerDevice, GarageDoorOpenerBase);

module.exports = GarageDoorOpenerDevice;
