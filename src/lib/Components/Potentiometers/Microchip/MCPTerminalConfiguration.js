"use strict";
//
//  MCPTerminalConfiguration.js
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
 * @classdesc Terminal configuration settings for the channel a given
 * potentiometer instance is configured for.
 */
class MCPTerminalConfiguration {
    /**
     * Initializes a new instance of the jsrpi.Components.Potentiometers.Microchip.MCPTerminalConfiguration
     * class with the channel and flags to indicate whether or not the channel
     * is enabled or disabled as well as flags to indicate whether or not each
     * pin is enabled or disabled.
     * @param {Number} chan - The channel this terminal configuration represents.
     * See MicrochipPotChannel. Default is MicrochipPotChannel.None.
     * @param {Boolean} chanEnabled - Set true to enable the channel.
     * @param {Boolean} pinAEnabled - Set true to enable pin A.
     * @param {Boolean} pinWEnabled - Set true to enable pin W.
     * @param {Boolean} pinBEnabled - Set true to enable pin B.
     * @constructor
     */
    constructor(chan = MicrochipPotChannel.None, chanEnabled = false, pinAEnabled = false, pinWEnabled = false, pinBEnabled = false) {
        this._channel = chan || MicrochipPotChannel.None;
        this._channelEnabled = chanEnabled || false;
        this._pinAEnabled = pinAEnabled || false;
        this._pinWEnabled = pinWEnabled || false;
        this._pinBEnabled = pinBEnabled || false;
    }

    /**
     * Gets the channel.
     * @property {Number|MicrochipPotChannel} channel - The channel.
     */
    get channel() { return this._channel; }

    /**
     * Gets a value indicating whether the entire channel is enabled or disabled.
     * @property {Boolean} isChannelEnabled - true if the channel is enabled;
     * otherwise, false.
     */
    get isChannelEnabled() { return this._channelEnabled; }

    /**
     * Gets whether or not pin A of this channel is enabled.
     * @property {Boolean} isPinAEnabled - true if pin A is enabled;
     * otherwise, false.
     */
    get isPinAEnabled() { return this._pinAEnabled; }

    /**
     * Gets a value indicating whether or not pin W of this channel is enabled.
     * @property {Boolean} isPinWEnabled - true if pin W is enabled;
     * otherwise, false.
     */
    get isPinWEnabled() { return this._pinWEnabled; }

    /**
     * Gets a value indicating whether or not pin B of this channel is enabled.
     * @property {Boolean} isPinBEnabled - true if pin B is enabled;
     * otherwise, false.
     */
    get isPinBEnabled() { return this._pinBEnabled; }
}

module.exports = MCPTerminalConfiguration;