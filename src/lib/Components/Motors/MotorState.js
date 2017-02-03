"use strict";

//
//  MotorState.js
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
 * The state of the motor.
 * @enum {Number}
 */
const MotorState = {
  /**
   * The motor is stopped.
   * @type {Number}
   */
  Stop : 0,

  /**
   * The motor is moving in the forward direction.
   * @type {Number}
   */
  Forward : 1,

  /**
   * The motor is moving in the reverse direction.
   * @type {Number}
   */
  Reverse : -1
};

module.exports = MotorState;
