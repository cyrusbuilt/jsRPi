"use strict";

//
//  LEDInterface.js
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

const Light = require('./Light.js');

/**
 * An interface for LED abstraction components.
 * @interface
 * @extends {Light}
 */
class LEDInterface extends Light {
  /**
   * Initializes a new instance of the jsrpi.Components.Lights.LEDInterface
   * interface.
   */
  constructor() {
    super();
  }

  /**
   * In a derivative class, toggles the state of the LED.
   */
  toggle() {}

  /**
   * In a derivative, blinks the LED.
   * @param  {Number} delay    The delay between state change.
   * @param  {Number} duration The amount of time to blink the LED (in milliseconds).
   */
  blink(delay, duration) {}

  /**
   * In a derivative class, pulses the state of the LED.
   * @param  {Number} duration The amount of time to pulse the LED.
   */
  pulse(duration) {}
}

module.exports = LEDInterface;
