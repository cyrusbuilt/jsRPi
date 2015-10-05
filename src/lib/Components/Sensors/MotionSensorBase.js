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
var extend = require('extend');
var MotionSensor = require('./MotionSensor.js');
var ComponentBase = require('../ComponentBase.js');
var EventEmitter = require('events').EventEmitter;
var ArgumentNullException = require('../../ArgumentNullException.js');

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
  ComponentBase.call(this);
  EventEmitter.call(this);

  if (util.isNullOrUndefined(pin)) {
    throw new ArgumentNullException("'pin' cannot be null or undefined.");
  }

  var self = this;
  var _lastMotion = null;
  var _lastInactive = null;
  var _pin = pin;
  _pin.provision();

  /**
   * Releases all resources used by the MotionSensorBase object.
   * @override
   */
  this.dispose = function() {
    if (ComponentBase.prototype.isDisposed.call(this)) {
      return;
    }

    if (!util.isNullOrUndefined(_pin)) {
      _pin.dispose();
      _pin = undefined;
    }

    ComponentBase.prototype.dispose.call(this);
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
    return ComponentBase.prototype.componentName;
  };

  /**
   * Fires the motion state changed event.
   * @param  {MotionDetectedEvent} motionEvent The motion detected event object.
   * @override
   */
  this.onMotionStateChanged = function(motionDetectedEvent) {
    if (motionDetectedEvent.isMotionDetected()) {
      _lastMotion = new Date();
    }
    else {
      _lastInactive = new Date();
    }

    process.nextTick(function() {
      self.emit(MotionSensor.EVENT_MOTION_STATE_CHANGED, motionDetectedEvent);
    });
  };
}

MotionSensorBase.prototype.constructor = MotionSensorBase;
inherits(MotionSensorBase, MotionSensor);

module.exports = extend(true, MotionSensorBase, ComponentBase, EventEmitter);
