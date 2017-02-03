"use strict";
//
//  Sprinkler.js
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

const Device = require('../Device.js');

const STATE_CHANGED = "sprinklerZoneStateChanged";

/**
 * A sprinkler zone interface.
 * @interface
 * @extends {Device}
 */
class SprinklerZone extends Device {
    /**
     *
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Gets or sets the sprinkler name.
     * @property {String} sprinklerName - The sprinkler name.
     */
    get sprinklerName() { return ""; }

    set sprinklerName(name) {}

    /**
     * Gets or sets the zone ID.
     * @property {Number} zoneID - The zone ID.
     */
    get zoneID() { return -1; }

    set zoneID(id) {}

    /**
     * In a derived class, gets whether or not this zone is on.
     * @property {Boolean} isOn - true if the sprinkler is on; Otherwise, false.
     * @throws {ObjectDisposedException} if this instance has been disposed.
     * @readonly
     */
    get isOn() { return false; }

    /**
     * In a derived class, gets whether or not this zone is off.
     * @property {Boolean} isOff - true if the sprinkler is off; Otherwise,
     * false.
     * @readonly
     */
    get isOff() { return false; }

    /**
     * In a derived class, turns this zone on.
     */
    turnOn() {}

    /**
     * In a derived class, turns this zone off.
     */
    turnOff() {}

    /**
     * In a derived class, sets the state of this zone.
     * @param  {Boolean} on Set true to turn the zone on or false to turn it off.
     * @throws {ObjectDisposedException} if this instance has been disposed.
     */
    setState(on) {}

    /**
     * The name of the zone state change event.
     * @const {String}
     */
    static get EVENT_STATE_CHANGED() { return STATE_CHANGED; }
}

module.exports = SprinklerZone;
