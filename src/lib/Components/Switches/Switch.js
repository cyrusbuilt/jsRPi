"use strict";

//
//  Switch.js
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
var SwitchState = require('./SwitchState.js');

/**
 * An interface for switch device abstractions.
 * @interface
 * @extends {Component}
 */
function Switch() {
  Component.call(this);
}

Switch.prototype.constructor = Switch;
inherits(Switch, Component);

/**
 * In a derived class, fires the switch state change event.
 * @param  {SwitchStateChangeEvent} switchStateEvent The event info object.
 */
Switch.prototype.onSwitchStateChanged = function(switchStateEvent) {};

/**
 * In a derived class, gets whether or not this switch is in the on position.
 * @return {Boolean} true if on; Otherwise, false.
 */
Switch.prototype.isOn = function() { return false; };

/**
 * In a derived class, gets whether or not this switch is in the off position.
 * @return {Boolean} true if off; Otherwise, false.
 */
Switch.prototype.isOff = function() { return false; };

/**
 * In a derived class, gets the state of the switch.
 * @return {SwitchState} The state of the switch.
 */
Switch.prototype.getState = function() { return SwitchState.Off; };

/**
 * In a derived class, gets whether or not this switch is in the specified state.
 * @param  {SwitchState} state The state to check against.
 * @return {Boolean}       true if this switch is in the specified state;
 * Otherwise, false.
 */
Switch.prototype.isState = function(state) { return false; };

/**
 * The name of the state change event.
 * @type {String}
 * @const
 */
Switch.EVENT_STATE_CHANGED = "switchStateChanged";

module.exports = Switch;
