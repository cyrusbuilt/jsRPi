"use strict";

//
//  PowerInterface.js
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
var PowerState = require('./PowerState.js');

/**
 * An interface for power control device abstraction interfaces.
 * @interface
 * @extends {Component}
 */
function PowerInterface() {
  Component.call(this);
}

PowerInterface.prototype.constructor = PowerInterface;
inherits(PowerInterface, Component);

/**
 * In a derivative class, fires the power state changed event.
 * @param  {PowerStateChangeEvent} stateChangeEvent The event info object.
 */
PowerInterface.prototype.onPowerStateChanged = function(stateChangeEvent) {};

/**
 * In a derivative class, checks to see if the component is on.
 * @return {Boolean} true if on; Otherwise, false.
 */
PowerInterface.prototype.isOn = function() { return false; };

/**
 * In a derivative class, checks to see if the component is off.
 * @return {Boolean} true if off; Otherwise, false.
 */
PowerInterface.prototype.isOff = function() { return false; };

/**
 * In a derivative class, gets the state of the component.
 * @return {PowerState} The component state.
 */
PowerInterface.prototype.getState = function() { return PowerState.Unknown; };

/**
 * In a derivative class, sets the state of the component.
 * @param  {PowerState} state The power state to set.
 * @throws {ObjectDisposedException} if this component instance has been disposed.
 * @throws {InvalidPinModeException} if the pin being used to control this
 * component is not configured as an output.
 * @throws {InvalidOperationException} if an invalid state is specified.
 */
PowerInterface.prototype.setState = function(state) {};

/**
 * In a derivative class, turns the component on.
 */
PowerInterface.prototype.turnOn = function() {};

/**
 * In a derivative class, turns the component off.
 */
PowerInterface.prototype.turnOff = function() {};

/**
 * The name of the state change event.
 * @type {String}
 * @const
 */
PowerInterface.EVENT_STATE_CHANGED = "powerStateChanged";

module.exports = PowerInterface;
