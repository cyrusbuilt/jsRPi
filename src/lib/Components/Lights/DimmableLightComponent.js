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

var util = require('util');
var inherits = require('util').inherits;
var DimmableLightBase = require('./DimmableLightBase.js');
var ArgumentNullException = require('../../ArgumentNullException.js');
var LightLevelChangeEvent = require('./LightLevelChangeEvent.js');
var LightStateChangeEvent = require('./LightStateChangeEvent.js');

/**
 * @classdesc A component that is an abstraction of a dimmable light.
 * @param {Gpio} pin The pin used to control the dimmable light.
 * @param {Number} min The minimum brightness level.
 * @param {Number} max The maximum brightness level.
 * @throws {ArgumentNullException} if the pin param is null or undefined.
 * @constructor
 * @extends {DimmableLightBase}
 */
function DimmableLightComponent(pin, min, max) {
  DimmableLightBase.call(this);

  if (util.isNullOrUndefined(pin)) {
    throw new ArgumentNullException("'pin' param cannot be null or undefined.");
  }

  var self = this;
  var _min = min || 0;
  var _max = max || 0;
  var _pin = pin;
  _pin.provision();

  /**
   * Releases all resources used by the GpioBase object.
   * @override
   */
  this.dispose = function() {
    if (DimmableLightBase.prototype.isDisposed.call(this)) {
      return;
    }

    if (!util.isNullOrUndefined(_pin)) {
      _pin.dispose();
      _pin = undefined;
    }

    self.removeAllListeners();
    DimmableLightBase.prototype.dispose.call(this);
  };

  /**
   * Gets the minimum brightness level.
   * @return {Number} The minimum brightness level.
   * @override
   */
  this.minLevel = function() {
    return _min;
  };

  /**
   * Gets the maximum brightness level.
   * @return {Number} The max brightness level.
   * @override
   */
  this.maxLevel = function() {
    return _max;
  };

  /**
   * Gets the brightness level.
   * @return {Number} The brightness level.
   * @override
   */
  this.getLevel = function() {
    return _pin.getPWM();
  };

  /**
   * Sets the brightness level.
   * @param  {Number} level The brightness level.
   * @throws {RangeError} if the specified level is less than minLevel() or
   * greater than maxLevel().
   * @override
   */
  this.setLevel = function(level) {
    if (level < _min) {
      throw new RangeError("Level cannot be less than minLevel.");
    }

    if (level > _max) {
      throw new RangeError("Level cannot be more than maxLevel.");
    }

    var isOnBeforeChange = DimmableLightBase.prototype.isOn.call(this);
    _pin.setPWM(level);
    var isOnAfterChange = DimmableLightBase.prototype.isOn.call(this);
    DimmableLightBase.prototype.onLightLevelChanged.call(this, new LightLevelChangeEvent(level));
    if (isOnBeforeChange !== isOnAfterChange) {
      DimmableLightBase.prototype.onLightStateChange.call(this, new LightStateChangeEvent(isOnAfterChange));
    }
  };
}

DimmableLightComponent.prototype.constructor = DimmableLightComponent;
inherits(DimmableLightComponent, DimmableLightBase);

module.exports = DimmableLightComponent;
