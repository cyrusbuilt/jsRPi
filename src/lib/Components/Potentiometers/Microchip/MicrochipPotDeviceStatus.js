"use strict";
//
//  MicrochipPotDeviceStatus.js
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

/**
 * The device-status concerning the channel an instance of Microchip
 * potentiometer is configured for.
 * @interface
 */
class MicrochipPotDeviceStatus {
    /**
     * Initializes a new instance of the jsrpi.Components.Potentiometers.Microchip.MicrochipPotDeviceStatus
     * interface.
     * @constructor
     */
    constructor() {}

    /**
     * In a derived class, gets whether or not the device is currently writing to EEPROM.
     * @property {Boolean} isEepromWriteActive - true if the device is writing
     * to EEPROM; otherwise, false.
     * @readonly
     */
    get isEepromWriteActive() { return false; }

    /**
     * In a derived class, gets a value indicating whether the EEPROM is write protected.
     * @property {Boolean} isEepromWriteProtected - true if the EEPROM is write
     * protected; otherwise, false.
     * @readonly
     */
    get isEepromWriteProtected() { return false; }

    /**
     * In a derived class, gets the channel the wiper-lock-active status is for.
     * @property {MicrochipPotChannel|Number} wiperLockChannel - The wiper lock channel.
     * @readonly
     */
    get wiperLockChannel() { return MicrochipPotChannel.None; }

    /**
     * In a derived class, gets whether or not the wiper's lock is active.
     * @property {Boolean} isWiperLockActive - true if the wiper's lock is
     * active; otherwise, false.
     * @readonly
     */
    get isWiperLockActive() { return false; }
}

module.exports = MicrochipPotDeviceStatus;