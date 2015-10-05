"use strict";

//
//  Pin.js
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
//

var inherits = require('util').inherits;
var Disposable = require('../Disposable.js');
var PinMode = require('./PinMode.js');
var PinState = require('./PinState.js');

/**
 * A physical pin interface.
 * @interface
 * @extends {Disposable}
 */
function Pin() {
  Disposable.call(this);
}

Pin.prototype.constructor = Pin;
inherits(Pin, Disposable);

/**
 * Gets or sets the pin name.
 * @property {String}
 */
Pin.prototype.pinName = "";

/**
 * Gets or sets the tag.
 * @property {Object}
 */
Pin.prototype.tag = null;

/**
 * Gets the state of the pin.
 * @return {PinState} The state of the pin.
 */
Pin.prototype.state = function() { return PinState.Low; };

/**
 * Gets the pin mode.
 * @return {PinMode} The pin mode.
 */
Pin.prototype.mode = function() { return PinMode.TRI; };

/**
 * Gets the pin address.
 * @return {Number} The address.
 */
Pin.prototype.address = function() { return 0; };

module.exports = Pin;
