"use strict";
//
//  Opener.js
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
var OpenerState = require('./OpenerState.js');

/**
 * Opener device abstraction interface.
 * @interface
 * @extends {Device}
 */
function Opener() {
  Device.call(this);
}

Opener.prototype.constructor = Opener;
inherits(Opener, Device);

/**
 * In a derived class, raises the opener state change event.
 * @param  {OpenerStateChangeEvent} stateChangeEvent The event object.
 */
Opener.prototype.onOpenerStateChange = function(stateChangeEvent) {};

/**
 * In a derived class, raises the lock state change event.
 * @param  {OpenerLockChangeEvent} lockStateChangeEvent The event object.
 */
Opener.prototype.onLockStateChange = function(lockStateChangeEvent) {};

/**
 * In a derived class, gets a value indicating whether this opener is open.
 * @return {Boolean} true if open; Otherwise, false.
 */
Opener.prototype.isOpen = function() { return false; };

/**
 * In a derived class, gets a value indicating whether this opner is in the the
 * process of opening.
 * @return {Boolean} true if opening; Otherwise, false.
 */
Opener.prototype.isOpening = function() { return false; };

/**
 * In a derived class, gets a value indicating whether this opener is closed.
 * @return {Boolean} true if closed; Otherwise, false.
 */
Opener.prototype.isClosed = function() { return false; };

/**
 * In a derived class, gets a value indicating whether this opener is in the
 * process of closing.
 * @return {Boolean} true if closing; Otherwise, false.
 */
Opener.prototype.isClosing = function() { return false; };

/**
 * In a derived class, Gets the state of this opener.
 * @return {OpenerState} The state of the opener.
 */
Opener.prototype.getState = function() { return OpenerState.Closed; };

/**
 * In a derived class, gets a value indicating whether this opener is locked and
 * thus, cannot be opened.
 * @return {Boolean} true if locked; Otherwise, false.
 */
Opener.prototype.isLocked = function() { return false; };

/**
 * In a derived class, instructs the device to open.
 * @throws {ObjectDisposedException} if this instance has been disposed.
 */
Opener.prototype.open = function() {};

/**
 * In a derived class, instructs the device to close.
 * @throws {ObjectDisposedException} if this instance has been disposed.
 */
Opener.prototype.close = function() {};

/**
 * The name of the opener state change event.
 * @type {String}
 * @const
 */
Opener.EVENT_STATE_CHANGED = "openerStateChangedEvent";

/**
 * The name of the opener lock state change event.
 * @type {String}
 * @const
 */
Opener.EVENT_LOCK_STATE_CHANGED = "lockStateChangedEvent";

module.exports = Opener;
