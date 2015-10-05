"use strict";

//
//  SwitchStateChangeEvent.js
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

var SwitchState = require('./SwitchState.js');

/**
 * The event that gets raised when a switch changes state.
 * @param {SwitchState} oldState The previous state of the switch.
 * @param {SwitchState} newState The new state of the switch.
 * @constructor
 * @event
 */
function SwitchStateChangeEvent(oldState, newState) {
  var _oldState = oldState || SwitchState.Off;
  var _newState = newState || SwitchState.Off;

  /**
   * Gets the old state.
   * @return {SwitchState} The previous switch state.
   */
  this.getOldState = function() {
    return _oldState;
  };

  /**
   * Gets the new state.
   * @return {SwitchState} The current switch state.
   */
  this.getNewState = function() {
    return _newState;
  };
}

module.exports = SwitchStateChangeEvent;
