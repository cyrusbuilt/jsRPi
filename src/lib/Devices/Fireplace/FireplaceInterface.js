"use strict";
//
//  FireplaceInterface.js
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

const Device = require('../Device.js');
const FireplaceState = require('./FireplaceState.js');
const TimeUnit = require('../../PiSystem/TimeUnit.js');

const STATE_CHANGED = "fireplaceStateChangedEvent";
const PILOT_LIGHT_STATE_CHANGED = "fireplacePilotStateChangedEvent";
const OPERATION_TIMEOUT = "fireplaceOperationTimeoutEvent";

/**
 * Fireplace device abstraction interface.
 * @interface
 * @extends {Device}
 */
class FireplaceInterface extends Device {
  /**
   *
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * In a derived class, fires the state change event.
   * @param  {FireplaceStateChangeEvent} stateChangeEvent The event object.
   */
  onFireplaceStateChange(stateChangeEvent) {}

  /**
   * In a derived class, fires the operation timeout event.
   * @param  {FireplaceTimeoutEvent} timeoutEvent The event object.
   */
  onOperationTimeout(timeoutEvent) {}

  /**
   * In a derived class, fires the pilot light state change event.
   * @param  {FireplacePilotLightEvent} pilotStateEvent The event object.
   */
  onPilotLightStateChange(pilotStateEvent) {}

  /**
   * In a derived class, gets the fireplace state.
   * @property {FireplaceState} state - The fireplace state.
   */
  get state() { return FireplaceState.Off; }

  set state(s) {}

  /**
   * In a derived class, gets a value indicating whether the fireplace is on.
   * @property {Boolean} isOn - true if the fireplace is on; Otherwise, false.
   * @readonly
   */
  get isOn() { return false; }

  /**
   * In a derived class, gets a value indicating whether the fireplace is off.
   * @property {Boolean} isOff - true if the fireplace is off; Otherwise, false.
   * @readonly
   */
  get isOff() { return false; }

  /**
   * In a derived class, gets a value indicating whether the pilot light is on.
   * @property {Boolean} isPilotLightOn - true if the pilot light is lit;
   * Otherwise, false.
   * @readonly
   */
  get isPilotLightOn() { return false; }

  /**
   * In a derived class, gets a value indicating whether pilot light is off.
   * @property {Boolean} isPilotLightOff - true if the pilot light is off;
   * Otherwise, false.
   * @readonly
   */
  get isPilotLightOff() { return false; }

  /**
   * In a derived class, gets the timeout delay.
   * @return {Number} The timeout delay.
   */
  getTimeoutDelay() { return 0; }

  /**
   * In a derived class, gets the timeout unit of time.
   * @return {TimeUnit} Gets the time unit being used for the timeout delay.
   */
  getTimeoutUnit() { return TimeUnit.Seconds; }

  /**
   * In a derived class, sets the timeout delay.
   * @param  {Number} delay   The timeout delay.
   * @param  {TimeUnit} unit  The time unit of measure for the timeout.
   * @throws {InvalidOperationException} if the fireplace is turned off.
   */
  setTimeoutDelay(delay, unit) {}

  /**
   * In a derived class, turns the fireplace on with the specified timeout. If the
   * operation is not successful within the allotted time, the operation is
   * cancelled for safety reasons.
   * @param  {Number} timeoutDelay   The timeout delay. If not specified or less
   * than or equal to zero, then the fireplace is turned on without any saftey
   * delay (not recommended).
   * @param  {TimeUnit} timeoutUnit  The time unit of measure for the timeout. If
   * not specified, TimeUnit.Seconds is assumed.
   */
  turnOn(timeoutDelay, timeoutUnit) {}

  /**
   * In a derived class, turns the fireplace off.
   */
  turnOff() {}

  /**
   * In a derived class, cancels a timeout.
   */
  cancelTimeout() {}

  /**
   * In a derived class, shutdown the fireplace.
   */
  shutdown() {}

  /**
   * The name of the state change event.
   * @type {String}
   * @const
   */
  static get EVENT_STATE_CHANGED() { return STATE_CHANGED; }

  /**
   * The name of the pilot light state change event.
   * @type {String}
   * @const
   */
  static get EVENT_PILOT_LIGHT_STATE_CHANGED() { return PILOT_LIGHT_STATE_CHANGED; }

  /**
   * The name of the operation timeout event.
   * @type {String}
   * @const
   */
  static get EVENT_OPERATION_TIMEOUT() { return OPERATION_TIMEOUT; }
}

module.exports = FireplaceInterface;
