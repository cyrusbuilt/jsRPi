"use strict";
//
//  MotionSensorComponent.js
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
const MotionSensorBase = require('./MotionSensorBase.js');
const PinState = require('../../IO/PinState.js');
const PinMode = require('../../IO/PinMode.js');
const ObjectDisposedException = require('../../ObjectDisposedException.js');
const InvalidOperationException = require('../../InvalidOperationException.js');
const MotionDetectedEvent = require('./MotionDetectedEvent.js');
const MotionSensor = require('./MotionSensor.js');

const MOTION_DETECTED = PinState.High;

/**
 * @classdesc A component that is an abstraction of a motion sensor device. This
 * is an implementation of MotionSensorBase.
 * @extends {MotionSensorBase}
 */
class MotionSensorComponent extends MotionSensorBase {
  /**
   * Initializes a new instance of the jsrpi.Components.Sensors.MotionSensorComponent
   * class with the pin the motion sensor is attached to.
   * @param {Gpio} pin The input pin to check for motion on.
   * @throws {ArgumentNullException} if pin is null or undefined.
   * @constructor
   */
  constructor(pin) {
    super(pin);

    this._isPolling = false;
    this._controlTimer = null;
    this._lastCheckDetected = false;
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
   * Checks to see if motion was detected.
   * @property {Boolean} isMotionDetected - true if motion was detected;
   * Otherwise, false.
   * @readonly
   * @override
   */
  get isMotionDetected() {
    return (this.pin.state === MOTION_DETECTED);
  }

  /**
   * Interrupts the poll cycle.
   */
  interruptPoll() {
    if (this._isPolling) {
      if (!util.isNullOrUndefined(this._controlTimer)) {
        clearInterval(this._controlTimer);
        this._controlTimer = null;
      }
      this._isPolling = false;
    }
  }

  /**
   * Releases all resources used by the MotionSensorBase object.
   * @override
   */
  dispose() {
    if (this.isDisposed) {
      return;
    }

    this.interruptPoll();
    super.dispose();
  }

  /**
   * Executes the poll cycle.
   * @private
   */
  _executePoll() {
    if (this._isPolling) {
      let detected = this.isMotionDetected;
      if (detected !== this._lastCheckDetected) {
        this._lastCheckDetected = detected;
        let evt = new MotionDetectedEvent(this._lastCheckDetected, new Date());
        this.onMotionStateChanged(evt);
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
   * Polls the input pin status every 500ms until stopped.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @throws {InvalidOperationException} if the underlying pin is not configured
   * as an input pin.
   */
  poll() {
    if (this.isDisposed) {
      throw new ObjectDisposedException('MotionSensorComponent');
    }

    if (this.pin.mode !== PinMode.IN) {
      throw new InvalidOperationException("The specified pin is not configured" +
                      " as input pin, which is required to read sensor data.");
    }

    if (this._isPolling) {
      return;
    }

    this._backgroundExecutePoll();
  }
}

module.exports = MotionSensorComponent;
