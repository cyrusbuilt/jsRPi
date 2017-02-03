"use strict";

//
//  DisplayOnOffControl.js
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
 * Display on/off controls.
 * @enum {Number}
 */
const DisplayOnOffControl = {
  /**
   * Turn the display on.
   * @type {Number}
   */
  DisplayOn : 0x04,

  /**
   * Turn the display off.
   * @type {Number}
   */
  DisplayOff : 0x00,

  /**
   * Turn the cursor on.
   * @type {Number}
   */
  CursorOn : 0x02,

  /**
   * Turn the cursor off.
   * @type {Number}
   */
  CursorOff : 0x00,

  /**
   * Turn the cursor blink on.
   * @type {Number}
   */
  BlinkOn : 0x01,

  /**
   * Turn the cursor blink off.
   * @type {Number}
   */
  BlinkOff : 0x00
};

module.exports = DisplayOnOffControl;
