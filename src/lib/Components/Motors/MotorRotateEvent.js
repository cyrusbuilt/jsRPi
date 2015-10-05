"use strict";

//
//  MotorRotateEvent.js
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
 * The event that gets raised when a motor rotation occurs.
 * @param {Number} steps The steps being taken. 0 steps = stopped. Greater than
 * 0 = the number of steps forward. Less than 0 = the number of steps moving
 * backward.
 * @constructor
 * @event
 */
function MotorRotateEvent(steps) {
  var _steps = steps || 0;

  /**
   * Gets the steps.
   * @return {Number} The number of steps.
   */
  this.getSteps = function() {
    return _steps;
  };
}

MotorRotateEvent.prototype.constructor = MotorRotateEvent;
module.exports = MotorRotateEvent;
