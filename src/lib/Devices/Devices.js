"use strict";
//
//  Devices.js
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
 * @fileOverview Contains classes, interfaces, etc for device abstractions.
 *
 * @module Devices
 * @namespace jsrpi.Devices
 */

module.exports = {
  Device : require('./Device.js'),
  DeviceBase : require('./DeviceBase.js'),
  Access : require('./Access/Access.js'),
  Fireplace : require('./FirePlace/FirePlace.js'),
  Garage : require('./Garage/Garage.js'),
  Gate : require('./Gate/Gate.js'),
  PiBrella : require('./PiBrella/PiBrella.js'),
  PiCamera : require('./PiCamera/PiCamera.js'),
  PiFace : require('./PiFace/PiFace.js'),
  RCSwitch : require('./RCSwitch/RCSwitch.js'),
  Sprinkler : require('./Sprinkler/Sprinkler.js')
};
