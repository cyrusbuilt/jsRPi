"use strict";
//
//  OpenerLockChangeEvent.js
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
 * @classdesc The event that gets raised when an opener lock changes state.
 * @param {Boolean} locked Set true if locked.
 * @constructor
 * @event
 */
function OpenerLockChangeEvent(locked) {
  	var _isLocked = locked;
	if (util.isNullOrUndefined(_isLocked)) {
		_isLocked = false;
	}

  	/**
    * Gets a flag indicating whether or not the opener is locked.
    * @return {Boolean} true if locked; Otherwise, false.
    */
  	this.isLocked = function() {
    	return _isLocked;
  	};
}

OpenerLockChangeEvent.prototype.constructor = OpenerLockChangeEvent;
module.exports = OpenerLockChangeEvent;
