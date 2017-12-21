"use strict";
//
//  HMC5883LOutputRate.js
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
 * Possible output rates (resolution).
 * @enum {Number}
 */
const HMC5883LOutputRate = {
    /**
     * 0.75Hz
     * @type {Number}
     */
    Rate_0_75_HZ: 0,

    /**
     * 1.5Hz
     * @type {Number}
     */
    Rate_1_5_HZ: 1,

    /**
     * 3Hz
     * @type {Number}
     */
    Rate_3_HZ: 2,

    /**
     * 7.5Hz
     * @type {Number}
     */
    Rate_7_5_HZ: 3,

    /**
     * 15Hz
     * @type {Number}
     */
    Rate_15_HZ: 4,

    /**
     * 30Hz
     * @type {Number}
     */
    Rate_30_HZ: 5,

    /**
     * 75Hz
     * @type {Number}
     */
    Rate_75_HZ: 6
};

module.exports = HMC5883LOutputRate;