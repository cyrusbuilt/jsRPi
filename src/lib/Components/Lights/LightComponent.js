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
  var _pin = pin;
  _pin.provision();

  /**
   * Releases all resources used by the GpioBase object.
   * @override
   */
  this.dispose = function() {
    if (LightBase.prototype.isDisposed.call(this)) {
      return;
    }

    if (!util.isNullOrUndefined(_pin)) {
      _pin.dispose();
      _pin = undefined;
    }

    self.removeAllListeners();
    LightBase.prototype.dispose.call(this);
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
      LightBase.prototype.onLightStateChange.call(this, new LightStateChangeEvent(true));
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
      LightBase.prototype.onLightStateChange.call(this, new LightStateChangeEvent(false));
    }
  };
 }

LightComponent.prototype.constructor = LightComponent;
inherits(LightComponent, LightBase);

module.exports = LightComponent;
