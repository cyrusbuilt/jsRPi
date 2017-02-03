"use strict";

//
//  PinUtils.js
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
//

/**
 * @fileOverview Contains utility methods for working with pins.
 *
 * @module PinUtils
 * @requires util
 * @requires PinMode
 */

const util = require('util');
const PinMode = require("./PinMode.js");

/**
 * Converts the specified mode to it's equivalent name string.
 * @param  {PinMode} mode The mode to get the name of.
 * @return {String}       The mode name.
 */
const getPinModeName = function(mode) {
  if (util.isNullOrUndefined(mode)) {
    return "";
  }

  let result = "";
  switch (mode) {
    case PinMode.IN:
      result = "IN";
      break;
    case PinMode.OUT:
      result = "OUT";
      break;
    case PinMode.PWM:
      result = "PWM";
      break;
    case PinMode.CLOCK:
      result = "CLOCK";
      break;
    case PinMode.UP:
      result = "UP";
      break;
    case PinMode.DOWN:
      result = "DOWN";
      break;
    case PinMode.TRI:
      result = "TRI";
      break;
    default:
      break;
  }
  return result;
};

module.exports.getPinModeName = getPinModeName;
