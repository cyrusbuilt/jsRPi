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
var extend = require('extend');
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
  ComponentBase.call(this);

  if (util.isNullOrUndefined(pwmPin)) {
    throw new ArgumentNullException("'pwmPin' cannot be null or undefined.");
  }

  var self = this;
  var _pwmPin = pwmPin;
  _pwmPin.provision();

  /**
   * In subclasses, performs application-defined tasks associated with freeing,
   * releasing, or resetting resources.
   * @override
   */
  this.dispose = function() {
    if (ComponentBase.prototype.isDisposed.call(this)) {
      return;
    }

    if (!util.isNullOrUndefined(_pwmPin)) {
      _pwmPin.dispose();
      _pwmPin = undefined;
    }

    ComponentBase.prototype.dispose.call(this);
  };

  /**
   * Start the buzzer at the specified frequency.
   * @param  {Number} freq The frequency to buzz at.
   * @private
   */
  var internalBuzz = function(freq) {
    if (freq === STOP_FREQ) {
      _pwmPin.setPWM(freq);
    }
    else {
      var range = (600000 / freq);
      _pwmPin.setPWMRange(range);
      _pwmPin.setPWM(freq / 2);
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
    var d = duration || STOP_FREQ;
    internalBuzz(freq);
    if (d > STOP_FREQ) {
      setTimeout(self.stop(), duration);
    }
  };
}

/**
 * The minimum PWM frequency value used to stop the pulse (0).
 * @type {Number}
 */
BuzzerComponent.STOP_FREQUENCY = STOP_FREQ;

BuzzerComponent.prototype.constructor = BuzzerComponent;
inherits(BuzzerComponent, Buzzer);
module.exports = extend(true, BuzzerComponent, ComponentBase);
