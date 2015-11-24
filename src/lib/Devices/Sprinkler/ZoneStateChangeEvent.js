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
* @param {Boolean} oldState The previous state. Set true if the old state was on.
* @param {Boolean} newState The current state. Set true if the new state is on.
* @param {Number} zone      Gets the zone that changed state.
* @constructor
* @event
*/
function ZoneStateChangeEvent(oldState, newState, zone) {
	var _oldState = oldState;
	if (util.isNullOrUndefined(_oldState)) {
		_oldState = false;
	}

	var _newState = newState;
	if (util.isNullOrUndefined(_newState)) {
		_newState = false;
	}

	var _zone = zone;
	if (util.isNullOrUndefined(_zone)) {
		_zone = -1;
	}

	/**
	* Gets the previous state of the zone.
	* @return {Boolean} true if the old state was on; Otherwise, false.
	*/
	this.getOldState = function() {
		return _oldState;
	};

	/**
	* Gets the current state of the zone.
	* @return {Boolean} true if the current stat is on; Otherwise, false.
	*/
	this.getNewState = function() {
		return _newState;
	};

	/**
	* Gets the zone that changed state.
	* @return {Number} The zone number of the changing zone.
	*/
	this.getZone = function() {
		return _zone;
	};
}

ZoneStateChangeEvent.prototype.constructor = ZoneStateChangeEvent;
module.exports = ZoneStateChangeEvent;
