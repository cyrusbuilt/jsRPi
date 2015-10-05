"use strict";

//
//  PowerBase.js
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
var PowerInterface = require('./PowerInterface.js');
var PowerState = require('./PowerState.js');
var ComponentBase = require('../ComponentBase.js');
var EventEmitter = require('util').EventEmitter;

/**
 * @classdesc Base class for power control device abstraction components.
 * @constructor
 * @implements {PowerInterface}
 * @extends {ComponentBase}
 * @extends {EventEmitter}
 */
function PowerBase() {
  PowerInterface.call(this);
  ComponentBase.call(this);
  EventEmitter.call(this);
  var self = this;

  /**
   * Fires the power state changed event.
   * @param  {PowerStateChangeEvent} stateChangeEvent The event info object.
   * @override
   */
  this.onPowerStateChanged = function(stateChangeEvent) {
    process.nextTick(function() {
      self.emit(PowerInterface.EVENT_STATE_CHANGED, stateChangeEvent);
    });
  };

  /**
   * Checks to see if the component is on.
   * @return {Boolean} true if on; Otherwise, false.
   * @override
   */
  this.isOn = function() {
    return (self.getState() === PowerState.On);
  };

  /**
   * Checks to see if the component is off.
   * @return {Boolean} true if off; Otherwise, false.
   * @override
   */
  this.isOff = function() {
    return (self.getState() === PowerState.Off);
  };

  /**
   * Turns the component on.
   * @override
   */
  this.turnOn = function() {
    self.setState(PowerState.On);
  };

  /**
   * Turns the component off.
   * @override
   */
  this.turnOff = function() {
    self.setState(PowerState.Off);
  };
}

PowerBase.prototype.constructor = PowerBase;
inherits(PowerBase, PowerInterface);

module.exports = extend(true, PowerBase, ComponentBase, EventEmitter);
