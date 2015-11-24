"use strict";
//
//  FireplaceStateChangedEvent.js
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
var FireplaceState = require('./FireplaceState.js');

/**
 * @classdesc The event that gets raised when the fireplace changes state.
 * @param {FireplaceState} oldState The previous state.
 * @param {FireplaceState} newState The current state.
 * @constructor
 * @event
 */
function FireplaceStateChangedEvent(oldState, newState) {
  	var _oldState = oldState;
	if (util.isNullOrUndefined(_oldState)) {
		_oldState = FireplaceState.Off;
	}
	
  	var _newState = newState;
	if (util.isNullOrUndefined(_newState)) {
		_newState = FireplaceState.Off;
	}

  	/**
    * Gets the previous state.
    * @return {FireplaceState} The previous state.
    */
  	this.getOldState = function() {
    	return _oldState;
  	};

  	/**
    * Gets the current state.
    * @return {FireplaceState} The current state.
    */
  	this.getNewState = function() {
    	return _newState;
  	};
}

FireplaceStateChangedEvent.prototype.constructor = FireplaceStateChangedEvent;
module.exports = FireplaceStateChangedEvent;
