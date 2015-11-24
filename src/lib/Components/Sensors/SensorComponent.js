"use strict";
//
//  SensorComponent.js
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
var SensorBase = require('./SensorBase.js');
var SensorState = require('./SensorState.js');
var SensorStateChangeEvent = require('./SensorStateChangeEvent.js');
var PinState = require('../../IO/PinState.js');
var PinMode = require('../../IO/PinMode.js');
var ObjectDisposedException = require('../../ObjectDisposedException.js');
var InvalidOperationException = require('../../InvalidOperationException.js');

/**
 * @classdesc A component that is an abstraction of a sensor device. This is an
 * implementation of SensorBase.
 * @param {Gpio} pin The input pin to sample the sensor data from.
 * @throws {ArgumentNullException} if pin is null or undefined.
 * @constructor
 * @extends {SensorBase}
 */
function SensorComponent(pin) {
  SensorBase.call(this, pin);

  var OPEN_STATE = PinState.Low;
  var self = this;
  var _base = new SensorBase(pin);
  var _isPolling = false;
  var _controlTimer = null;
  var _lastState = SensorState.Open;

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
    _base.emit(evt, args);
  };

  /**
   * Gets the state of the sensor.
   * @return {SensorState} The state of the sensor.
   */
  this.getState = function() {
    if (_base.getPin().state() === OPEN_STATE) {
      return SensorState.Open;
    }
    return SensorState.Closed;
  };

  /**
   * Checks to see if the sensor is in the specified state.
   * @param  {SensorState} state The state to check.
   * @return {Boolean}       true if the sensor is in the specified state;
   * Otherwise, false.
   * @override
   */
  this.isState = function(state) {
    return (self.getState() === state);
  };

  /**
   * Gets a value indicating whether this sensor is open.
   * @return {Boolean} true if open; Otherwise, false.
   * @override
   */
  this.isOpen = function() {
    return self.isState(SensorState.Open);
  };

  /**
   * Gets a value indicating whether this sensor is closed.
   * @return {Boolean} true if closed; Otherwise, false.
   * @override
   */
  this.isClosed = function() {
    return self.isState(SensorState.Closed);
  };

  /**
   * Gets the pin being used to sample sensor data.
   * @return {Gpio} The pin being used to sample sensor data.
   */
  this.getPin = function() {
    return _base.getPin();
  };

  /**
   * Fires the sensor state change event.
   * @param  {SensorStateChangeEvent} stateChangeEvent The state change event
   * object.
   * @override
   */
  this.onSensorStateChange = function(stateChangeEvent) {
    _base.onSensorStateChange(stateChangeEvent);
  };

  /**
   * Executes the poll cycle.
   * @private
   */
  var executePoll = function() {
    if (_isPolling) {
      var newState = self.getState();
      if (newState !== _lastState) {
        var oldState = _lastState;
        _lastState = newState;
        var evt = new SensorStateChangeEvent(self, oldState, newState);
        _base.onSensorStateChange(evt);
      }
    }
  };

  /**
   * Executes the poll cycle in the background asynchronously.
   * @private
   */
  var backgroundExecutePoll = function() {
    if (!_isPolling) {
      _isPolling = true;
      _controlTimer = setInterval(executePoll, 200);
    }
  };

  /**
   * Polls the input pin status every 500ms until stopped. IMPORTANT:
   * poll cycles occur at 200ms intervals. If you attach a poll event handler,
   * make sure you do not call interruptPoll() before the first interval elapses
   * or the event may never fire which could lead to a permanent wait state. It
   * is recommended to use the setTimeout() function (or equivalent) with a
   * timeout value > 200 to call the interruptPoll() method.
   */
  this.poll = function() {
    if (_base.isDisposed()) {
      throw new ObjectDisposedException('SensorComponent');
    }

    if (_base.getPin().mode() !== PinMode.IN) {
      throw new InvalidOperationException("The specified pin is not configured" +
                  " as an input pin, which is required to read sensor data.");
    }

    if (_isPolling) {
      return;
    }
    backgroundExecutePoll();
  };

  /**
   * Interrupts the poll cycle.
   */
  this.interruptPoll = function() {
    if (_isPolling) {
      if (util.isNullOrUndefined(_controlTimer)) {
        clearInterval(_controlTimer);
        _controlTimer = null;
      }
      _isPolling = false;
    }
  };

  /**
   * Checks to see if this instance is currently polling.
   * @return {Boolean} true if polling; Otherwise, false.
   */
  this.isPolling = function() {
    return _isPolling;
  };

  /**
   * Releases all resources used by the SensorComponent object.
   * @override
   */
  this.dispose = function() {
    if (_base.isDisposed()) {
      return;
    }

    self.interruptPoll();
    self.removeAllListeners();
    _base.dispose();
  };

  /**
   * Converts the current instance to it's string representation. This method
   * simply returns the component name.
   * @return {String} The component name.
   * @override
   */
  this.toString = function() {
    return self.componentName;
  };
}

SensorComponent.prototype.constructor = SensorComponent;
inherits(SensorComponent, SensorBase);

module.exports = SensorComponent;
