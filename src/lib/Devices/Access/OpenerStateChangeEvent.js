"use strict";
//
//  OpenerStateChangeEvent.js
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

const util = require('util');
const OpenerState = require('./OpenerState.js');

/**
* @classdesc The event that gets raised when an opener device changes state.
* @event
*/
class OpenerStateChangeEvent {
  /**
   * Initializes a new instance of the of the jsrpi.Devices.Access.OpenerStateChangeEvent
   * class with the old and new states.
   * @param {OpenerState} oldState The previous state of the opener.
   * @param {OpenerState} newState The current state of the opener.
   * @constructor
   */
  constructor(oldState, newState) {
    this._oldState = oldState;
    if (util.isNullOrUndefined(this._oldState)) {
      this._oldState = OpenerState.Closed;
    }

    this._newState = newState;
    if (util.isNullOrUndefined(this._newState)) {
      this._newState = OpenerState.Closed;
    }
  }

  /**
  * Gets the previous state of the opener.
  * @property {OpenerState} oldState - The previous opener state.
  * @readonly
  */
  get oldState() {
    return this._oldState;
  }

  /**
  * Gets the current state of the opener.
  * @property {OpenerState} newState - The new (current) opener state.
  * @readonly
  */
  get newState() {
    return this._newState;
  }
}

module.exports = OpenerStateChangeEvent;
