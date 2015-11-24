"use strict";

//
//  BuzzerComponent.js
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
var Buzzer = require('./Buzzer.js');
var ComponentBase = require('../ComponentBase.js');
var ArgumentNullException = require('../../ArgumentNullException.js');

var STOP_FREQ = 0;

/**
 * A buzzer device abstraction component.
 * @param {Gpio} pwmPin The pin the buzzer is attached to.
 * @throws {ArgumentNullException} if pin is null or undefined.
 * @constructor
 * @implements {Buzzer}
 * @extends {ComponentBase}
 */
function BuzzerComponent(pwmPin) {
  Buzzer.call(this);

  if (util.isNullOrUndefined(pwmPin)) {
    throw new ArgumentNullException("'pwmPin' cannot be null or undefined.");
  }

  var self = this;
  var _base = new ComponentBase();
  var _pwmPin = pwmPin;
  var _isBuzzing = false;
  _pwmPin.provision();
	
	/**
	 * Gets the underlying pin the buzzer is attached to.
	 * @returns {Gpio} The underlying output pin.
	 */
	this.getPin = function() {
		return _pwmPin;
	};

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
   * Determines whether or not the current instance has been disposed.
   * @return {Boolean} true if disposed; Otherwise, false.
   * @override
   */
  this.isDisposed = function() {
    return _base.isDisposed();
  };

  /**
   * In subclasses, performs application-defined tasks associated with freeing,
   * releasing, or resetting resources.
   * @override
   */
  this.dispose = function() {
    if (_base.isDisposed()) {
      return;
    }

    if (!util.isNullOrUndefined(_pwmPin)) {
      _pwmPin.dispose();
      _pwmPin = undefined;
    }

    _base.dispose();
  };

  /**
   * Gets whether or not this buzzer is buzzing.
   * @return {Boolean} true if buzzing; Otherwise, false.
   */
  this.isBuzzing = function() {
    return _isBuzzing;
  };

  /**
   * Start the buzzer at the specified frequency.
   * @param  {Number} freq The frequency to buzz at.
   * @private
   */
  var internalBuzz = function(freq) {
    if (freq === STOP_FREQ) {
      _pwmPin.setPWM(freq);
      _isBuzzing = false;
    }
    else {
      var range = (600000 / freq);
      _pwmPin.setPWMRange(range);
      _pwmPin.setPWM(freq / 2);
      _isBuzzing = true;
    }
  };

  /**
   * Stops the buzzer.
   * @override
   */
  this.stop = function() {
    internalBuzz(STOP_FREQ);
  };

  /**
   * Starts the buzzer at the specified frequency and (optionally) for the
   * specified duration.
   * @param  {Number} freq     The frequency to buzz at.
   * @param  {Number} duration The duration in milliseconds. If not specified,
   * buzzes until stopped.
   * @override
   */
  this.buzz = function(freq, duration) {
    var d = duration;
    if (util.isNullOrUndefined(d)) {
        d = STOP_FREQ;
    }

    internalBuzz(freq);
    if (d > STOP_FREQ) {
      setTimeout(function() {
        self.stop();
      }, duration);
    }
  };

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
   * Returns the string representation of this object. In this case, it simply
   * returns the component name.
   * @return {String} The name of this component.
   */
  this.toString = function() {
    return self.componentName;
  };
}

/**
 * The minimum PWM frequency value used to stop the pulse (0).
 * @constant {Number}
 */
BuzzerComponent.STOP_FREQUENCY = STOP_FREQ;

BuzzerComponent.prototype.constructor = BuzzerComponent;
inherits(BuzzerComponent, Buzzer);
module.exports = BuzzerComponent;
