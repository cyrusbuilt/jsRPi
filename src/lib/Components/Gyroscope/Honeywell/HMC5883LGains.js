"use strict";
//
//  HMC5883LGains.js
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
 * Possible Gyro gains. Gyro gain is essentially how
 * aggressively the gyro attempts to correct drift.
 * @enum {Number}
 */
const HMC5883LGains = {
    /**
     * 0.88% gain.
     * @type {Number}
     */
    GAIN_0_88_GA: 0,

    /**
     * 1.3% gain.
     * @type {Number}
     */
    GAIN_1_3_GA: 1,

    /**
     * 1.9% gain.
     * @type {Number}
     */
    GAIN_1_9_GA: 2,

    /**
     * 2.5% gain.
     * @type {Number}
     */
    GAIN_2_5_GA: 3,

    /**
     * 4.0% gain.
     * @type {Number}
     */
    GAIN_4_0_GA: 4,

    /**
     * 4.7% gain.
     * @type {Number}
     */
    GAIN_4_7_GA: 5,

    /**
     * 5.6% gain.
     * @type {Number}
     */
    GAIN_5_6_GA: 6,

    /**
     * 8.1% gain.
     * @type {Number}
     */
    GAIN_8_1_GA: 7
};

module.exports = HMC5883LGains;