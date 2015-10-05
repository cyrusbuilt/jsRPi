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

var inherits = require('util').inherits;
var Device = require('../Device.js');

/**
 * A sprinkler zone interface.
 * @interface
 * @extends {Device}
 */
function SprinklerZone() {
  Device.call(this);
}

SprinklerZone.prototype.constructor = SprinklerZone;
inherits(SprinklerZone, Device);

/**
 * Gets or sets the sprinkler name.
 * @property {String}
 */
SprinklerZone.prototype.sprinklerName = "";

/**
 * Gets or sets the Zone ID.
 * @property {Number}
 */
SprinklerZone.prototype.zoneID = -1;

/**
 * In a derived class, gets whether or not this zone is on.
 * @return {Boolean} true if the sprinkler is on; Otherwise, false.
 * @throws {ObjectDisposedException} if this instance has been disposed.
 */
SprinklerZone.prototype.isOn = function() { return false; };

/**
 * In a derived class, gets whether or not this zone is off.
 * @return {Boolean} true if the sprinkler is off; Otherwise, false.
 */
SprinklerZone.prototype.isOff = function() { return false; };

/**
 * In a derived class, turns this zone on.
 */
SprinklerZone.prototype.turnOn = function() {};

/**
 * In a derived class, turns this zone off.
 */
SprinklerZone.prototype.turnOff = function() {};

/**
 * In a derived class, sets the state of this zone.
 * @param  {Boolean} on Set true to turn the zone on or false to turn it off.
 * @throws {ObjectDisposedException} if this instance has been disposed.
 */
SprinklerZone.prototype.setState = function(on) {};

/**
 * The name of the zone state change event.
 * @const {String}
 */
SprinklerZone.EVENT_STATE_CHANGED = "sprinklerZoneStateChanged";

module.exports = SprinklerZone;
