"use strict";

//
//  IDS1620Interface.js
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

const Disposable = require('../Disposable.js');

/**
 * An interface for the Dallas Semiconductor DS1620 digital thermometer IC.
 * @interface
 * @extends {Disposable}
 */
class DS1620Interface extends Disposable {
  /**
   * Initializes a new instance of the jsrpi.Sensors.DS1620Interface interface.
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * In an implementing class, gets the clock pin.
   * @property {Gpio} clockPin - The clock pin.
   * @readonly
   */
  get clockPin() { return null; }

  /**
   * In an implementing class, gets the data pin.
   * @property {Gpio} dataPin - The data pin.
   * @readonly
   */
  get dataPin() { return null; }

  /**
   * In an implementing class, gets the reset pin.
   * @property {Gpio} resetPin - The reset pin.
   * @readonly
   */
  get resetPin() { return null; }

  /**
   * In an implementing class, sends the commands to get the temperature from the
   * sensor.
   * @return {Number} The tempurature with half-degree granularity.
   * @throws {ObjectDisposedException} if this instance has been disposed and is
   * no longer usable.
   */
  getTemperature() { return 0; }
}

module.exports = DS1620Interface;
