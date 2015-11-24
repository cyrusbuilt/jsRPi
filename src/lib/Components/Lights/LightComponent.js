"use strict";

//
//  LightComponent.js
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
var LightBase = require('./LightBase.js');
var PinState = require('../../IO/PinState.js');
var PinMode = require('../../IO/PinMode.js');
var LightStateChangeEvent = require('./LightStateChangeEvent.js');
var ArgumentNullException = require('../../ArgumentNullException.js');
var InvalidOperationException = require('../../InvalidOperationException.js');
var ObjectDisposedException = require('../../ObjectDisposedException.js');

var ON_STATE = PinState.High;
var OFF_STATE = PinState.Low;

/**
 * @classdesc A component that is an abstraction of a light.
 * @param {Gpio} pin The output pin the light is wired to.
 * @throws {ArgumentNullException} if pin is null or undefined.
 * @constructor
 * @extends {LightBase}
 */
function LightComponent(pin) {
  LightBase.call(this);

  if (util.isNullOrUndefined(pin)) {
    throw new ArgumentNullException("'pin' param cannot be null or undefined.");
  }

  var self = this;
  var _base = new LightBase();
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
      throw new ObjectDisposedException("LightComponent");
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
      throw new ObjectDisposedException("LightComponent");
    }
    _base.emit(evt, args);
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
   * Gets a value indicating whether this light is on.
   * @return {Boolean} true if the light is on; Otherwise, false.
   * @override
   */
  this.isOn = function() {
    return (_pin.state() === ON_STATE);
  };

  /**
   * Switches the light on.
   * @override
   */
  this.turnOn = function() {
    if (_pin.mode() !== PinMode.OUT) {
      throw new InvalidOperationException("Pin is not configured as an output pin.");
    }

    if (_pin.state() !== ON_STATE) {
      _pin.write(PinState.High);
      _base.onLightStateChange(new LightStateChangeEvent(true));
    }
  };

  /**
   * Switches the light off.
   * @override
   */
  this.turnOff = function() {
    if (_pin.mode() !== PinMode.OUT) {
      throw new InvalidOperationException("Pin is not configured as an output pin.");
    }

    if (_pin.state() !== OFF_STATE) {
      _pin.write(PinState.Low);
      _base.onLightStateChange(new LightStateChangeEvent(false));
    }
  };
 }

LightComponent.prototype.constructor = LightComponent;
inherits(LightComponent, LightBase);

module.exports = LightComponent;
