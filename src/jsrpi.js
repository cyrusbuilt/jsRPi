"use strict";
//
//  jsrpi.js
//  Version 0.2.3 ALPHA
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
 * @namespace jsrpi
 * @module jsrpi
 */

const JSRPI_FRAMEWORK_VER = '0.2.3';

module.exports = {
  /**
   * Gets the framework version.
   * @return {String} The framework version string.
   */
  getFrameworkVersion: function() { return JSRPI_FRAMEWORK_VER; },
  ArgumentNullException: require('./lib/ArgumentNullException.js'),
  BCM2835PWMClockDivider: require('./lib/BCM2835PWMClockDivider.js'),
  BitSet: require('./lib/BitSet.js'),
  BoardRevision: require('./lib/BoardRevision.js'),
  ExecUtils: require('./lib/ExecUtils.js'),
  IllegalArgumentException: require('./lib/IllegalArgumentException.js'),
  InvalidOperationException: require('./lib/InvalidOperationException.js'),
  NotImplementedException: require('./lib/NotImplementedException.js'),
  ObjectDisposedException: require('./lib/ObjectDisposedException.js'),
  Size: require('./lib/Size.js'),
  StringUtils: require('./lib/StringUtils.js'),
  Sensors: require('./lib/Sensors/Sensors.js'),
  PiSystem: require('./lib/PiSystem/PiSystem.js'),
  LED: require('./lib/LED/LED.js'),
  LCD: require('./lib/LCD/LCD.js'),
  IO: require('./lib/IO/IO.js'),
  Components: require('./lib/Components/Components.js'),
  Devices: require('./lib/Devices/Devices.js')
};
