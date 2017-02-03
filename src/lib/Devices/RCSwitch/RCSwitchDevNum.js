"use strict";
//
//  RCSwitchDevNum.js
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
 * Possible switch device numbers.
 * @enum {Number}
 */
const RCSwitchDevNum = {
  /**
   * Device 1.
   * @type {Number}
   */
  Device1 : 1,

  /**
   * Device 2.
   * @type {Number}
   */
  Device2 : 2,

  /**
   * Device 3.
   * @type {Number}
   */
  Device3 : 3,

  /**
   * Device 4.
   * @type {Number}
   */
  Device4 : 4,

  /**
   * No device.
   * @type {Number}
   */
  None : 0
};

module.exports = RCSwitchDevNum;
