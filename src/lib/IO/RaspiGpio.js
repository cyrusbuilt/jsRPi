"use strict";

//
//  RaspiGpio.js
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

const Gpio = require('./Gpio.js');
const BoardRevision = require('../BoardRevision.js');
const GpioPins = require('./GpioPins.js');

/**
 * A RaspberryPi GPIO interface.
 * @interface
 * @extends {Gpio}
 */
class RaspiGpio extends Gpio {
  /**
   * Iniatializes a new instance of the jsrpi.IO.RaspiGpio interface.
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * Gets the board revision.
   * @property {BoardRevision} revision - The board revision.
   * @readonly
   */
  get revision() { return BoardRevision.Rev2; }

  /**
   * Gets the physical pin being represented by this instance.
   * @property {GpioPins} innerPin - The underlying physical pin.
   * @readonly
   */
  get innerPin() { return GpioPins.GPIO_NONE; }

  /**
   * In a derivative class, fires the pin state change event.
   * @param {PinStateChangeEvent} psce The event object.
   */
  onPinStateChange(psce) {}
}

module.exports = RaspiGpio;
