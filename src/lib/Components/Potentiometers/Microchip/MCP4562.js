"use strict";
//
//  MCP4562.js
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

const MicrochipPotChannel = require('./MicrochipPotChannel.js');
const MicrochipPotNonVolatileMode = require('./MicrochipPotNonVolatileMode.js');
const MicrochipPotentiometerBase = require('./MicrochipPotentiometerBase.js');

const SUPPORTED_CHANNELS = [
    MicrochipPotChannel.A
];

/**
 * @classdesc Hardware device abstraction component for the Microchip MCP4562.
 * @extends {MicrochipPotentiometerBase}
 */
class MCP4562 extends MicrochipPotentiometerBase {
    /**
     * Initializes a new instance of the MCP4562 class wit the I2C device that
     * is the connection to the MCP4562, whether the address pin A0 is high or
     * not, and the initial value of the wiper.
     * @param {I2CInterface|I2CBus} device The I2C bus device this instance is connected to.
     * @param {Boolean} pinA0 Whether the device's address pin A0 is high (true) or low (false).
     * @param {Boolean} pinA1 Whether the device's address pin A1 is high (true) or low (false).
     * @param {MicrochipPotNonVolatileMode|Number} nonVolatileMode The way non-volatile reads or writes are done.
     * @throws {ArgumentNullException} if 'device' is null.
     * @throws {IOException} if unable to open the I2C bus.
     * @constructor
     */
    constructor(device = null, pinA0 = false, pinA1 = false, nonVolatileMode = MicrochipPotNonVolatileMode.VolatileAndNonVolatile) {
        super(device, pinA0, pinA1,
            MicrochipPotentiometerBase._PIN_NOT_AVAILABLE,
            MicrochipPotChannel.A,
            nonVolatileMode,
            MicrochipPotentiometerBase._INITIALVALUE_LOADED_FROM_EEPROM);
    }

    /**
     * Gets whether or not the device is capable of non-volatile wipers.
     * @property {Boolean} isNonVolatileWiperCapable - true if the device is
     * capable of non-volatile wipers; otherwise, false.
     * @readonly
     * @override
     */
    get isNonVolatileWiperCapable() { return true; }

    /**
     * Gets the maximum wiper-value supported by the device.
     * @property {Number} maxValue - The max wiper value.
     * @readonly
     * @override
     */
    get maxValue() { return 256; }

    /**
     * Gets whether the device is a potentiometer or a rheostat.
     * @property {Boolean} isRheostat - true if this instance is rheostat;
     * otherwise, false.
     * @readonly
     * @override
     */
    get isRheostat() { return true; }

    /**
     * Gets the channels that are supported by the underlying device.
     * @property {Array} supportedChannels - An array of MicrochipPotChannel
     * that represent the supported channels by the underlying device.
     * @readonly
     * @override
     */
    get supportedChannels() { return SUPPORTED_CHANNELS; }
}

module.exports = MCP4562;