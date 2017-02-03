"use strict";

//
//  LightStateChangeEvent.js
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
 * @classdesc The event that gets raised when a light changes state.
 * @event
 */
class LightStateChangeEvent {
  /**
   * Initializes a new instance of the jsrpi.Components.Lights.LightStateChangeEvent
   * class with the flag indicating whether or not the light is on.
   * @param {Boolean} isOn Set true if the light is on.
   * @constructor
   */
  constructor(isOn) {
    this._isOn = isOn || false;
  }

  /**
   * Gets a value indicating whether this light is on.
   * @property {Boolean} isOn - true if the light is on; Otherwise, false.
   * @readonly
   */
  get isOn() {
    return this._isOn;
  }
}

module.exports = LightStateChangeEvent;
