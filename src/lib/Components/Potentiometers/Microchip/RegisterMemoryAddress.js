"use strict";
//
//  RegisterMemoryAddress.js
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
 * Register memory addresses.
 * @enum {Number}
 */
const RegisterMemoryAddress = {
    /**
     * Wiper 0.
     * @type {Number}
     */
    WIPER0: 0x00,

    /**
     * Wiper 1.
     * @type {Number}
     */
    WIPER1: 0x01,

    /**
     * Wiper 0 non-volatile.
     * @type {Number}
     */
    WIPER0_NV: 0x02,

    /**
     * Wiper 1 non-volatile.
     * @type {Number}
     */
    WIPER1_NV: 0x03,

    /**
     * Terminal control for wipers 0 and 1.
     * @type {Number}
     */
    TCON01: 0x04,

    /**
     * Wiper 2.
     * @type {Number}
     */
    WIPER2: 0x06,

    /**
     * Wiper 3.
     * @type {Number}
     */
    WIPER3: 0x07,

    /**
     * Wiper 2 non-volatile.
     * @type {Number}
     */
    WIPER2_NV: 0x08,

    /**
     * Wiper 3 non-volatile.
     * @type {Number}
     */
    WIPER3_NV: 0x09,

    /**
     * Terminal control for wipers 2 and 3.
     * @type {Number}
     */
    TCON23: 0x04,

    /**
     * No address.
     * @type {Number}
     */
    None: 0
};

module.exports = RegisterMemoryAddress;