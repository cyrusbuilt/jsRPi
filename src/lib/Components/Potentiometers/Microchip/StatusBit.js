"use strict";
//
//  StatusBit.js
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
 * Device status bits.
 * @enum {Number}
 */
const StatusBit = {
    /**
     * Reserved mask.
     * @type {Number}
     */
    RESERVED_MASK: 0x0000111110000,

    /**
     * Reserved value.
     * @type {Number}
     */
    RESERVED_VALUE: 0x0000111110000,

    /**
     * EEPROM write is active.
     * @type {Number}
     */
    EEPROM_WRITEACTIVE: 0x1000,

    /**
     * Wiper lock 1 enabled.
     * @type {Number}
     */
    WIPER_LOCK1: 0x0100,

    /**
     * Wiper lock 0 enabled.
     * @type {Number}
     */
    WIPER_LOCK0: 0x0010,

    /**
     * EEPROM write-protected.
     * @type {Number}
     */
    EEPROM_WRITEPROTECTION: 0x0001,

    /**
     * Null bit.
     * @type {Number}
     */
    None: 0
};

module.exports = StatusBit;