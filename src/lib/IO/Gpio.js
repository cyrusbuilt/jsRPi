"use strict";

//
//  Gpio.js
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
//

const Pin = require('./Pin.js');
const PinState = require('./PinState.js');

const STATE_CHANGED = "stateChanged";

/**
 * Implemented by classes that represent GPIO pins on the Raspberry Pi.
 * @interface
 * @extends {Pin}
 */
class Gpio extends Pin {
  /**
   * Initializes a new instance of the jsrpi.IO.Gpio interface.
   */
  constructor() {
    super();
  }

  /**
   * Write a value to the pin.
   * @param  {PinState} ps The pin state value to write to the pin.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  write(ps) {}

  /**
   * Pulse the pin output for the specified number of milliseconds.
   * @param  {Number} millis The number of milliseconds to wait between states.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  pulse(millis) {}

  /**
   * Reads a value from the pin.
   * @return {PinState} The state (value) of the pin.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  read() { return PinState.Low; }

  /**
   * Gets or sets the PWM (Pulse-Width Modulation) value.
   * @property {Number} pwm - The PWM value.
   */
  get pwm() { return 0; }

  set pwm(val) {}

  /**
   * Gets or sets the PWM range.
   * @property {Number} pwmRange - The PWM range.
   */
  get pwmRange() { return 0; }

  set pwmRange(range) {}

  /**
   * Provisions the I/O pin. See http://wiringpi.com/reference/raspberry-pi-specifics/
   */
  provision() {}

  /**
   * The name of the state changed event.
   * @type {String}
   * @const
   */
  static get EVENT_STATE_CHANGED() { return STATE_CHANGED; }
}

module.exports = Gpio;
