"use strict";
//
//  MotionSensorComponent.js
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
var MotionSensorBase = require('./MotionSensorBase.js');
var PinState = require('../../IO/PinState.js');
var PinMode = require('../../IO/PinMode.js');
var ObjectDisposedException = require('../../ObjectDisposedException.js');
var InvalidOperationException = require('../../InvalidOperationException.js');
var MotionDetectedEvent = require('./MotionDetectedEvent.js');

/**
 * @classdesc A component that is an abstraction of a motion sensor device. This
 * is an implementation of MotionSensorBase.
 * @param {Gpio} pin The input pin to check for motion on.
 * @throws {ArgumentNullException} if pin is null or undefined.
 * @constructor
 * @extends {MotionSensorBase}
 */
function MotionSensorComponent(pin) {
  MotionSensorBase.call(this, pin);

  var MOTION_DETECTED = PinState.High;
  var self = this;
  var _isPolling = false;
  var _controlTimer = null;
  var _lastCheckDetected = false;

  /**
   * Checks to see if this instance is currently polling.
   * @return {Boolean} true if polling; Otherwise, false.
   */
  this.isPolling = function() {
    return _isPolling;
  };

  /**
   * Checks to see if motion was detected.
   * @return {Boolean} true if motion was detected; Otherwise, false.
   * @override
   */
  this.isMotionDetected = function() {
    return (MotionSensorBase.prototype.getPin.call(this).state() === MOTION_DETECTED);
  };

  /**
   * Interrupts the poll cycle.
   */
  this.interruptPoll = function() {
    if (_isPolling) {
      if (!util.isNullOrUndefined(_controlTimer)) {
        clearInterval(_controlTimer);
        _controlTimer = null;
      }
      _isPolling = false;
    }
  };

  /**
   * Executes the poll cycle.
   * @private
   */
  var executePoll = function() {
    if (_isPolling) {
      if (self.isMotionDetected() !== _lastCheckDetected) {
        var occurred = new Date();
        _lastCheckDetected = self.isMotionDetected();
        var evt = new MotionDetectedEvent(self.isMotionDetected, occurred);
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
    if (MotionSensorBase.prototype.isDisposed.call(this)) {
      throw new ObjectDisposedException('MotionSensorComponent');
    }

    if (MotionSensorBase.prototype.getPin().mode() !== PinMode.IN) {
      throw new InvalidOperationException("The specified pin is not configured" +
                      " as input pin, which is required to read sensor data.");
    }

    if (_isPolling) {
      return;
    }
    backgroundExecutePoll();
  };
}

MotionSensorComponent.prototype.constructor = MotionSensorComponent;
inherits(MotionSensorComponent, MotionSensorBase);

module.exports = MotionSensorComponent;
