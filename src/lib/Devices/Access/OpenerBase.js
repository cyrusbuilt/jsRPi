"use strict";
//
//  OpenerBase.js
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
var extend = require('extend');
var Opener = require('./Opener.js');
var DeviceBase = require('../DeviceBase.js');
var EventEmitter = require('events').EventEmitter;
var OpenerStateChangeEvent = require('./OpenerStateChangeEvent.js');
var OpenerLockChangeEvent = require('./OpenerLockChangeEvent.js');
var OpenerState = require('./OpenerState.js');

/**
 * @classdesc Base class for opener device abstractions.
 * @constructor
 * @implements {Opener}
 * @extends {DeviceBase}
 * @extends {EventEmitter}
 */
function OpenerBase() {
  Opener.call(this);
  DeviceBase.call(this);
  EventEmitter.call(this);
  var self = this;

  /**
   * Raises the opener state change event.
   * @param  {OpenerStateChangeEvent} stateChangeEvent The event object.
   * @override
   */
  this.onOpenerStateChange = function(stateChangeEvent) {
    process.nextTick(function() {
      self.emit(Opener.EVENT_STATE_CHANGED, stateChangeEvent);
    });
  };

  /**
   * Raises the lock state change event.
   * @param  {OpenerLockChangeEvent} lockStateChangeEvent The event object.
   * @override
   */
  this.onLockStateChange = function(lockStateChangeEvent) {
    process.nextTick(function() {
      self.emit(Opener.EVENT_LOCK_STATE_CHANGED, lockStateChangeEvent);
    });
  };

  /**
   * Gets a value indicating whether this opener is open.
   * @return {Boolean} true if open; Otherwise, false.
   * @override
   */
  this.isOpen = function() {
    return (self.getState() === OpenerState.Open);
  };

  /**
   * Fets a value indicating whether this opner is in the the process of opening.
   * @return {Boolean} true if opening; Otherwise, false.
   * @override
   */
  this.isOpening = function() {
    return (self.getState() === OpenerState.Opening);
  };

  /**
   * Fets a value indicating whether this opener is closed.
   * @return {Boolean} true if closed; Otherwise, false.
   * @override
   */
  this.isClosed = function() {
    return (self.getState() === OpenerState.Closed);
  };

  /**
   * Fets a value indicating whether this opener is in the process of closing.
   * @return {Boolean} true if closing; Otherwise, false.
   * @override
   */
  this.isClosing = function() {
    return (self.getState() === OpenerState.Closing);
  };
}

OpenerBase.prototype.constructor = OpenerBase;
inherits(OpenerBase, Opener);

module.exports = extend(true, OpenerBase, DeviceBase, EventEmitter);
