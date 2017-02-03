"use strict";

//
//  PiFaceGPIO.js
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
const PiFacePins = require('./PiFacePins.js');

const STATE_CHANGED = "piFaceGpioStateChanged";

/**
 * Implemented by classes that represent GPIO pins on the PiFace expansion
 * board for the Raspberry Pi.
 * @interface
 * @extends {Gpio}
 */
class PiFaceGPIO extends Gpio {
  /**
   * Initializes a new instance of the jsrpi.IO.PiFaceGPIO interface.
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * Gets the inner pin.
   * @property {PiFacePins} innerPin - The underlying physical pin.
   * @readonly
   */
  get innerPin() {
    return PiFacePins.None;
  }

  /**
   * An array of all PiFace outputs.
   * @type {Array}
   * @const
   */
  static get OUTPUTS() {
    return [
      PiFacePins.Output00,
      PiFacePins.Output01,
      PiFacePins.Output02,
      PiFacePins.Output03,
      PiFacePins.Output04,
      PiFacePins.Output05,
      PiFacePins.Output06,
      PiFacePins.Output07
    ];
  }

  /**
   * An array of all PiFace inputs.
   * @type {Array}
   * @const
   */
  static get INPUTS() {
    return [
      PiFacePins.Input00,
      PiFacePins.Input01,
      PiFacePins.Input02,
      PiFacePins.Input03,
      PiFacePins.Input04,
      PiFacePins.Input05,
      PiFacePins.Input06,
      PiFacePins.Input07
    ];
  }

  /**
   * The name of the state changed event.
   * @type {String}
   * @const
   */
  static get EVENT_STATE_CHANGED() { return STATE_CHANGED; }
}

module.exports = PiFaceGPIO;
