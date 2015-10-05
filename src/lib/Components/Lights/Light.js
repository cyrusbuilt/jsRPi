"use strict";

//
//  Light.js
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
var Component = require('../Component.js');


/**
 * An interface for light abstraction components.
 * @interface
 * @extends {Component}
 */
function Light() {
  Component.call(this);
}

Light.prototype.constructor = Light;
inherits(Light, Component);

/**
 * In a derivative class, gets a value indicating whether this light is on.
 * @return {Boolean} true if the light is on; Otherwise, false.
 */
Light.prototype.isOn = function() { return false; };

/**
 * In a derivative class, gets a value indicating whether this light is off.
 * @return {Boolean} true if the light is off; Otherwise, false.
 */
Light.prototype.isOff = function() { return false; };

/**
 * In a derivative class, switches the light on.
 */
Light.prototype.turnOn = function() {};

/**
 * In a derivative class, switches the light off.
 */
Light.prototype.turnOff = function() {};

/**
 * In a derivate class, fires the light state change event.
 * @param  {LightStateChangeEvent} lightChangeEvent The state change event object.
 */
Light.prototype.onLightStateChange = function(lightChangeEvent) {};

/**
 * The name of the light state changed event.
 * @type {String}
 * @const
 */
Light.LIGHT_STATE_CHANGED = "lightStateChanged";

/**
 * The name of the light level changed event.
 * @type {String}
 * @const
 */
Light.LIGHT_LEVEL_CHANGED = "lightLevelChanged";

module.exports = Light;
