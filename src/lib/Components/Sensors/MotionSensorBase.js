"use strict";
//
//  MotionSensorBase.js
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
var MotionSensor = require('./MotionSensor.js');
var ComponentBase = require('../ComponentBase.js');
var EventEmitter = require('events').EventEmitter;
var ArgumentNullException = require('../../ArgumentNullException.js');
var ObjectDisposedException = require('../../ObjectDisposedException.js');

/**
 * @classdesc Base class for motion sensor abstraction components.
 * @param {Gpio} pin The input pin to check for motion on.
 * @throws {ArgumentNullException} if pin is null or undefined.
 * @constructor
 * @implements {MotionSensor}
 * @extends {ComponentBase}
 * @extends {EventEmitter}
 */
function MotionSensorBase(pin) {
  MotionSensor.call(this);

  if (util.isNullOrUndefined(pin)) {
    throw new ArgumentNullException("'pin' cannot be null or undefined.");
  }

  var self = this;
  var _base = new ComponentBase();
  var _emitter = new EventEmitter();
  var _lastMotion = null;
  var _lastInactive = null;
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
   * Removes all event listeners.
   * @override
   */
  this.removeAllListeners = function() {
    if (!_base.isDisposed()) {
      _emitter.removeAllListeners();
    }
  };

  /**
   * Releases all resources used by the MotionSensorBase object.
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

    _emitter.removeAllListeners();
    _emitter = undefined;
    _base.dispose();
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
      throw new ObjectDisposedException("MotionSensorBase");
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
      throw new ObjectDisposedException("MotionSensorBase");
    }
    _emitter.emit(evt, args);
  };

  /**
   * gets the timestamp of the last time motion was detected.
   * @return {Date} The last motion timestamp.
   * @override
   */
  this.getLastMotionTimestamp = function() {
    return _lastMotion;
  };

  /**
   * The last inactivity timestamp.
   * @return {Date} The last inactivity timestamp.
   * @override
   */
  this.getLastInactivityTimestamp = function() {
    return _lastInactive;
  };

  /**
   * Gets the pin being used to sample sensor data.
   * @return {Gpio} The pin being used to sample sensor data.
   */
  this.getPin = function() {
    return _pin;
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

  /**
   * Fires the motion state changed event.
   * @param  {MotionDetectedEvent} motionEvent The motion detected event object.
   * @override
   */
  this.onMotionStateChanged = function(motionDetectedEvent) {
    if (_base.isDisposed()) {
      throw new ObjectDisposedException("MotionSensorBase");
    }

    if (motionDetectedEvent.isMotionDetected()) {
      _lastMotion = new Date();
    }
    else {
      _lastInactive = new Date();
    }

    var e = _emitter;
    var evt = motionDetectedEvent;
    process.nextTick(function() {
      e.emit(MotionSensor.EVENT_MOTION_STATE_CHANGED, evt);
    }.bind(this));
  };
}

MotionSensorBase.prototype.constructor = MotionSensorBase;
inherits(MotionSensorBase, MotionSensor);

module.exports = MotionSensorBase;
