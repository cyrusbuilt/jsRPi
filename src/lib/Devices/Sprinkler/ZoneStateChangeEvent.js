"use strict";
//
//  ZoneStateChangeEvent.js
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


var util = require('util');

/**
* The event that gets raised when a sprinkler zone changes state.
* @event
*/
class ZoneStateChangeEvent {
	/**
	 * Initializes a new instance of the jsrpi.Devices.Sprinkler.ZoneStateChangeEvent
	 * class with the zone and new and old states.
	 * @param {Boolean} oldState The previous state. Set true if the old state was on.
	 * @param {Boolean} newState The current state. Set true if the new state is on.
	 * @param {Number} zone      Gets the zone that changed state.
	 * @constructor
	 */
	constructor(oldState, newState, zone) {
		this._oldState = oldState;
		if (util.isNullOrUndefined(this._oldState)) {
			this._oldState = false;
		}

		this._newState = newState;
		if (util.isNullOrUndefined(this._newState)) {
			this._newState = false;
		}

		this._zone = zone;
		if (util.isNullOrUndefined(this._zone)) {
			this._zone = -1;
		}
	}

	/**
	* Gets the previous state of the zone.
	* @property {Boolean} oldState - true if the old state was on; Otherwise,
	* false.
	* @readonly
	*/
	get oldState() {
		return this._oldState;
	}

	/**
	* Gets the current state of the zone.
	* @property {Boolean} newState - true if the current stat is on; Otherwise,
	* false.
	* @readonly
	*/
	get newState() {
		return this._newState;
	}

	/**
	* Gets the zone that changed state.
	* @property {Number} zone - The zone number of the changing zone.
	* @readonly
	*/
	get zone() {
		return this._zone;
	}
}

module.exports = ZoneStateChangeEvent;
