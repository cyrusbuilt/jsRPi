"use strict";

//
//  SwitchBase.js
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
var Switch = require('./Switch.js');
var ComponentBase = require('../ComponentBase.js');
var EventEmitter = require('util').EventEmitter;
var SwitchState = require('./SwitchState.js');

/**
 * @classdesc Base class for switch component abstractions.
 * @constructor
 * @implements {Switch}
 * @extends {ComponentBase}
 * @extends {EventEmitter}
 */
function SwitchBase() {
  Switch.call(this);
  ComponentBase.call(this);
  EventEmitter.call(this);
  var self = this;

  /**
   * Fires the switch state change event.
   * @param  {SwitchStateChangeEvent} switchStateEvent The event info object.
   * @override
   */
  this.onSwitchStateChanged = function(switchStateEvent) {
    process.nextTick(function() {
      self.emit(Switch.EVENT_STATE_CHANGED, switchStateEvent);
    });
  };

  /**
   * Gets whether or not this switch is in the specified state.
   * @param  {SwitchState} state The state to check against.
   * @return {Boolean}       true if this switch is in the specified state;
   * Otherwise, false.
   * @override
   */
  this.isState = function(state) {
    return (self.getState() === state);
  };

  /**
   * Gets whether or not this switch is in the on position.
   * @return {Boolean} true if on; Otherwise, false.
   * @override
   */
  this.isOn = function() {
    return self.isState(SwitchState.On);
  };

  /**
   * Gets whether or not this switch is in the off position.
   * @return {Boolean} true if off; Otherwise, false.
   * @override
   */
  this.isOff = function() {
    return self.isState(SwitchState.Off);
  };
}

SwitchBase.prototype.constructor = SwitchBase;
inherits(SwitchBase, Switch);

module.exports = extend(true, SwitchBase, ComponentBase, EventEmitter);
