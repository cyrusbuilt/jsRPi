"use strict";
//
//  DeviceControllerTerminalConfiguration.js
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

const DeviceControlChannel = require('./DeviceControlChannel.js');
const IllegalArgumentException = require('../../../IllegalArgumentException.js');

/**
 * @classdesc The device's terminal configuration for a certain channel.
 */
class DeviceControllerTerminalConfiguration {
    /**
     * Initializes a new instance of the
     * jsrpi.Components.Potentiometers.Microchip.DeviceControllerTerminalConfiguration
     * class with the device control channel, whether or not the
     * channel is enabled, whether or not pin A is enabled,
     * whether or not pin W is enabled, and whether or pin
     * B is enabled.
     * @param {DeviceControlChannel} dcc The device control channel.
     * @param {Boolean} chanEnabled Set true to enable the channel.
     * @param {Boolean} pinAEnabled Set true to enable pin A.
     * @param {Boolean} pinWEnabled Set true to enable pin W.
     * @param {Boolean} pinBEnabled Set true to enable pin B.
     * @throws {IllegalArgumentException} if param dcc is not an instance of DeviceControlChannel.
     * @constructor
     */
    constructor(dcc = null, chanEnabled = false, pinAEnabled = false, pinWEnabled = false, pinBEnabled = false) {
        if (dcc && (!(dcc instanceof DeviceControlChannel))) {
            throw new IllegalArgumentException("dcc argument must be object of type DeviceControlChannel.");
        }

        this._channel = dcc;
        this._channelEnabled = chanEnabled || false;
        this._pinAEnabled = pinAEnabled || false;
        this._pinBEnabled = pinBEnabled || false;
        this._pinWEnabled = pinWEnabled || false;
    }

    /**
     * Gets the channel.
     * @property {DeviceControlChannel} channel - The channel
     * @readonly
     */
    get channel() { return this._channel; }

    /**
     * Gets a value indicating whether or not the channel is enabled.
     * @property {Boolean|boolean} channelEnabled - true if channel enabled;
     * otherwise, false.
     * @readonly
     */
    get channelEnabled() { return this._channelEnabled; }

    /**
     * Gets a value indicating whether or not pin A is enabled.
     * @property {Boolean|boolean} pinAEnabled - true if pin A enabled;
     * otherwise, false.
     * @readonly
     */
    get pinAEnabled() { return this._pinAEnabled; }

    /**
     * Gets a value indicating whether or not pin W is enabled.
     * @property {Boolean|boolean} pinWEnabled - true if pin W enabled;
     * otherwise, false.
     * @readonly
     */
    get pinWEnabled() { return this._pinWEnabled; }

    /**
     * Gets a value indicating whether or not pin B is enabled.
     * @property {Boolean|boolean} pinBEnabled - true if pin B enabled;
     * otherwise, false.
     * @readonly
     */
    get pinBEnabled() { return this._pinBEnabled; }
}

module.exports = DeviceControllerTerminalConfiguration;