"use strict";

//
//  PowerUtils.js
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
 * @fileOverview Provides utility methods for working with power components.
 *
 * @module PowerUtils
 * @requires PowerState
 */

const PowerState = require('./PowerState.js');

/**
 * Gets the name of the specified power state.
 * @param  {PowerState} state The state to get the name of.
 * @return {String}       The name of the state or an empty string if invalid or
 * not provided.
 */
const getPowerStateName = function(state) {
  if ((state == null) || (state === undefined)) {
    return "";
  }

  let name = "";
  switch (state) {
    case PowerState.On:
      name = "On";
      break;
    case PowerState.Off:
      name = "Off";
      break;
    case PowerState.Unknown:
      name = "Unknown";
      break;
    default:
      break;
  }
  return name;
};

module.exports.getPowerStateName = getPowerStateName;
