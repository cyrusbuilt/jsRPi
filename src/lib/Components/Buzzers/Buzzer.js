"use strict";

//
//  Buzzer.js
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
 * A piezo buzzer device abstraction component interface.
 * @interface
 * @extends {Component}
 */
function Buzzer() {
  Component.call(this);
}

Buzzer.prototype.constructor = Buzzer;
inherits(Buzzer, Component);

/**
 * In a derived class, starts the buzzer at the specified frequency and
 * (optionally) for the specified duration.
 * @param  {Number} freq     The frequency to buzz at.
 * @param  {Number} duration The duration in milliseconds. If not specified,
 * buzzes until stopped.
 */
Buzzer.prototype.buzz = function(freq, duration) {};

/**
 * Stops the buzzer.
 */
Buzzer.prototype.stop = function() {};

module.exports = Buzzer;
