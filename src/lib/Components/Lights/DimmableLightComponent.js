"use strict";

//
//  DimmableLightComponent.js
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
const DimmableLightBase = require('./DimmableLightBase.js');
const ArgumentNullException = require('../../ArgumentNullException.js');
const LightLevelChangeEvent = require('./LightLevelChangeEvent.js');
const LightStateChangeEvent = require('./LightStateChangeEvent.js');
const ObjectDisposedException = require('../../ObjectDisposedException.js');

/**
 * @classdesc A component that is an abstraction of a dimmable light.
 * @extends {DimmableLightBase}
 */
class DimmableLightComponent extends DimmableLightBase {
  /**
   * Initializes a new instance of the jsrpi.Components.Lights.DimmableLightComponent
   * class with the pin the light is attached to and the minimum and maximum
   * brightness levels.
   * @param {Gpio} pin The pin used to control the dimmable light.
   * @param {Number} min The minimum brightness level.
   * @param {Number} max The maximum brightness level.
   * @throws {ArgumentNullException} if the pin param is null or undefined.
   * @constructor
   */
  constructor(pin, min, max) {
    super();

    if (util.isNullOrUndefined(pin)) {
      throw new ArgumentNullException("'pin' param cannot be null or undefined.");
    }

    this._min = min || 0;
    this._max = max || 0;
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
   * Gets the minimum brightness level.
   * @property {Number} minLevel - The minimum brightness level.
   * @readonly
   * @override
   */
  get minLevel() {
    return this._min;
  }

  /**
   * Gets the maximum brightness level.
   * @property {Number} maxLevel - The maximum brightness level.
   * @readonly
   * @override
   */
  get maxLevel() {
    return this._max;
  }

  /**
   * Gets or sets the brightness level.
   * @property {Number} level - The brightness level.
   * @throws {RangeError} if the specified level is less than minLevel or
   * greater than maxLevel.
   * @override
   */
  get level() {
    return this._pin.pwm;
  }

  set level(lev) {
    if (lev < this._min) {
      throw new RangeError("Level cannot be less than minLevel.");
    }

    if (lev > this._max) {
      throw new RangeError("Level cannot be more than maxLevel.");
    }

    let isOnBeforeChange = this.isOn;
    this._pin.pwm = lev;
    let isOnAfterChange = this.isOn;
    this.onLightLevelChanged(new LightLevelChangeEvent(lev));
    if (isOnBeforeChange !== isOnAfterChange) {
      this.onLightStateChange(new LightStateChangeEvent(isOnAfterChange));
    }
  }

  /**
   * Gets a value indicating whether this light is on.
   * @property {Boolean} isOn - true if the light is on; Otherwise, false.
   * @readonly
   * @override
   */
  get isOn() {
    return (this.level > this.minLevel);
  }

  /**
   * Gets a value indicating whether this light is off.
   * @property {Boolean} isOff - true if the light is off; Otherwise, false.
   * @readonly
   * @override
   */
  get isOff() {
    return (this.level <= this.minLevel);
  }

  /**
   * Switches the light on.
   * @override
   */
  turnOn() {
    this.level = this.maxLevel;
  }

  /**
   * Switches the light off.
   * @override
   */
  turnOff() {
    this.level = this.minLevel;
  }
}

module.exports = DimmableLightComponent;
