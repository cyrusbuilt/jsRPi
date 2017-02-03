"use strict";
//
//  SprinklerControllerBase.js
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

const _ = require('underscore');
const util = require('util');
const SprinklerController = require('./SprinklerController.js');
const ZoneStateChangeEvent = require('./ZoneStateChangeEvent.js');
const SprinklerZone = require('./SprinklerZone.js');
const DeviceBase = require('../DeviceBase.js');
const EventEmitter = require('events').EventEmitter;
const NotImplementedException = require('../../NotImplementedException.js');
const ObjectDisposedException = require('../../ObjectDisposedException.js');

/**
* @classdesc Sprinkler controller base class.
* @implements {SprinklerController}
* @extends {DeviceBase}
* @extends {EventEmitter}
*/
class SprinklerControllerBase extends SprinklerController {
    /**
     * Initializes a new instance of the jsrpi.Devices.Sprinkler.SprinklerBase
     * class.
     * @constructor
     */
    constructor() {
        super();

        this._base = new DeviceBase();
        this._emitter = new EventEmitter();
        this._zones = [];
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
     * Gets or sets the object to tag this device instance with.
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
    * @readonly
    * @override
    */
    get propertyCollection() {
        return this._base.getPropertyCollection();
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
    */
    setProperty(key, value) {
        this._base.setProperty(key, value);
    }

    /**
    * Removes all event listeners.
    * @override
    */
    removeAllListeners() {
        this._emitter.removeAllListeners();
    }

    /**
    * Attaches a listener (callback) for the specified event name.
    * @param  {String}   evt      The name of the event.
    * @param  {Function} callback The callback function to execute when the
    * event is raised.
    * @throws {ObjectDisposedException} if this instance has been disposed.
    * @override
    */
    on(evt, callback) {
        if (this._base.isDisposed) {
            throw new ObjectDisposedException("SprinklerControllerBase");
        }
        this._emitter.on(evt, callback);
    }

    /**
    * Emits the specified event.
    * @param  {String} evt  The name of the event to emit.
    * @param  {Object} args The object that provides arguments to the event.
    * @throws {ObjectDisposedException} if this instance has been disposed.
    * @override
    */
    emit(evt, args) {
        if (this._base.isDisposed) {
            throw new ObjectDisposedException("SprinklerControllerBase");
        }
        this._emitter.emit(evt, args);
    }

    /**
    * Releases all managed resources used by this instance. This *does not*
    * dispose any sprinkler zones attached to this controller.
    * @override
    */
    dispose() {
        if (this._base.isDisposed) {
            return;
        }

        if (!util.isNullOrUndefined(this._zones)) {
            for (let zn of this._zones) {
                zn.dispose();
            }
            this._zones = undefined;
        }

        this._emitter.removeAllListeners();
        this._emitter = undefined;
        this._base.dispose();
    }

    /**
    * Adds a sprikler zone to this controller if it does not already exist.
    * @param  {SprinklerZone} sprinklerZone The zone to add.
    * @override
    */
    addZone(sprinklerZone) {
        if ((this._zones[sprinklerZone.zoneID] === undefined) &&
            (this._zones.indexOf(sprinklerZone) === -1)) {
            this._zones.push(sprinklerZone);
            let idx = this._zones.indexOf(sprinklerZone);
            sprinklerZone.zoneID = idx;
            this._zones[idx].zoneID = idx;
        }
    }

    /**
    * Removes the specified zone from the controller if it exists.
    * @param  {SprinklerZone} sprinklerZone The zone to remove.
    * @override
    */
    removeZone(sprinklerZone) {
        if ((this._zones[sprinklerZone.zoneID] !== undefined) ||
            (this._zones.indexOf(sprinklerZone) >= 0)) {
            let idx = sprinklerZone.zoneID || this._zones.indexOf(sprinklerZone);
            this._zones[idx].zoneID = -1;
            this._zones.splice(idx, 1);
        }
    }

    /**
    * Raises the SprinklerZone.EVENT_STATE_CHANGED event.
    * @param  {ZoneStateChangeEvent} sprinklerStateChangeEvent The event object.
    */
    onSprinklerStateChange(sprinklerStateChangeEvent) {
        if (this._base.isDisposed) {
            throw new ObjectDisposedException("FireplaceBase");
        }

        setImmediate(() => {
            this.emit(SprinklerZone.EVENT_STATE_CHANGED, sprinklerStateChangeEvent);
        });
    }

    /**
    * Gets the zone count.
    * @property {Number} zoneCount - The number zones being controlled.
    * @readonly
    * @override
    */
    get zoneCount() {
        if ((util.isNullOrUndefined(this._zones)) || (!util.isArray(this._zones))) {
            return 0;
        }
        return _.size(this._zones);
    }

    /**
    * Gets the zones assigned to this controller.
    * @property {Array} zones - An array of zones (SprinklerZone objects) assigned to the
    * controller.
    * @readonly
    * @override
    */
    get zones() {
        return this._zones;
    }

    /**
    * Gets a value indicating whether this controller is on.
    * @property {Boolean} isOn - true if the controller is on; Otherwise, false.
    */
    get isOn() {
        let result = false;
        for (let zn of this._zones) {
            result = zn.isOn;
            if (result) {
                break;
            }
        }
        return result;
    }

    /**
    * Gets a value indicating whether this controller is off.
    * @property {Boolean} isOff - true if the controller is off; Otherwise,
    * false.
    * @readonly
    * @override
    */
    get isOff() {
        return !this.isOn;
    }

    /**
    * Determines whether the specified zone is on.
    * @param  {Number}  zone The zone to check.
    * @return {Boolean} true if the specified zone is on; Otherwise, false.
    * @override
    */
    isOnForZone(zone) {
        if (_.isNumber(zone)) {
            if ((zone >= 0) && (this._zones[zone] !== undefined)) {
                return this._zones[zone].isOn;
            }
        }
        return false;
    }

    /**
    * Determines whether the specified zone is off.
    * @param  {Number}  zone The zone to check.
    * @return {Boolean} true if the specified zone is off; Otherwise, false.
    * @override
    */
    isOffForZone(zone) {
        if (_.isNumber(zone)) {
            if ((zone >= 0) && (this._zones[zone] !== undefined)) {
                return this._zones[zone].isOff;
            }
        }
        return false;
    }

    /**
    * In a derived class, turns the specified zone on.
    * @param  {Number} zone The zone to turn on.
    * @override
    */
    turnOn(zone) {
        if (this.isOffForZone(zone)) {
            if (_.isNumber(zone)) {
                if ((zone >= 0) && (this._zones[zone] !== undefined)) {
                    this._zones[zone].turnOn();
                    this.onSprinklerStateChange(new ZoneStateChangeEvent(false, true, zone));
                }
            }
        }
    }

    /**
    * Turns all zones on.
    * @override
    */
    turnOnAllZones() {
        for (let i = 0; i < this.zoneCount; i++) {
            if (this._zones[i].isOff) {
                this._zones[i].turnOn();
                this.onSprinklerStateChange(new ZoneStateChangeEvent(false, true, i));
            }
        }
    }

    /**
    * Turns off the specified zone.
    * @param  {Number} zone The zone to turn off.
    */
    turnOff(zone) {
        if (this.isOnForZone(zone)) {
            if (_.isNumber(zone)) {
                if ((zone >= 0) && (this._zones[zone] !== undefined)) {
                    this._zones[zone].turnOff();
                    this.onSprinklerStateChange(new ZoneStateChangeEvent(true, false, zone));
                }
            }
        }
    }

    /**
    * Turns off all zones.
    */
    turnOffAllZones() {
        for (let i = 0; i < this.zoneCount; i++) {
            if (this._zones[i].isOn) {
                this._zones[i].turnOff();
                this.onSprinklerStateChange(new ZoneStateChangeEvent(true, false, i));
            }
        }
    }

    /**
    * Sets the state of the specified zone.
    * @param  {Number}  zone The zone to set the state of.
    * @param  {Boolean} on   Set true to turn on the specified zone.
    * @override
    */
    setState(zone, on) {
        let oldState = this.isOnForZone(zone);
        this._zones[zone].setState(on);
        this.onSprinklerStateChange(new ZoneStateChangeEvent(oldState, on, zone));
    }

    /**
    * Gets a value indicating whether the sprinklers are raining.
    * @return {Boolean} isRaining - true if the sprinklers are raining;
    * Otherwise, false.
    * @readonly
    * @override
    */
    get isRaining() {
        return false;
    }
}

module.exports = SprinklerControllerBase;
