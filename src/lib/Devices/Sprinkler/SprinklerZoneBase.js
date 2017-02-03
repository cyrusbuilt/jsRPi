"use strict";
//
//  SprinklerZoneBase.js
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

const util = require('util');
const SprinklerZone = require('./SprinklerZone.js');
const DeviceBase = require('../DeviceBase.js');

/**
* @classdesc Base class for sprinler zones.
* @implements {SprinklerZone}
* @extends {DeviceBase}
*/
class SprinklerZoneBase extends SprinklerZone {
    /**
     * Initializes a new instance of the jsrpi.Devices.Sprinkler.SprinklerZoneBase
     * class with the name of the zone.
     * @param {String} name The name of the zone.
     * @constructor
     */
    constructor(name) {
        super();
        
        this._base = new DeviceBase();
        this._state = false;
        this._sprinklerName = name || this._base.deviceName || "";
        this._zoneID = -1;
    }

    /**
     * Gets or sets the device name.
     * @property {String} deviceName - The device name.
     */
    get deviceName() {
        return this._base.deviceName;
    }

    set deviceName(name) {
        this._base.deviceName = name;
    }

    /**
     * Gets or sets the object to tag the sprinkler zone with.
     * @property {Object} tag - The tag.
     */
    get tag() {
        return this._base.tag;
    }

    set tag(t) {
        this._base.tag = t;
    }

    /**
    * Determines whether or not the current instance has been disposed.
    * @property {Boolean} isDisposed - true if disposed; Otherwise, false.
    * @readonly
    * @override
    */
    get isDisposed() {
        return this._base.isDisposed;
    }

    /**
    * Gets the property collection.
    * @property {Array} propertyCollection - A custom property collection.
    * @override
    */
    get propertyCollection() {
        return this._base.propertyCollection;
    }

    /**
    * Checks to see if the property collection contains the specified key.
    * @param  {String}  key The key name of the property to check for.
    * @return {Boolean} true if the property collection contains the key;
    * Otherwise, false.
    * @override
    */
    hasProperty(key) {
        return this._base.hasProperty(key);
    }

    /**
    * Sets the value of the specified property. If the property does not already exist
    * in the property collection, it will be added.
    * @param  {String} key   The property name (key).
    * @param  {String} value The value to assign to the property.
    * @override
    */
    setProperty(key, value) {
        this._base.setProperty(key, value);
    }

    /**
    * Returns the string representation of this object. In this case, it simply
    * returns the component name.
    * @return {String} The name of this component.
    */
    toString() {
        return this.deviceName;
    }

    /**
    * @inheritdoc
    */
    get sprinklerName() {
        return this._sprinklerName;
    }

    set sprinklerName(name) {
        this._sprinklerName = name;
    }

    /**
    * @inheritdoc
    */
    get zoneID() {
        return this._zoneID;
    }

    set zoneID(id) {
        if (!util.isNumber(id)) {
            this._zoneID = -1;
        }
        this._zoneID = id;
    }

    /**
    * In a derived class, gets whether or not this zone is on.
    * @property {Boolean} isOn - true if the sprinkler is on; Otherwise, false.
    * @throws {ObjectDisposedException} if this instance has been disposed.
    * @readonly
    * @override
    */
    get isOn() {
        return this._state;
    }

    /**
    * Gets whether or not this zone is off.
    * @property {Boolean} isOff - true if the sprinkler is off; Otherwise, false.
    * @readonly
    * @override
    */
    get isOff() {
        return !this.isOn;
    }

    /**
    * In a derived class, sets the state of this zone.
    * @param  {Boolean} on Set true to turn the zone on or false to turn it off.
    * @throws {ObjectDisposedException} if this instance has been disposed.
    */
    setState(on) {
        this._state = on;
    }

    /**
    * Turns this zone on.
    * @override
    */
    turnOn() {
        this.setState(true);
    }

    /**
    * Turns this zone off.
    * @override
    */
    turnOff() {
        this.setState(false);
    }

    /**
    * Releases all resources used by the FireplaceDevice object.
    * @override
    */
    dispose() {
        if (this._base.isDisposed) {
            return;
        }

        this._state = false;
        this._zoneID = 1;
        this._sprinklerName = "";
        this._base.dispose();
    }
}

module.exports = SprinklerZoneBase;
