"use strict";
//
//  SprinklerControllerDevice.js
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

const SprinklerControllerBase = require('./SprinklerControllerBase.js');

/**
 * @classdesc Sprinkler controller device. This is a basic implementation of
 * SprinklerControllerBase.
 * @extends {SprinklerControllerBase}
 */
class SprinklerControllerDevice extends SprinklerControllerBase {
    /**
     * Initializes a new instance of the jsrpi.Devices.Sprinkler.SprinklerControllerDevice
     * class.
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Gets a value indicating whether the sprinklers are raining.
     * @return {Boolean} isRaining - true if the sprinklers are raining;
     * Otherwise, false.
     * @readonly
     * @override
     */
    get isRaining() {
        let onCount = 0;
        for (let zn of super.zones) {
            if (zn.isOn) {
                onCount++;
            }
        }

        return (onCount === super.zones.length);
    }
}

module.exports = SprinklerControllerDevice;
