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
var DimmableLight = require('./DimmableLight.js');
var ComponentBase = require('../ComponentBase.js');
var EventEmitter = require('events').EventEmitter;
var Light = require('./Light.js');
var ObjectDisposedException = require('../../ObjectDisposedException.js');

/**
 * @classdesc Base class for dimmable light component abstractions.
 * @constructor
 * @implements {DimmableLight}
 * @extends {ComponentBase}
 * @extends {EventEmitter}
 */
function DimmableLightBase() {
  DimmableLight.call(this);

  var self = this;
  var _base = new ComponentBase();
  var _emitter = new EventEmitter();

  /**
   * Component name property.
   * @property {String}
   */
  this.componentName = _base.componentName;

  /**
   * Tag property.
   * @property {Object}
   */
  this.tag = _base.tag;

  /**
   * Gets the property collection.
   * @return {Array} A custom property collection.
   * @override
   */
  this.getPropertyCollection = function() {
    return _base.getPropertyCollection();
  };

  /**
   * Checks to see if the property collection contains the specified key.
   * @param  {String} key The key name of the property to check for.
   * @return {Boolean}    true if the property collection contains the key;
   * Otherwise, false.
   * @override
   */
  this.hasProperty = function(key) {
    return _base.hasProperty(key);
  };

  /**
   * Sets the value of the specified property. If the property does not already exist
	 * in the property collection, it will be added.
   * @param  {String} key   The property name (key).
   * @param  {String} value The value to assign to the property.
   */
  this.setProperty = function(key, value) {
    _base.setProperty(key, value);
  };

  /**
   * Determines whether or not this instance has been disposed.
   * @return {Boolean} true if disposed; Otherwise, false.
   * @override
   */
  this.isDisposed = function() {
    return _base.isDisposed();
  };

  /**
   * Releases all resources used by the GpioBase object.
   * @override
   */
  this.dispose = function() {
    if (_base.isDisposed()) {
      return;
    }

    _emitter.removeAllListeners();
    _emitter = undefined;
    _base.dispose();
  };

  /**
   * Removes all event listeners.
   * @override
   */
  this.removeAllListeners = function() {
    if (!_base.isDisposed()) {
      _emitter.removeAllListeners();
    }
  };

  /**
   * Attaches a listener (callback) for the specified event name.
   * @param  {String}   evt      The name of the event.
   * @param  {Function} callback The callback function to execute when the
   * event is raised.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @override
   */
  this.on = function(evt, callback) {
    if (_base.isDisposed()) {
      throw new ObjectDisposedException("DimmableLightBase");
    }
    _emitter.on(evt, callback);
  };

  /**
   * Emits the specified event.
   * @param  {String} evt  The name of the event to emit.
   * @param  {Object} args The object that provides arguments to the event.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @override
   */
  this.emit = function(evt, args) {
    if (_base.isDisposed()) {
      throw new ObjectDisposedException("DimmableLightBase");
    }
    _emitter.emit(evt, args);
  };

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
    if (_base.isDisposed()) {
      throw new ObjectDisposedException("DimmableLightBase");
    }

    var e = _emitter;
    var evt = lightChangeEvent;
    process.nextTick(function() {
      e.emit(Light.EVENT_STATE_CHANGED, evt);
    }.bind(this));
  };

  /**
   * Raises the light level changed event.
   * @param  {LightlevelChangeEvent} levelChangeEvent The level change event
   * object.
   * @override
   */
  this.onLightLevelChanged = function(levelChangeEvent) {
    if (_base.isDisposed()) {
      throw new ObjectDisposedException("DimmableLightBase");
    }

    var e = _emitter;
    var evt = levelChangeEvent;
    process.nextTick(function() {
      e.emit(Light.EVENT_LEVEL_CHANGED, evt);
    }.bind(this));
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
module.exports = DimmableLightBase;
