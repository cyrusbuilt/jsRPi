"use strict";

//
//  PinState.js
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
//


/**
 * The state of a given pin.
 * @enum {Number}
 */
var PinState = {
  /**
   * The pin is high (on) which means it is outputting > 3.3V (typically 5V).
   * @type {Number}
   */
  High : 1,

  /**
   * The pin is low, which means it is outputting 0v (or at least < 3.3V).
   * @type {Number}
   */
  Low : 0
};

module.exports = PinState;
