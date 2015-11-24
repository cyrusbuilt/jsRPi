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

var inherits = require('util').inherits;
var Pin = require('./Pin.js');
var PinState = require('./PinState.js');

var STATE_CHANGED = "stateChanged";

/**
 * Implemented by classes that represent GPIO pins on the Raspberry Pi.
 * @interface
 * @extends {Pin}
 */
function Gpio() {
  Pin.call(this);
}

Gpio.prototype.constructor = Gpio;
inherits(Gpio, Pin);

/**
 * Write a value to the pin.
 * @param  {PinState} ps The pin state value to write to the pin.
 * @throws {ObjectDisposedException} if this instance has been disposed.
 */
Gpio.prototype.write = function(ps) {};

/**
 * Pulse the pin output for the specified number of milliseconds.
 * @param  {Number} millis The number of milliseconds to wait between states.
 * @throws {ObjectDisposedException} if this instance has been disposed.
 */
Gpio.prototype.pulse = function(millis) {};

/**
 * Reads a value from the pin.
 * @return {PinState} The state (value) of the pin.
 * @throws {ObjectDisposedException} if this instance has been disposed.
 */
Gpio.prototype.read = function() { return PinState.Low; };

/**
 * Gets the PWM (Pulse-Width Modulation) value.
 * @return {Number} The PWM value.
 */
Gpio.prototype.getPWM = function() { return 0; };

/**
 * Sets the PWM (Pulse-Width Modulation) value.
 * @param  {Number} pwm The PWM value.
 */
Gpio.prototype.setPWM = function(pwm) {};

/**
 * Gets the PWM range.
 * @return {Number} The PWM range.
 */
Gpio.prototype.getPWMRange = function() { return 0; };

/**
 * Sets the PWM range.
 * @param  {Number} range The PWM range.
 */
Gpio.prototype.setPWMRange = function(range) {};

/**
 * Provisions the I/O pin. See http://wiringpi.com/reference/raspberry-pi-specifics/
 */
Gpio.prototype.provision = function() {};

/**
 * The name of the state changed event.
 * @type {String}
 * @const
 */
Gpio.EVENT_STATE_CHANGED = STATE_CHANGED;

module.exports = Gpio;
