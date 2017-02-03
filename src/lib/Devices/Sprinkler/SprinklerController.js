"use strict";
//
//  SprinklerController.js
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

/**
* A sprinkler controller abstraction interface.
* @interface
* @extends {Device}
*/
class SprinklerController extends Device {
    /**
     * Initializes a new instance of the jsrpi.Devices.Sprinkler.SprinklerController
     * interface.
     * @constructor
     */
    constructor() {
        super();
    }

    /**
    * In a derived class, gets the zone count.
    * @property {Number} zoneCount - The number zones being controlled.
    */
    get zoneCount() { return 0; }

    /**
    * In a derived class, gets the zones assigned to this controller.
    * @property {Array} zones - An array of zones (SprinklerZone objects)
    * assigned to the controller.
    * @readonly
    */
    get zones() { return []; }

    /**
    * In a derived class, adds a sprikler zone to this controller if it does not
    * already exist.
    * @param  {SprinklerZone} sprinklerZone The zone to add.
    */
    addZone(sprinklerZone) {}

    /**
    * In a derived class, removes the specified zone from the controller if it exists.
    * @param  {SprinklerZone} sprinklerZone The zone to remove.
    */
    removeZone(sprinklerZone) {}

    /**
    * In a derived class, gets a value indicating whether this controller is on.
    * @property {Boolean} isOn - true if the controller is on; Otherwise, false.
    * @readonly
    */
    get isOn() { return false; }

    /**
    * In a derived class, gets a value indicating whether this controller is off.
    * @property {Boolean} isOff - true if the controller is off; Otherwise,
    * false.
    * @readonly
    */
    get isOff() { return false; }

    /**
    * In a derived class, gets a value indicating whether the sprinklers are
    * raining.
    * @property {Boolean} isRaining - true if the sprinklers are raining;
    * Otherwise, false.
    * @readonly
    */
    get isRaining() { return false; }

    /**
    * In a derived class, determines whether the specified zone is on.
    * @param  {Number} zone The zone to check.
    * @return {Boolean}     true if the specified zone is on; Otherwise, false.
    */
    isOnForZone(zone) { return false; }

    /**
    * In a derived class, determines whether the specified zone is off.
    * @param  {Number} zone The zone to check.
    * @return {Boolean}     true if the specified zone is off; Otherwise, false.
    */
    isOffForZone(zone) { return false; }

    /**
    * In a derived class, turns the specified zone on.
    * @param  {Number} zone The zone to turn on.
    */
    turnOn(zone) {}

    /**
    * In a derived class, turns all zones on.
    */
    turnOnAllZones() {}

    /**
    * In a derived class, turns off the specified zone.
    * @param  {Number} zone The zone to turn off.
    */
    turnOff(zone) {}

    /**
    * In a derived class, turns off all zones.
    */
    turnOffAllZones() {}

    /**
    * In a derived class, sets the state of the specified zone.
    * @param  {Number} zone The zone to set the state of.
    * @param  {Boolean} on  Set true to turn on the specified zone.
    */
    setState(zone, on) {}
}

module.exports = SprinklerController;
