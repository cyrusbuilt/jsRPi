"use strict";

//
//  DimmableLightComponent.js
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
var inherits = require('util').inherits;
var DimmableLightBase = require('./DimmableLightBase.js');
var ArgumentNullException = require('../../ArgumentNullException.js');
var LightLevelChangeEvent = require('./LightLevelChangeEvent.js');
var LightStateChangeEvent = require('./LightStateChangeEvent.js');
var ObjectDisposedException = require('../../ObjectDisposedException.js');

/**
 * @classdesc A component that is an abstraction of a dimmable light.
 * @param {Gpio} pin The pin used to control the dimmable light.
 * @param {Number} min The minimum brightness level.
 * @param {Number} max The maximum brightness level.
 * @throws {ArgumentNullException} if the pin param is null or undefined.
 * @constructor
 * @extends {DimmableLightBase}
 */
function DimmableLightComponent(pin, min, max) {
  DimmableLightBase.call(this);

  if (util.isNullOrUndefined(pin)) {
    throw new ArgumentNullException("'pin' param cannot be null or undefined.");
  }

  var self = this;
  var _base = new DimmableLightBase();
  var _min = min || 0;
  var _max = max || 0;
  var _pin = pin;
  _pin.provision();

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

    if (!util.isNullOrUndefined(_pin)) {
      _pin.dispose();
      _pin = undefined;
    }

    _base.removeAllListeners();
    _base.dispose();
  };

  /**
   * Removes all event listeners.
   * @override
   */
  this.removeAllListeners = function() {
    if (!_base.isDisposed()) {
      _base.removeAllListeners();
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
      throw new ObjectDisposedException("DimmableLightComponent");
    }
    _base.on(evt, callback);
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
      throw new ObjectDisposedException("DimmableLightComponent");
    }
    _base.emit(evt, args);
  };

  /**
   * Gets the minimum brightness level.
   * @return {Number} The minimum brightness level.
   * @override
   */
  this.minLevel = function() {
    return _min;
  };

  /**
   * Gets the maximum brightness level.
   * @return {Number} The max brightness level.
   * @override
   */
  this.maxLevel = function() {
    return _max;
  };

  /**
   * Gets the brightness level.
   * @return {Number} The brightness level.
   * @override
   */
  this.getLevel = function() {
    return _pin.getPWM();
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
   * Sets the brightness level.
   * @param  {Number} level The brightness level.
   * @throws {RangeError} if the specified level is less than minLevel() or
   * greater than maxLevel().
   * @override
   */
  this.setLevel = function(level) {
    if (level < _min) {
      throw new RangeError("Level cannot be less than minLevel.");
    }

    if (level > _max) {
      throw new RangeError("Level cannot be more than maxLevel.");
    }

    var isOnBeforeChange = self.isOn();
    _pin.setPWM(level);
    var isOnAfterChange = self.isOn();
    _base.onLightLevelChanged(new LightLevelChangeEvent(level));
    if (isOnBeforeChange !== isOnAfterChange) {
      _base.onLightStateChange(new LightStateChangeEvent(isOnAfterChange));
    }
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
    _base.onLightStateChange(lightChangeEvent);
  };

  /**
   * Raises the light level changed event.
   * @param  {LightlevelChangeEvent} levelChangeEvent The level change event
   * object.
   * @override
   */
  this.onLightLevelChanged = function(levelChangeEvent) {
    _base.onLightLevelChanged(levelChangeEvent);
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

DimmableLightComponent.prototype.constructor = DimmableLightComponent;
inherits(DimmableLightComponent, DimmableLightBase);

module.exports = DimmableLightComponent;
