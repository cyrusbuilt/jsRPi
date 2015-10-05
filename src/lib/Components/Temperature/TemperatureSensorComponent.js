"use strict";
//
//  TemperatureSensorComponent.js
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
var TemperatureSensorBase = require('./TemperatureSensorBase.js');
var TemperatureScale = require('./TemperatureScale.js');
var TemperatureConversion = require('./TemperatureConversion.js');
var TemperatureChangeEvent = require('./TemperatureChangeEvent.js');
var ObjectDisposedException = require('../../ObjectDisposedException.js');

/**
 * @classdesc A component that is an abstraction of a temperature sensor device.
 * This is an implementation of TemperatureSensorBase.
 * @param {TemperatureScale} scale The temperature scale to use for measurements.
 * @param {Gpio} clock The GPIO pin used for the clock.
 * @param {Gpio} data  The GPIO pin used for data.
 * @param {Gpio} reset The GPIO pin used to trigger reset.
 * @throws {ArgumentNullException} in any of the pins are null or undefined.
 * @constructor
 * @extends {TemperatureSensorBase}
 */
function TemperatureSensorComponent(scale, clock, data, reset) {
  TemperatureSensorBase.call(this, clock, data, reset);

  var self = this;
  var _scale = scale || TemperatureScale.Celcius;
  var _isPolling = false;
  var _controlTimer = null;
  var _lastTemp = 0;

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
   * Releases all resources used by the TemperatureSensorComponent object.
   * @override
   */
  this.dispose = function() {
    if (TemperatureSensorBase.prototype.isDisposed.call(this)) {
      return;
    }

    self.interruptPoll();
    TemperatureSensorBase.prototype.dispose.call(this);
  };

  /**
   * Checks to see if this instance is currently polling.
   * @return {Boolean} true if polling; Otherwise, false.
   */
  this.isPolling = function() {
    return _isPolling;
  };

  /**
   * Gets the raw temperature value.
   * @return {Number} The raw value read from the sensor.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @override
   */
  this.getRawTemperature = function() {
    if (TemperatureSensorBase.prototype.isDisposed.call(this)) {
      throw new ObjectDisposedException('TemperatureSensorComponent');
    }

    var c = TemperatureScale.Celcius;
    var temp = TemperatureSensorBase.prototype.getSensor.call(this).getTemperature();
    if (_scale !== c) {
      return TemperatureConversion.convert(c, _scale, temp);
    }
    return temp;
  };

  /**
   * Gets the temperature scale.
   * @return {TemperatureScale} The scale being used to measure.
   * @override
   */
  this.getScale = function() {
    return _scale;
  };

  /**
   * Sets the scale to use for measurements.
   * @param  {TemperatureScale} scale The measurement scale.
   * @override
   */
  this.setScale = function(scale) {
    if (_scale !== scale) {
      _scale = scale;
    }
  };

  /**
   * Executes the poll cycle.
   * @private
   */
  var executePoll = function() {
    var oldTemp = 0;
    var newTemp = 0;
    if (_isPolling) {
      newTemp = self.getRawTemperature();
      if (newTemp !== _lastTemp) {
        oldTemp = _lastTemp;
        _lastTemp = newTemp;
        var evt = new TemperatureChangeEvent(oldTemp, newTemp);
        TemperatureSensorBase.prototype.onTemperatureChange.call(this, evt);
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
    if (TemperatureSensorBase.prototype.isDisposed.call(this)) {
      throw new ObjectDisposedException('TemperatureSensorComponent');
    }

    if (_isPolling) {
      return;
    }
    backgroundExecutePoll();
  };
}

TemperatureSensorComponent.prototype.constructor = TemperatureSensorComponent;
inherits(TemperatureSensorComponent, TemperatureSensorBase);

module.exports = TemperatureSensorComponent;
