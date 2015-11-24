"use strict";

//
//  PowerStateChangeEvent.js
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

var util = require('util');
var PowerState = require('./PowerState.js');

/**
 * @classdesc The event that gets raised when a power control device changes state.
 * @param {PowerState} oldState The previous state of the device.
 * @param {PowerState} newState The new state of the device.
 * @constructor
 * @event
 */
function PowerStateChangeEvent(oldState, newState) {
  var _oldState = oldState;
  if (util.isNullOrUndefined(_oldState)) {
    _oldState = PowerState.Unknown;
  }

  var _newState = newState;
  if (util.isNullOrUndefined(_newState)) {
    _newState = PowerState.Unknown;
  }

  /**
   * Gets the old state.
   * @return {PowerState} The old state.
   */
  this.getOldState = function() {
    return _oldState;
  };

  /**
   * Gets the new state.
   * @return {PowerState} The new state.
   */
  this.getNewState = function() {
    return _newState;
  };
}

PowerStateChangeEvent.prototype.constructor = PowerStateChangeEvent;
module.exports = PowerStateChangeEvent;
