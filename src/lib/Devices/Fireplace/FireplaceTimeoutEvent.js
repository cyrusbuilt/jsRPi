"use strict";
//
//  FireplaceTimeoutEvent.js
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
 * @classdesc The event that gets raised when a fireplace timeout occurs.
 * @event
 */
class FireplaceTimeoutEvent {
  /**
   * Initializes a new instance of the jsrpi.Devices.Fireplace.FireplaceTimeoutEvent
   * class with a flag to indicate whether or not a timeout occurred.
   * @param {Boolean} handled Set true if handled.
   * @constructor
   */
  constructor(handled) {
    this._isHandled = handled || false;
  }

  /**
   * Gets a value indicating whether this event was handled.
   * @property {Boolean} isHandled - true if handled; Otherwise, false.
   * @readonly
   */
  get isHandled() {
    return this._isHandled;
  }
}

module.exports = FireplaceTimeoutEvent;
