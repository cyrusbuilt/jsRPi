"use strict";

//
//  LcdCommands.js
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
 * Flags for LCD commands.
 * @enum {Number}
 */
var LcdCommands = {
  /**
   * Clears the display.
   * @type {Number}
   */
  ClearDisplay : 0x01,

  /**
   * Return cursor to home position.
   * @type {Number}
   */
  ReturnHome : 0x02,

  /**
   * Set entry mode.
   * @type {Number}
   */
  EntryModeSet : 0x04,

  /**
   * Display control.
   * @type {Number}
   */
  DisplayControl : 0x08,

  /**
   * Shift the cursor.
   * @type {Number}
   */
  CursorShift : 0x10,

  /**
   * Set function.
   * @type {Number}
   */
  FunctionSet : 0x20,

  /**
   * Set CG RAM address.
   * @type {Number}
   */
  SetCgRamAddr : 0x40,

  /**
   * Set DD RAM address.
   * @type {Number}
   */
  SetDdRamAddr : 0x80
};

module.exports = LcdCommands;
