"use strict";
//
//  SensorBase.js
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
var Sensor = require('./Sensor.js');
var SensorState = require('./SensorState.js');
var ComponentBase = require('../ComponentBase.js');
var EventEmitter = require('events').EventEmitter;
var ArgumentNullException = require('../../ArgumentNullException.js');

/**
 * @classdesc Base class for sensor abstraction components.
 * @param {Gpio} pin The input pin to sample the sensor data from.
 * @throws {ArgumentNullException} if pin is null or undefined.
 * @constructor
 * @implements {Sensor}
 * @extends {ComponentBase}
 * @extends {EventEmitter}
 */
function SensorBase(pin) {
  Sensor.call(this);
  ComponentBase.call(this);
  EventEmitter.call(this);

  if (util.isNullOrUndefined(pin)) {
    throw new ArgumentNullException("'pin' cannot be null or undefined.");
  }

  var self = this;
  var _pin = pin;
  _pin.provision();

  /**
   * Releases all resources used by the SensorBase object.
   * @override
   */
  this.dispose = function() {
    if (ComponentBase.prototype.isDisposed.call(this)) {
      return;
    }

    if (_pin != null) {
      _pin.dispose();
      _pin = undefined;
    }

    ComponentBase.prototype.dispose.call(this);
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
    return _pin;
  };

  /**
   * Fires the sensor state change event.
   * @param  {SensorStateChangeEvent} stateChangeEvent The state change event
   * object.
   * @override
   */
  this.onSensorStateChange = function(stateChangeEvent) {
    process.nextTick(function() {
      self.emit(Sensor.EVENT_STATE_CHANGED, stateChangeEvent);
    });
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
}

SensorBase.prototype.constructor = SensorBase;
inherits(SensorBase, Sensor);

module.exports = extend(true, SensorBase, ComponentBase, EventEmitter);
