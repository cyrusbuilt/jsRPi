"use strict";
//
//  MCPCommand.js
//
//  Author:
//       Chris Brunner <cyrusbuilt at gmail dot com>
//
//  Copyright (c) 2017 CyrusBuilt
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
 * MCP45XX and MCP46XX commands.
 * @enum {Number}
 */
const MCPCommand = {
    /**
     * Writes to the device.
     * @type {Number}
     */
    WRITE: (0x00 << 2),

    /**
     * Increase the resistance.
     * @type {Number}
     */
    INCREASE: (0x01 << 2),

    /**
     * Decrease the resistance.
     * @type {Number}
     */
    DECREASE: (0x02 << 2),

    /**
     * Reads the current value.
     * @type {Number}
     */
    READ: (0x03 << 2)
};

module.exports = MCPCommand;