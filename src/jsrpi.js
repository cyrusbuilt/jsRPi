"use strict";
//
//  jsrpi.js
//  Version 0.1.0 ALPHA
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
 * @fileOverview jsRPi Raspberry Pi Framework for NodeJS.
 * @module jsrpi
 */

var JSRPI_FRAMEWORK_VER = '0.1.0';

module.exports = {
  getFrameworkVersion : function() { return JSRPI_FRAMEWORK_VER; },
  'argumentNullException' : require('./lib/ArgumentNullException.js'),
  'bcm2835pwmClockDivider' : require('./lib/BCM2835PWMClockDivider.js'),
  'bitset' : require('./lib/BitSet.js'),
  'boardRevision' : require('./lib/BoardRevision.js'),
  'execUtils' : require('./lib/ExecUtils.js'),
  'illegalArgumentException' : require('./lib/IllegalArgumentException.js'),
  'invalidOperationException' : require('./lib/InvalidOperationException.js'),
  'notImplementedException' : require('./lib/NotImplementedException.js'),
  'objectDisposedException' : require('./lib/ObjectDisposedException.js'),
  'size' : require('./lib/Size.js'),
  'stringUtils' : require('./lib/StringUtils.js'),
  'sensors' : require('./lib/Sensors/Sensors.js'),
  'piSystem' : require('./lib/PiSystem/PiSystem.js'),
  'led' : require('./lib/LED/LED.js'),
  'lcd' : require('./lib/LCD/LCD.js'),
  'io' : require('./lib/IO/IO.js'),
  'components' : require('./lib/Components/Components.js'),
  'devices' : require('./lib/Devices/Devices.js')
};
