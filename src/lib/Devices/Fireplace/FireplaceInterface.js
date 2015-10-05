"use strict";
//
//  FireplaceInterface.js
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
var FireplaceState = require('./FireplaceState.js');
var TimeUnit = require('../../PiSystem/TimeUnit.js');

/**
 * Fireplace device abstraction interface.
 * @interface
 * @extends {Device}
 */
function FireplaceInterface() {
  Device.call(this);
}

FireplaceInterface.prototype.constructor = FireplaceInterface;
inherits(FireplaceInterface, Device);

/**
 * In a derived class, fires the state change event.
 * @param  {FireplaceStateChangeEvent} stateChangeEvent The event object.
 */
FireplaceInterface.prototype.onFireplaceStateChange = function(stateChangeEvent) {};

/**
 * In a derived class, fires the operation timeout event.
 * @param  {FireplaceTimeoutEvent} timeoutEvent The event object.
 */
FireplaceInterface.prototype.onOperationTimeout = function(timeoutEvent) {};

/**
 * In a derived class, fires the pilot light state change event.
 * @param  {FireplacePilotLightEvent} pilotStateEvent The event object.
 */
FireplaceInterface.prototype.onPilotLightStateChange = function(pilotStateEvent) {};

/**
 * In a derived class, gets the fireplace state.
 * @return {FireplaceState} The current state.
 */
FireplaceInterface.prototype.getState = function() { return FireplaceState.Off; };

/**
 * In a derived class, sets the fireplace state.
 * @param  {FireplaceState} state The fireplace state.
 */
FireplaceInterface.prototype.setState = function(state) {};

/**
 * In a derived class, gets a value indicating whether the fireplace is on.
 * @return {Boolean} true if the fireplace is on; Otherwise, false.
 */
FireplaceInterface.prototype.isOn = function() { return false; };

/**
 * In a derived class, gets a value indicating whether the fireplace is off.
 * @return {Boolean} true if the fireplace is off; Otherwise, false.
 */
FireplaceInterface.prototype.isOff = function() { return false; };

/**
 * In a derived class, gets a value indicating whether the pilot light is on.
 * @return {Boolean} true if the pilot light is lit; Otherwise, false.
 */
FireplaceInterface.prototype.isPilotLightOn = function() { return false; };

/**
 * In a derived class, gets a value indicating whether pilot light is off.
 * @return {Boolean} true if the pilot light is off; Otherwise, false.
 */
FireplaceInterface.prototype.isPilotLightOff = function() { return false; };

/**
 * In a derived class, gets the timeout delay.
 * @return {Number} The timeout delay.
 */
FireplaceInterface.prototype.getTimeoutDelay = function() { return 0; };

/**
 * In a derived class, gets the timeout unit of time.
 * @return {TimeUnit} Gets the time unit being used for the timeout delay.
 */
FireplaceInterface.prototype.getTimeoutUnit = function() { return TimeUnit.Seconds; };

/**
 * In a derived class, turns the fireplace on with the specified timeout. If the
 * operation is not successful within the allotted time, the operation is
 * cancelled for safety reasons.
 * @param  {Number} timeoutDelay   The timeout delay. If not specified or less
 * than or equal to zero, then the fireplace is turned on without any saftey
 * delay (not recommended).
 * @param  {TimeUnit} timeoutUnit  The time unit of measure for the timeout. If
 * not specified, TimeUnit.Seconds is assumed.
 */
FireplaceInterface.prototype.turnOn = function(timeoutDelay, timeoutUnit) {};

/**
 * In a derived class, turns the fireplace off.
 */
FireplaceInterface.prototype.turnOff = function() {};

/**
 * In a derived class, sets the timeout delay.
 * @param  {Number} delay   The timeout delay.
 * @param  {TimeUnit} unit  The time unit of measure for the timeout.
 * @throws {InvalidOperationException} if the fireplace is turned off.
 */
FireplaceInterface.prototype.setTimeoutDelay = function(delay, unit) {};

/**
 * In a derived class, cancels a timeout.
 */
FireplaceInterface.prototype.cancelTimeout = function() {};

/**
 * In a derived class, shutdown the fireplace.
 */
FireplaceInterface.prototype.shutdown = function() {};

/**
 * The name of the state change event.
 * @type {String}
 * @const
 */
FireplaceInterface.EVENT_STATE_CHANGED = "fireplaceStateChangedEvent";

/**
 * The name of the pilot light state change event.
 * @type {String}
 * @const
 */
FireplaceInterface.EVENT_PILOT_LIGHT_STATE_CHANGED = "fireplacePilotStateChangedEvent";

/**
 * The name of the operation timeout event.
 * @type {String}
 * @const
 */
FireplaceInterface.EVENT_OPERATION_TIMEOUT = "fireplaceOperationTimeoutEvent";

module.exports = FireplaceInterface;
