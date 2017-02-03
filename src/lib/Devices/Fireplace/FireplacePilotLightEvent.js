"use strict";
//
//  FireplacePilotLightEvent.js
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
 * @classdesc The event that gets raised when a pilot light event occurs.
 * @event
 */
class FireplacePilotLightEvent {
  /**
   * Initializes a new instance of the jsrpi.Devices.FireplacePilotLightEvent
   * class with a flag to indicate whether or not the pilot light is lit.
   * @param {Boolean} lightIsOn Set true if the pilot light is lit.
   * @constructor
   */
  constructor(lightIsOn) {
    this._isLightOn = lightIsOn || false;
  }

  /**
   * Gets a value indicating whether or not the pilot light is on.
   * @property {Boolean} lightIsOn - true if the light is on; Otherwise, false.
   * @readonly
   */
  get lightIsOn() {
    return this._isLightOn;
  }
}

module.exports = FireplacePilotLightEvent;
