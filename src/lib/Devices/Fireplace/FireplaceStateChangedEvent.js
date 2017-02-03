"use strict";
//
//  FireplaceStateChangedEvent.js
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
const FireplaceState = require('./FireplaceState.js');

/**
* @classdesc The event that gets raised when the fireplace changes state.
* @event
*/
class FireplaceStateChangedEvent {
  /**
   * Initializes a new instace of the jsrpi.Devices.Fireplace.FireplaceStateChangedEvent
   * class with the new and old states.
   * @param {FireplaceState} oldState The previous state.
   * @param {FireplaceState} newState The current state.
   * @constructor
   */
  constructor(oldState, newState) {
    this._oldState = oldState;
    if (util.isNullOrUndefined(this._oldState)) {
      this._oldState = FireplaceState.Off;
    }

    this._newState = newState;
    if (util.isNullOrUndefined(this._newState)) {
      this._newState = FireplaceState.Off;
    }
  }

  /**
  * Gets the previous state.
  * @property {FireplaceState} oldState - The previous fireplace state.
  * @readonly
  */
  get oldState() {
    return this._oldState;
  }

  /**
  * Gets the current state.
  * @property {FireplaceState} newState - The new (current) fireplace state.
  * @readonly
  */
  get newState() {
    return this._newState;
  }
}

module.exports = FireplaceStateChangedEvent;
