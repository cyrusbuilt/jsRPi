"use strict";
//
//  DeviceControllerDeviceStatus.js
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
 * @classdesc The device's status.
 */
class DeviceControllerDeviceStatus {
    /**
     * Initializes a new instance of the jsrpi.Components.Potentiometers.Microchip.DeviceControllerDeviceStatus
     * class with whether or not the EEPROM is actively writing, whether or not
     * the EEPROM is write-protected, whether or not channel A is locked, and
     * whether or not channel B is locked.
     * @param {Boolean} writeActive - Set true if actively writing the EEPROM.
     * @param {Boolean} writeProtected - Set true if the EEPROM is write-protected.
     * @param {Boolean} chanALock - Set true if channel A is locked.
     * @param {Boolean} chanBLock - Set true if channel B is locked.
     * @constructor
     */
    constructor(writeActive = false, writeProtected = false, chanALock = false, chanBLock = false) {
        this._eepromWriteActive = writeActive || false;
        this._eepromWriteProtected = writeProtected || false;
        this._channelALocked = chanALock || false;
        this._channelBLocked = chanBLock || false;
    }

    /**
     * Gets a value indicating whether nor not the EEPROM is actively writing.
     * @property {Boolean} eepromWriteActive - true if the EEPROM is actively
     * writing; otherwise, false.
     */
    get eepromWriteActive() { return this._eepromWriteActive; }

    /**
     * Gets a value indicating whether or not the EEPROM is write-protected.
     * @property {Boolean} eepromWriteProtected - true write-protected;
     * otherwise, false.
     */
    get eepromWriteProtected() { return this._eepromWriteProtected; }

    /**
     * Gets a value indicating whether or not channel A is locked.
     * @property {Boolean} channelALocked - true if channel A locked;
     * otherwise, false.
     */
    get channelALocked() { return this._channelALocked; }

    /**
     * Gets a value indicating whether or not channel B is locked.
     * @property {Boolean} channelALocked - true if channel B locked;
     * otherwise, false.
     */
    get channelBLocked() { return this._channelBLocked; }
}

module.exports = DeviceControllerDeviceStatus;