"use strict";

//
//  LEDBase.js
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
var LEDInterface  = require('./LEDInterface.js');
var ComponentBase = require('../ComponentBase.js');
var EventEmitter = require('events').EventEmitter;
var Light = require('./Light.js');

/**
 * @classdesc Base class for LED component abstractions.
 * @constructor
 * @implements {LEDInterface}
 * @extends {ComponentBase}
 */
function LEDBase() {
  LEDInterface.call(this);
  ComponentBase.call(this);
  EventEmitter.call(this);
  var self = this;

  /**
   * Gets a value indicating whether this light is off.
   * @return {Boolean} true if the light is off; Otherwise, false.
   * @override
   */
  this.isOff = function() {
    return !self.isOn();
  };

  /**
   * Fires the light state change event.
   * @param  {LightStateChangeEvent} lightChangeEvent The state change event
   * object.
   * @override
   */
  this.onLightStateChange = function(lightChangeEvent) {
    process.nextTick(function() {
      self.emit(Light.LIGHT_STATE_CHANGED, lightChangeEvent);
    });
  };

  /**
   * Toggles the state of the LED.
   * @override
   */
  this.toggle = function() {
    if (self.isOn()) {
      self.turnOff();
    }
    else {
      self.turnOn();
    }
  };
}

LEDBase.prototype.constructor = LEDBase;
inherits(LEDBase, LEDInterface);

module.exports = extend(true, LEDBase, ComponentBase, EventEmitter);
