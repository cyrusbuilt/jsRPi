"use strict";
//
//  MicrochipPotentiometer.js
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

const Potentiometer = require('../Potentiometer.js');
const MicrochipPotChannel = require('./MicrochipPotChannel.js');
const MicrochipPotNonVolatileMode = require('./MicrochipPotNonVolatileMode.js');



/**
 * An MCP45XX or MCP46XX IC device abstraction interface.
 * @interface
 * @extends {Potentiometer}
 */
class MicrochipPotentiometer extends Potentiometer {
    /**
     * Initializes a new instance of the jsrpi.Components.Potentiometers.Microchip.MicrochipPotentiometer
     * interface.
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * In a derived class, gets the channel this device is configured for.
     * @property {MicrochipPotChannel|Number} channel - The device channel.
     * @readonly
     */
    get channel() { return MicrochipPotChannel.None; }

    /**
     * In a derived class, gets whether or not the device is capable of non-volatile wipers.
     * @property {Boolean} isNonVolatileWiperCapable - true if the device is
     * capable of non-volatile wipers; otherwise, false.
     * @readonly
     */
    get isNonVolatileWiperCapable() { return false; }

    /**
     * In a derived class, gets the way non-volatile reads and/or writes are done.
     * @property {MicrochipPotNonVolatileMode|Number} nonVolatileMode - The non-volatile mode.
     * @readonly
     */
    get nonVolatileMode() { return MicrochipPotNonVolatileMode.VolatileAndNonVolatile; }

    /**
     * In a derived class, gets the channels that are supported by the underlying device.
     * @property {Array} supportedChannels - An array of MicrochipPotChannel
     * that represent the supported channels by the underlying device.
     * @readonly
     */
    get supportedChannels() { return []; }

    /**
     * In a derived class, gets the device and wiper status.
     * @property {MicrochipPotDeviceStatus} deviceStatus - The device status.
     * @throws {IOException} if communication with the device fails.
     * @readonly
     */
    get deviceStatus() { return null; }

    /**
     * In a derived class, gets or sets the current terminal configuration.
     * @property {MCPTerminalConfiguration} terminalConfiguration - The
     * terminal configuration.
     * @throws {IOException} if communication with the device failed or
     * malformed result.
     */
    get terminalConfiguration() { return null; }

    set terminalConfiguration(config) {}

    /**
     * In a derived class, updates the cache to the wiper's value.
     * @returns {Number} the wiper's current value.
     * @throws {IOException} if communication with the device failed or
     * malformed result.
     */
    updateCacheFromDevice() { return 0; }

    /**
     * In a derived class, determines whether or not the specified channel is supported by
     * the underlying device.
     * @param {MicrochipPotChannel|Number} channel The channel to check.
     * @returns {Boolean} true if the channel is supported; otherwise, false.
     */
    isChannelSupported(channel) { return false; }

    /**
     * In a derived class, enables or disables the wiper lock.
     * @param {Boolean} enabled Set true to enable.
     * @throws {IOException} if communication with the device failed or
     * malformed result.
     */
    setWiperLock(enabled) {}

    /**
     * In a derived class, Enables or disables write-protection for devices
     * capable of non-volatile memory. Enabling write-protection does not only
     * protect non-volatile wipers, it also protects any other non-volatile
     * information stored (i.e. wiper-locks).
     * @param {Boolean} enabled Set true to enable.
     * @throws {IOException} if communication with the device failed or
     * malformed result.
     */
    setWriteProtection(enabled) {}
}

module.exports = MicrochipPotentiometer;