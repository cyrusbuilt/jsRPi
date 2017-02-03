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

const Device = require('../Device.js');
const OpenerState = require('./OpenerState.js');

const STATE_CHANGED = "openerStateChangedEvent";
const LOCK_STATE_CHANGED = "lockStateChangedEvent";

/**
 * Opener device abstraction interface.
 * @interface
 * @extends {Device}
 */
class Opener extends Device {
  /**
   * Initializes a new instance of the jsrpi.Devices.Access.Opener interface.
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * In a derived class, raises the opener state change event.
   * @param  {OpenerStateChangeEvent} stateChangeEvent The event object.
   */
  onOpenerStateChange(stateChangeEvent) {}

  /**
   * In a derived class, raises the lock state change event.
   * @param  {OpenerLockChangeEvent} lockStateChangeEvent The event object.
   */
  onLockStateChange(lockStateChangeEvent) {}

  /**
   * In a derived class, gets a value indicating whether this opener is open.
   * @property {Boolean} isOpen - true if open; Otherwise, false.
   * @readonly
   */
  get isOpen() { return false; }

  /**
   * In a derived class, gets a value indicating whether this opner is in the the
   * process of opening.
   * @property {Boolean} isOpening - true if opening; Otherwise, false.
   * @readonly
   */
  get isOpening() { return false; }

  /**
   * In a derived class, gets a value indicating whether this opener is closed.
   * @property {Boolean} isClosed - true if closed; Otherwise, false.
   * @readonly
   */
  get isClosed() { return false; }

  /**
   * In a derived class, gets a value indicating whether this opener is in the
   * process of closing.
   * @property {Boolean} isClosing - true if closing; Otherwise, false.
   * @readonly
   */
  get isClosing() { return false; }

  /**
   * In a derived class, Gets the state of this opener.
   * @property {OpenerState} state - The opener state.
   */
  get state() { return OpenerState.Closed; }

  /**
   * In a derived class, gets a value indicating whether this opener is locked and
   * thus, cannot be opened.
   * @property {Boolean} isLocked - true if locked; Otherwise, false.
   * @readonly
   */
  get isLocked() { return false; }

  /**
   * In a derived class, instructs the device to open.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  open() {}

  /**
   * In a derived class, instructs the device to close.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  close() {}

  /**
   * The name of the opener state change event.
   * @type {String}
   * @const
   */
  static get EVENT_STATE_CHANGED() { return STATE_CHANGED; }

  /**
   * The name of the opener lock state change event.
   * @type {String}
   * @const
   */
  static get EVENT_LOCK_STATE_CHANGED() { return LOCK_STATE_CHANGED; }
}

module.exports = Opener;
