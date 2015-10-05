"use strict";

//
//  DimmableLightBase.js
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
var DimmableLight = require('./DimmableLight.js');
var ComponentBase = require('../ComponentBase.js');
var EventEmitter = require('events').EventEmitter;
var Light = require('./Light.js');

/**
 * @classdesc Base class for dimmable light component abstractions.
 * @constructor
 * @implements {DimmableLight}
 * @extends {ComponentBase}
 * @extends {EventEmitter}
 */
function DimmableLightBase() {
  DimmableLight.call(this);
  ComponentBase.call(this);
  EventEmitter.call(this);
  var self = this;

  /**
   * Gets a value indicating whether this light is on.
   * @return {Boolean} true if the light is on; Otherwise, false.
   * @override
   */
  this.isOn = function() {
    return (self.getLevel() > self.minLevel());
  };

  /**
   * Gets a value indicating whether this light is off.
   * @return {Boolean} true if the light is off; Otherwise, false.
   * @override
   */
  this.isOff = function() {
    return (self.getLevel() <= self.minLevel());
  };

  /**
   * Switches the light on.
   * @override
   */
  this.turnOn = function() {
    self.setLevel(self.maxLevel());
  };

  /**
   * Switches the light off.
   * @override
   */
  this.turnOff = function() {
    self.setLevel(self.minLevel());
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
   * Raises the light level changed event.
   * @param  {LightlevelChangeEvent} levelChangeEvent The level change event
   * object.
   * @override
   */
  this.onLightLevelChanged = function(levelChangeEvent) {
    process.nextTick(function() {
      self.emit(Light.LIGHT_LEVEL_CHANGED, levelChangeEvent);
    });
  };

  /**
   * Gets the current brightness level percentage.
   * @param  {Number} level The brightness level.
   * @return {Number}       The brightness percentage level.
   * @override
   */
  this.getLevelPercentage = function(level) {
    level = level || self.getLevel();
    var min = Math.min(self.minLevel(), self.maxLevel());
    var max = Math.max(self.minLevel(), self.maxLevel());
    var range = (max - min);
    var percentage = ((level * 100) / range);
    return percentage;
  };
}

DimmableLightBase.prototype.constructor = DimmableLightBase;
inherits(DimmableLightBase, DimmableLight);
module.exports = extend(true, DimmableLightBase, ComponentBase, EventEmitter);
