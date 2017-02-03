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

const util = require('util');
const PowerBase = require('./PowerBase.js');
const PowerState = require('./PowerState.js');
const PowerStateChangeEvent = require('./PowerStateChangeEvent.js');
const PowerUtils = require('./PowerUtils.js');
const PowerInterface = require('./PowerInterface.js');
const Gpio = require('../../IO/Gpio.js');
const PinState = require('../../IO/PinState.js');
const PinMode = require('../../IO/PinMode.js');
const PinStateChangeEvent = require('../../IO/PinStateChangeEvent.js');
const ArgumentNullException = require('../../ArgumentNullException.js');
const ObjectDisposedException = require('../../ObjectDisposedException.js');
const InvalidPinModeException = require('../../IO/InvalidPinModeException.js');
const InvalidOperationException = require('../../InvalidOperationException.js');

/**
 * @classdesc A power control component implemented using a single native GPIO
 * configured as an output.
 * @extends {PowerBase}
 */
class GpioPowerComponent extends PowerBase {
  /**
   * Initializes a new instance of the jsrpi.Components.Power.GpioPowerComponent
   * class with the pin it is attached to and the pin states to consider the
   * device to be on and off.
   * @param {RaspiGpio} pin     The GPIO on the RPi that the device is attached to.
   * @param {PinState} onState  The pin state to consider the device "on".
   * @param {PinState} offState The pin state to consider the device "off".
   * @throws {ArgumentNullException} if the specified pin is null or undefined.
   * @constructor
   */
  constructor(pin, onState, offState) {
    super();

    if (util.isNullOrUndefined(pin)) {
      throw new ArgumentNullException("'pin' param cannot be null or undefined.");
    }

    this._output = pin;
    this._onState = onState || PinState.High;
    this._offState = offState || PinState.Low;

    this._output.on(Gpio.EVENT_STATE_CHANGED, (evt) => {
        this._onOutputStateChanged(evt);
    });
  }

  /**
   * Gets the this power component is attached to.
   * @property {RaspiGpio} pin - The underlying physical pin.
   * @readonly
   */
  get pin() {
    return this._pin;
  }

  /**
   * Internal handler for the output pin state change event. This dispatches the
   * power state change event based on the state of the pin.
   * @param  {PinStateChangeEvent} e The state change event.
   * @private
   */
  _onOutputStateChanged(e) {
    if (e.newState === this._onState) {
      this.onPowerStateChanged(new PowerStateChangeEvent(PowerState.Off, PowerState.On));
    }
    else {
      this.onPowerStateChanged(new PowerStateChangeEvent(PowerState.On, PowerState.Off));
    }
  }

  /**
   * Releases all resources used by the GpioBase object.
   * @override
   */
  dispose() {
    if (this.isDisposed) {
      return;
    }

    if (!util.isNullOrUndefined(this._output)) {
      this._output.dispose();
      this._output = undefined;
    }

    super.dispose();
  }

  /**
   * Gets or sets the state of the power component.
   * @property {PowerState} state - The component state.
   * @throws {ObjectDisposedException} if this component instance has been disposed.
   * @throws {InvalidPinModeException} if the pin being used to control this
   * component is not configured as an output.
   * @throws {InvalidOperationException} if an invalid state is specified.
   * @override
   */
  get state() {
    if (this._output.state === this._onState) {
      return PowerState.On;
    }
    else if (this._output.state === this._offState) {
      return PowerState.Off;
    }
    else {
      return PowerState.Unknown;
    }
  }

  set state(s) {
    if (this.isDisposed) {
      throw new ObjectDisposedException("GpioPowerComponent");
    }

    if (this._output.mode !== PinMode.OUT) {
      throw new InvalidPinModeException(this._output, "Pins in use by power components MUST be configured as outputs.");
    }

    switch (s) {
      case PowerState.Off:
        this._output.write(this._offState);
        super.state = s;
        break;
      case PowerState.On:
        this._output.write(this._onState);
        super.state = s;
        break;
      default:
        let badState = PowerUtils.getPowerStateName(s);
        throw new InvalidOperationException("Cannot set power state: " + badState);
    }
  }

  /**
   * Checks to see if the component is on.
   * @property {Boolean} isOn - true if on; Otherwise, false.
   * @readonly
   * @override
   */
  get isOn() {
    return (this.state === PowerState.On);
  }

  /**
   * Checks to see if the component is off.
   * @property {Boolean} isOff - true if off; Otherwise, false.
   * @readonly
   * @override
   */
  get isOff() {
    return (this.state === PowerState.Off);
  }

  /**
   * Turns the component on.
   * @override
   */
  turnOn() {
    this.state = PowerState.On;
  }

  /**
   * Turns the component off.
   * @override
   */
  turnOff() {
    this.state = PowerState.Off;
  }
}

module.exports = GpioPowerComponent;
