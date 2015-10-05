"use strict";

//
//  DimmableLight.js
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
var Light = require('./Light.js');

/**
 * An interface for dimmable light component abstractions.
 * @interface
 * @extends {Light}
 */
function DimmableLight() {
  Light.call(this);
}

DimmableLight.prototype.constructor = DimmableLight;
inherits(DimmableLight, Light);

/**
 * In a derivative class, raises the light level changed event.
 * @param  {LightlevelChangeEvent} levelChangeEvent The level change event object.
 */
DimmableLight.prototype.onLightLevelChanged = function(levelChangeEvent) {};

/**
 * In a derivative class, gets the brightness level.
 * @return {Number} The brightness level.
 */
DimmableLight.prototype.getLevel = function() { return 0; };

/**
 * In a derivative class, sets the brightness level.
 * @param  {Number} level The brightness level.
 */
DimmableLight.prototype.setLevel = function(level) {};

/**
 * In a derivative class, gets the minimum brightness level.
 * @return {Number} The minimum brightness level.
 */
DimmableLight.prototype.minLevel = function() { return 0; };

/**
 * In a derivative class, gets the maximum brightness level.
 * @return {Number} The max brightness level.
 */
DimmableLight.prototype.maxLevel = function() { return 0; };

/**
 * In a derivative class, gets the current brightness level percentage.
 * @param  {Number} level The brightness level.
 * @return {Number}       The brightness percentage level.
 */
DimmableLight.prototype.getLevelPercentage = function(level) { return 0; };

module.exports = DimmableLight;
