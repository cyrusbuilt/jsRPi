"use strict";
//
//  TerminalControlRegisterBit.js
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
 * Terminal control register bits.
 * @enum {Number}
 */
const TerminalControlRegisterBit = {
    /**
     * Wiper 0 and 2, Hardware config.
     * @type {Number}
     */
    TCON_RH02HW: (1 << 3),

    /**
     * Wiper 0 and 2, Pin A.
     * @type {Number}
     */
    TCON_RH02A: (1 << 2),

    /**
     * Wiper 0 and 2, Pin W.
     * @type {Number}
     */
    TCON_RH02W: (1 << 1),

    /**
     * Wiper 0 and 2, Pin B.
     * @type {Number}
     */
    TCON_RH02B: (1 << 0),

    /**
     * Wiper 1 and 3, Hardware config.
     * @type {Number}
     */
    TCON_RH13HW: (1 << 7),

    /**
     * Wiper 1 and 3, Pin A.
     * @type {Number}
     */
    TCON_RH13A: (1 << 6),

    /**
     * Wiper 1 and 3, Pin W.
     * @type {Number}
     */
    TCON_RH13W: (1 << 5),

    /**
     * Wiper 1 and 3, Pin B.
     * @type {Number}
     */
    TCON_RH13B: (1 << 4),

    /**
     * Null bit.
     * @type {Number}
     */
    None: 0
};

module.exports = TerminalControlRegisterBit;