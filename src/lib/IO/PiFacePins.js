"use strict";

//
//  PiFacePins.js
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
 * PiFace I/O pins.
 * @enum {Number}
 */
const PiFacePins = {
  /**
   * Output pin 1 (relay 1).
   * @type {Number}
   */
  Output00 : { value: 1, name: "Output 1 (RELAY 1)" },

  /**
   * Output pin 2 (relay 2).
   * @type {Number}
   */
  Output01 : { value: 2, name: "Output 2 (RELAY 2)" },

  /**
   * Output pin 3.
   * @type {Number}
   */
  Output02 : { value: 4, name: "Output 3" },

  /**
   * Output pin 4.
   * @type {Number}
   */
  Output03 : { value: 8, name: "Output 4" },

  /**
   * Output pin 5.
   * @type {Number}
   */
  Output04 : { value: 16, name: "Output 5" },

  /**
   * Output pin 6.
   * @type {Number}
   */
  Output05 : { value: 32, name: "Output 6" },

  /**
   * Output pin 7.
   * @type {Number}
   */
  Output06 : { value: 64, name: "Output 7" },

  /**
   * Output pin 8.
   * @type {Number}
   */
  Output07 : { value: 128, name: "Output 8" },

  /**
   * Input pin 1 (switch 1).
   * @type {Number}
   */
  Input00 : { value: 1001, name: "Input 1 (SWITCH 1)" },

  /**
   * Input pin 2 (switch 2).
   * @type {Number}
   */
  Input01 : { value: 1002, name: "Input 2 (SWITCH 2)" },

  /**
   * Input pin 3 (switch 3).
   * @type {Number}
   */
  Input02 : { value: 1004, name: "Input 3 (SWITCH 3)" },

  /**
   * Input pin 4 (switch 4).
   * @type {Number}
   */
  Input03 : { value: 1008, name: "Input 4 (SWITCH 4)" },

  /**
   * Input pin 5.
   * @type {Number}
   */
  Input04 : { value: 1016, name: "Input 5" },

  /**
   * Input pin 6.
   * @type {Number}
   */
  Input05 : { value: 1032, name: "Input 6" },

  /**
   * Input pin 7.
   * @type {Number}
   */
  Input06 : { value: 1064, name: "Input 7" },

  /**
   * Input pin 8.
   * @type {Number}
   */
  Input07 : { value: 1128, name: "Input 8" },

  /**
   * No pin assignment.
   * @type {Number}
   */
  None : { value: 0, name: "None" }
};

module.exports = PiFacePins;
