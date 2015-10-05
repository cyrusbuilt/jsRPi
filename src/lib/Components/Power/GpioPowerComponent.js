"use strict";

//
//  GpioPowerComponent.js
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
var PowerBase = require('./PowerBase.js');
var PowerState = require('./PowerState.js');
var PowerStateChangeEvent = require('./PowerStateChangeEvent.js');
var PowerUtils = require('./PowerUtils.js');
var PowerInterface = require('./PowerInterface.js');
var Gpio = require('../../IO/Gpio.js');
var PinState = require('../../IO/PinState.js');
var PinMode = require('../../IO/PinMode.js');
var PinStateChangeEvent = require('../../IO/PinStateChangeEvent.js');
var ArgumentNullException = require('../../ArgumentNullException.js');
var ObjectDisposedException = require('../../ObjectDisposedException.js');
var InvalidPinModeException = require('../../IO/InvalidPinModeException.js');
var InvalidOperationException = require('../../InvalidOperationException.js');

/**
 * @classdesc A power control component implemented using a single native GPIO
 * configured as an output.
 * @param {RaspiGpio} pin      [description]
 * @param {PinState} onState  [description]
 * @param {PinState} offState [description]
 * @throws {ArgumentNullException}
 * @constructor
 * @extends {PowerBase}
 */
function GpioPowerComponent(pin, onState, offState) {
  PowerBase.call(this);

  if (util.isNullOrUndefined(pin)) {
    throw new ArgumentNullException("'pin' param cannot be null or undefined.");
  }

  var self = this;
  var _output = pin;
  var _onState = onState || PinState.High;
  var _offState = offState || PinState.Low;

  var onOutputStateChanged = function(e) {
    if (e.newState() === _onState) {
      PowerBase.prototype.onPowerStateChanged.call(this, new PowerStateChangeEvent(PowerState.Off, PowerState.On));
    }
    else {
      PowerBase.prototype.onPowerStateChanged.call(this, new PowerStateChangeEvent(PowerState.On, PowerState.Off));
    }
  };

  _output.on(Gpio.EVENT_STATE_CHANGED, onOutputStateChanged);

  /**
   * Releases all resources used by the GpioBase object.
   * @override
   */
  this.dispose = function() {
    if (PowerBase.prototype.isDisposed.call(this)) {
      return;
    }

    self.removeAllListeners();
    if (!util.isNullOrUndefined(_output)) {
      _output.dispose();
      _output = undefined;
    }

    PowerBase.prototype.dispose.call(this);
  };

  /**
   * In a derivative class, gets the state of the component.
   * @return {PowerState} The component state.
   * @override
   */
  this.getState = function() {
    if (_output.state() === _onState) {
      return PowerState.On;
    }
    else if (_output.state() === _offState) {
      return PowerState.Off;
    }
    else {
      return PowerState.Unknown;
    }
  };

  /**
   * Sets the state of the component.
   * @param  {PowerState} state The power state to set.
   * @throws {ObjectDisposedException} if this component instance has been disposed.
   * @throws {InvalidPinModeException} if the pin being used to control this
   * component is not configured as an output.
   * @throws {InvalidOperationException} if an invalid state is specified.
   * @override
   */
  this.setState = function(state) {
    if (PowerBase.prototype.isDisposed.call(this)) {
      throw new ObjectDisposedException("GpioPowerComponent");
    }

    if (_output.mode() !== PinMode.OUT) {
      throw new InvalidPinModeException(_output, "Pins in use by power components MUST be configured as outputs.");
    }

    switch (state) {
      case PowerState.Off:
        _output.write(_offState);
        break;
      case PowerState.On:
        _output.write(_onState);
        break;
      default:
        var badState = PowerUtils.getPowerStateName(state);
        throw new InvalidOperationException("Cannot set power state: " + badState);
    }
  };
}

GpioPowerComponent.prototype.constructor = GpioPowerComponent;
inherits(GpioPowerComponent, PowerBase);

module.exports = GpioPowerComponent;
