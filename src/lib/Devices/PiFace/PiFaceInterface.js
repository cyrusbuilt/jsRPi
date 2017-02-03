"use strict";
//
//  PiFaceInterface.js
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

/**
 * An interface for a PiFace device abstraction.
 * @interface
 * @extends {Device}
 */
class PiFaceInterface extends Device {
    /**
     * Initializes a new instance of the jsrpi.Devices.PiFace.PiFaceInterface
     * interface.
     * @constructor
     */
  constructor() {
      super();
  }

  /**
   * In a derived class, gets the input pins.
   * @property {Array} inputPins -  An array of PiFaceGPIO objects representing
   * PiFace inputs.
   * @readonly
   */
  get inputPins() { return []; }

  /**
   * In a derived class, gets the output pins.
   * @property {Array} outputPins - An array of PiFaceGPIO objects representing
   * PiFace outputs.
   * @readonly
   */
  get outputPins() { return []; }

  /**
   * In a derived class, gets the relays.
   * @property {Array} relays - An array of Relay objects representing the
   * relays on the PiFace.
   * @readonly
   */
  get relays() { return []; }

  /**
   * In a derived class, gets the switches.
   * @property {Array} switches - An array of Switch objects representing the
   * switches on the PiFace.
   * @readonly
   */
  get switches() { return []; }

  /**
   * In a derived class, gets the LEDs.
   * @property {Array} LEDs -  An array of LEDInterface objects representing the
   * LEDs on the PiFace.
   * @readonly
   */
  get LEDs() { return []; }
}

module.exports = PiFaceInterface;
