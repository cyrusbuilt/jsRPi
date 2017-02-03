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

const util = require('util');
const LightBase = require('./LightBase.js');
const PinState = require('../../IO/PinState.js');
const PinMode = require('../../IO/PinMode.js');
const LightStateChangeEvent = require('./LightStateChangeEvent.js');
const ArgumentNullException = require('../../ArgumentNullException.js');
const InvalidOperationException = require('../../InvalidOperationException.js');
const ObjectDisposedException = require('../../ObjectDisposedException.js');

const ON_STATE = PinState.High;
const OFF_STATE = PinState.Low;

/**
 * @classdesc A component that is an abstraction of a light.
 * @extends {LightBase}
 */
class LightComponent extends LightBase {
  /**
   * Initializes a new instance of the jsrpi.Components.Lights.LightComponent
   * class with the pin that the light is attached to.
   * @param {Gpio} pin The output pin the light is wired to.
   * @throws {ArgumentNullException} if pin is null or undefined.
   * @constructor
   */
  constructor(pin) {
    super();

    if (util.isNullOrUndefined(pin)) {
      throw new ArgumentNullException("'pin' param cannot be null or undefined.");
    }

    this._pin = pin;
    this._pin.provision();
  }

  /**
   * Releases all resources used by the GpioBase object.
   * @override
   */
  dispose() {
    if (this.isDisposed) {
      return;
    }

    if (!util.isNullOrUndefined(this._pin)) {
      this._pin.dispose();
      this._pin = undefined;
    }

    this.removeAllListeners();
    super.dispose();
  }

  /**
   * Gets a value indicating whether this light is on.
   * @property {Boolean} isOn - true if the light is on; Otherwise, false.
   * @readonly
   * @override
   */
  get isOn() {
    return (this._pin.state === ON_STATE);
  }

  /**
   * Switches the light on.
   * @override
   */
  turnOn() {
    if (this._pin.mode !== PinMode.OUT) {
      throw new InvalidOperationException("Pin is not configured as an output pin.");
    }

    if (this._pin.state !== ON_STATE) {
      this._pin.write(PinState.High);
      this.onLightStateChange(new LightStateChangeEvent(true));
    }
  }

  /**
   * Switches the light off.
   * @override
   */
  turnOff() {
    if (this._pin.mode !== PinMode.OUT) {
      throw new InvalidOperationException("Pin is not configured as an output pin.");
    }

    if (this._pin.state !== OFF_STATE) {
      this._pin.write(PinState.Low);
      this.onLightStateChange(new LightStateChangeEvent(false));
    }
  }
}

module.exports = LightComponent;
