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

var inherits = require('util').inherits;
var extend = require('extend');
var SprinklerZone = require('./SprinklerZone.js');
var DeviceBase = require('../DeviceBase.js');

/**
 * @classdesc Base class for sprinler zones.
 * @param {String} name The name of the zone.
 * @constructor
 * @implements {SprinklerZone}
 * @extends {DeviceBase}
 */
function SprinklerZoneBase(name) {
  SprinklerZone.call(this);
  DeviceBase.call(this);

  var self = this;

  /**
   * @inheritdoc
   */
  this.sprinklerName = name || DeviceBase.prototype.deviceName || "";

  /**
   * Gets whether or not this zone is off.
   * @return {Boolean} true if the sprinkler is off; Otherwise, false.
   * @override
   */
  this.isOff = function() {
    return !self.isOn();
  };

  /**
   * Turns this zone on.
   * @override
   */
  this.turnOn = function() {
    self.setState(true);
  };

  /**
   * Turns this zone off.
   * @override
   */
  this.turnOff = function() {
    self.setState(false);
  };
}

SprinklerZoneBase.prototype.constructor = SprinklerZoneBase;
inherits(SprinklerZoneBase, SprinklerZone);
module.exports = extend(true, SprinklerZoneBase, DeviceBase);
