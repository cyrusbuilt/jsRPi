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

const util = require('util');
const Buzzer = require('./Buzzer.js');
const ComponentBase = require('../ComponentBase.js');
const ArgumentNullException = require('../../ArgumentNullException.js');

const STOP_FREQ = 0;

/**
* A buzzer device abstraction component.
* @implements {Buzzer}
* @extends {ComponentBase}
*/
class BuzzerComponent extends Buzzer {
  /**
   * Initializes a new instance of the jsrpi.Components.Buzzers.BuzzerComponent
   * class with the PWM pin the buzzer is attached to.
   * @param {Gpio} pwmPin The pin the buzzer is attached to.
   * @throws {ArgumentNullException} if pin is null or undefined.
   * @constructor
   */
  constructor(pwmPin) {
    super();

    if (util.isNullOrUndefined(pwmPin)) {
      throw new ArgumentNullException("'pwmPin' cannot be null or undefined.");
    }

    this._base = new ComponentBase();
    this._pwmPin = pwmPin;
    this._isBuzzing = false;
    this._pwmPin.provision();
  }

  /**
  * Gets the underlying pin the buzzer is attached to.
  * @property {Gpio} pin - The underlying physical pin.
  * @readonly
  */
  get pin() {
    return this._pwmPin;
  }

  /**
   * Gets or sets the name of this component.
   * @property {String} componentName - The component name.
   * @override
   */
  get componentName() {
    return this._base.componentName;
  }

  set componentName(name) {
    this._base.componentName = name;
  }

  /**
   * Gets or sets the object this component is tagged with.
   * @property {Object} tag - The tag.
   * @override
   */
  get tag() {
    return this._base.tag;
  }

  set tag(t) {
    this._base.tag = t;
  }

  /**
  * Gets the custom property collection.
  * @property {Array} propertyCollection - The property collection.
  * @readonly
  * @override
  */
  get propertyCollection() {
    return this._base.propertyCollection;
  }

  /**
  * Checks to see if the property collection contains the specified key.
  * @param  {String} key The key name of the property to check for.
  * @return {Boolean}    true if the property collection contains the key;
  * Otherwise, false.
  * @override
  */
  hasProperty(key) {
    return this._base.hasProperty(key);
  }

  /**
  * Sets the value of the specified property. If the property does not already exist
  * in the property collection, it will be added.
  * @param  {String} key   The property name (key).
  * @param  {String} value The value to assign to the property.
  * @override
  */
  setProperty(key, value) {
    this._base.setProperty(key, value);
  }

  /**
  * Determines whether or not the current instance has been disposed.
  * @property {Boolean} isDisposed - true if disposed; Otherwise, false.
  * @readonly
  * @override
  */
  get isDisposed() {
    return this._base.isDisposed;
  }

  /**
  * In subclasses, performs application-defined tasks associated with freeing,
  * releasing, or resetting resources.
  * @override
  */
  dispose() {
    if (this._base.isDisposed) {
      return;
    }

    if (!util.isNullOrUndefined(this._pwmPin)) {
      this._pwmPin.dispose();
      this._pwmPin = undefined;
    }

    this._base.dispose();
  }

  /**
  * Gets whether or not this buzzer is buzzing.
  * @property {Boolean} isBuzzing - true if buzzing; Otherwise, false.
  * @readonly
  */
  get isBuzzing() {
    return this._isBuzzing;
  }

  /**
  * Start the buzzer at the specified frequency.
  * @param  {Number} freq The frequency to buzz at.
  * @private
  */
  _internalBuzz(freq) {
    if (freq === STOP_FREQ) {
      this._pwmPin.pwm = freq;
      this._isBuzzing = false;
    }
    else {
      let range = (600000 / freq);
      this._pwmPin.pwmRange = range;
      this._pwmPin.pwm = (freq / 2);
      this._isBuzzing = true;
    }
  }

  /**
  * Stops the buzzer.
  * @override
  */
  stop() {
    this._internalBuzz(STOP_FREQ);
  }

  /**
  * Starts the buzzer at the specified frequency and (optionally) for the
  * specified duration.
  * @param  {Number} freq     The frequency to buzz at.
  * @param  {Number} duration The duration in milliseconds. If not specified,
  * buzzes until stopped.
  * @override
  */
  buzz(freq, duration) {
    let d = duration;
    if (util.isNullOrUndefined(d)) {
      d = STOP_FREQ;
    }

    this._internalBuzz(freq);
    if (d > STOP_FREQ) {
      setTimeout(() => {
        this.stop();
      }, duration);
    }
  }

  /**
  * Returns the string representation of this object. In this case, it simply
  * returns the component name.
  * @return {String} The name of this component.
  * @override
  */
  toString() {
    return this.componentName;
  }

  /**
  * The minimum PWM frequency value used to stop the pulse (0).
  * @constant {Number}
  */
  static get STOP_FREQUENCY() { return STOP_FREQ; }
}

module.exports = BuzzerComponent;
