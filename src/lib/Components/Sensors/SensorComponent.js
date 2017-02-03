"use strict";
//
//  SensorComponent.js
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
const SensorBase = require('./SensorBase.js');
const SensorState = require('./SensorState.js');
const SensorStateChangeEvent = require('./SensorStateChangeEvent.js');
const PinState = require('../../IO/PinState.js');
const PinMode = require('../../IO/PinMode.js');
const ObjectDisposedException = require('../../ObjectDisposedException.js');
const InvalidOperationException = require('../../InvalidOperationException.js');

const OPEN_STATE = PinState.Low;

/**
 * @classdesc A component that is an abstraction of a sensor device. This is an
 * implementation of SensorBase.
 * @extends {SensorBase}
 */
class SensorComponent extends SensorBase {
  /**
   * Initializes a new instance of the jsrpi.Components.Sensors.SensorComponent
   * class with the pin the sensor is attached to.
   * @param {Gpio} pin The input pin to sample the sensor data from.
   * @throws {ArgumentNullException} if pin is null or undefined.
   * @constructor
   */
  constructor(pin) {
    super(pin);

    this._isPolling = false;
    this._controlTimer = null;
    this._lastState = SensorState.Open;
  }

  /**
   * Gets the state of the sensor.
   * @property {SensorState} state - The sensor state.
   * @override
   */
  get state() {
    if (this.pin.state === OPEN_STATE) {
      return SensorState.Open;
    }
    return SensorState.Closed;
  }

  /**
   * Checks to see if the sensor is in the specified state.
   * @param  {SensorState} state The state to check.
   * @return {Boolean}       true if the sensor is in the specified state;
   * Otherwise, false.
   * @override
   */
  isState(state) {
    return (this.state === state);
  }

  /**
   * Gets a value indicating whether this sensor is open.
   * @property {Boolean} isOpen - true if open; Otherwise, false.
   * @readonly
   * @override
   */
  get isOpen() {
    return this.isState(SensorState.Open);
  }

  /**
   * Gets a value indicating whether this sensor is closed.
   * @property {Boolean} isClosed - true if closed; Otherwise, false.
   * @readonly
   * @override
   */
  get isClosed() {
    return this.isState(SensorState.Closed);
  }

  /**
   * Executes the poll cycle.
   * @private
   */
  _executePoll() {
    if (this._isPolling) {
      let newState = this.state;
      if (newState !== this._lastState) {
        let oldState = this._lastState;
        this._lastState = newState;
        let evt = new SensorStateChangeEvent(this, oldState, newState);
        this.onSensorStateChange(evt);
      }
    }
  }

  /**
   * Executes the poll cycle in the background asynchronously.
   * @private
   */
  _backgroundExecutePoll() {
    if (!this._isPolling) {
      this._isPolling = true;
      this._controlTimer = setInterval(() => { this._executePoll(); }, 200);
    }
  }

  /**
   * Polls the input pin status every 500ms until stopped. IMPORTANT:
   * poll cycles occur at 200ms intervals. If you attach a poll event handler,
   * make sure you do not call interruptPoll() before the first interval elapses
   * or the event may never fire which could lead to a permanent wait state. It
   * is recommended to use the setTimeout() function (or equivalent) with a
   * timeout value > 200 to call the interruptPoll() method.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @throws {InvalidOperationException} if the underlying pin is not configured
   * as an input.
   */
  poll() {
    if (this.isDisposed) {
      throw new ObjectDisposedException('SensorComponent');
    }

    if (this.pin.mode !== PinMode.IN) {
      throw new InvalidOperationException("The specified pin is not configured" +
                  " as an input pin, which is required to read sensor data.");
    }

    if (this._isPolling) {
      return;
    }

    this._backgroundExecutePoll();
  }

  /**
   * Interrupts the poll cycle.
   */
  interruptPoll() {
    if (this._isPolling) {
      if (util.isNullOrUndefined(this._controlTimer)) {
        clearInterval(this._controlTimer);
        this._controlTimer = null;
      }

      this._isPolling = false;
    }
  }

  /**
   * Checks to see if this instance is currently polling.
   * @property {Boolean} isPolling - true if polling; Otherwise, false.
   * @readonly
   */
  get isPolling() {
    return this._isPolling;
  }

  /**
   * Releases all resources used by the SensorComponent object.
   * @override
   */
  dispose() {
    if (this.isDisposed) {
      return;
    }

    this.interruptPoll();
    super.dispose();
  }
}

module.exports = SensorComponent;
