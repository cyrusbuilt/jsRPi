"use strict";

//
//  LightLevelChangeEvent.js
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
 * The event that gets raised when a light level (brightness) change occurs.
 * @param {Number} level The brightness level.
 * @constructor
 * @event
 */
function LightLevelChangeEvent(level) {
  var _level = level || 0;

  /**
   * Gets the brightness level.
   * @return {Number} The brightness level.
   */
  this.getLevel = function() {
    return _level;
  };
}

LightLevelChangeEvent.prototype.constructor = LightLevelChangeEvent;
module.exports = LightLevelChangeEvent;
