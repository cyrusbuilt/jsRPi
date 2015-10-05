"use strict";

//
//  BaudRates.js
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
 * Baud rates.
 * @enum {Number}
 */
var BaudRates = {
  /**
   * 1200 BAUD.
   * @type {Number}
   */
  Baud1200 : 1200,

  /**
   * 2400 BAUD.
   * @type {Number}
   */
  Baud2400 : 2400,

  /**
   * 4800 BAUD.
   * @type {Number}
   */
  Baud4800 : 4800,

  /**
   * 9600 BAUD.
   * @type {Number}
   */
  Baud9600 : 9600,

  /**
   * 19200 BAUD.
   * @type {Number}
   */
  Baud19200 : 19200,

  /**
   * 38400 BAUD.
   * @type {Number}
   */
  Baud38400 : 38400,

  /**
   * 57600 BAUD.
   * @type {Number}
   */
  Baud57600 : 57600,

  /**
   * 115200 BAUD.
   * @type {Number}
   */
  Baud115200 : 115200,

  /**
   * 230400 BAUD.
   * @type {Number}
   */
  Baud230400 : 230400
};

module.exports = BaudRates;
