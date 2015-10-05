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
  var _isPolling = false;
  var _controlTimer = null;
  var _lastState = SensorState.Open;

  /**
   * Executes the poll cycle.
   * @private
   */
  var executePoll = function() {
    if (_isPolling) {
      if (self.getState() === _lastState) {
        var oldState = _lastState;
        _lastState = self.getState();
        var evt = new SensorStateChangeEvent(self, oldState, self.getState());
        SensorBase.prototype.onSensorStateChange.call(this, evt);
      }
    }
  };

  /**
   * Executes the poll cycle in the background asynchronously.
   * @private
   */
  var backgroundExecutePoll = function() {
    if (!_isPolling) {
      _controlTimer = setInterval(executePoll, 500);
      _isPolling = true;
    }
  };

  /**
   * Polls the input pin status every 500ms until stopped.
   */
  this.poll = function() {
    if (SensorBase.prototype.isDisposed.call(this)) {
      throw new ObjectDisposedException('SensorComponent');
    }

    if (SensorBase.prototype.getPin.call(this).mode() !== PinMode.IN) {
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
   * Gets the state of the sensor.
   * @return {SensorState} The state of the sensor.
   */
  this.getState = function() {
    if (SensorComponent.prototype.getPin.call(this).state() === OPEN_STATE) {
      return SensorState.Open;
    }
    return SensorState.Closed;
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
    if (SensorBase.prototype.isDisposed.call(this)) {
      return;
    }

    self.interruptPoll();
    self.removeAllListeners();
    SensorBase.prototype.dispose.call(this);
  };
}

SensorComponent.prototype.constructor = SensorComponent;
inherits(SensorComponent, SensorBase);

module.exports = SensorComponent;
