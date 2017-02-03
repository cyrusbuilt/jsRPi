"use strict";
//
//  PiBrellaInterface.js
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
 * PiBrella device abastraction interface.
 * @interface
 * @extends {Device}
 */
class PiBrellaInterface extends Device {
  /**
   * Initializes a new instance of the jsrpi.Devices.PiBrella.PiBrellaInterface
   * interface.
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * In a derived class, gets the red LED.
   * @property {GpioStandard} redLED - The red LED.
   * @readonly
   */
  get redLED() { return null; }

  /**
   * In a derived class, gets the yellow LED.
   * @property {GpioStandard} yellowLED - The yellow LED.
   * @readonly
   */
  get yellowLED() { return null; }

  /**
   * In a derived class, gets the green LED.
   * @property {GpioStandard} greenLED - The green LED.
   * @readonly
   */
  get greenLED() { return null; }

  /**
   * In a derived class, gets the LEDs (array of GpioStandard output objects).
   * @property {Array} LEDs - An array of all of the LEDs.
   * @readonly
   */
  get LEDs() { return []; }

  /**
   * In a derived class, gets the PiBrella button input.
   * @property {GpioStandard} button - The button.
   * @readonly
   */
  get button() { return null; }

  /**
   * In a derived class, gets the buzzer output component.
   * @property {GpioStandard} buzzer - The buzzer.
   * @readonly
   */
  get buzzer() { return null; }

  /**
   * In a derived class, gets PiBrella input A.
   * @property {GpioStandard} inputA - The input A.
   * @readonly
   */
  get inputA() { return null; }

  /**
   * In a derived class, gets PiBrella input B.
   * @property {GpioStandard} inputB - The input B.
   * @readonly
   */
  get inputB() { return null; }

  /**
   * In a derived class, gets PiBrella input C.
   * @property {GpioStandard} inputC - The input C.
   * @readonly
   */
  get inputC() { return null; }

  /**
   * In a derived class, gets PiBrella input D.
   * @property {GpioStandard} inputD - The input D.
   * @readonly
   */
  get inputD() { return null; }

  /**
   * In a derived class, gets all the PiBrella inputs (array of GpioStandard
   * inputs).
   * @property {GpioStandard} inputs - An array of all of the inputs.
   * @readonly
   */
  get inputs() { return []; }

  /**
   * In a derived class, gets PiBrella output E.
   * @property {GpioStandard} outputE - The output E.
   * @readonly
   */
  get outputE() { return null; }

  /**
   * In a derived class, gets PiBrella output F.
   * @property {GpioStandard} outputF - The output F.
   * @readonly
   */
  get outputF() { return null; }

  /**
   * In a derived class, gets PiBrella output G.
   * @property {GpioStandard} outputG - The output G.
   * @readonly
   */
  get outputG() { return null; }

  /**
   * In a derived class, gets PiBrella output H.
   * @property {GpioStandard} outputH - The output H.
   * @readonly
   */
  get outputH() { return null; }

  /**
   * In a derived class, gets all the PiBrella outputs (array of GpioStandard
   * outputs).
   * @property {Array} outputs - An array of all the outputs.
   * @readonly
   */
  get outputs() { return []; }
}

module.exports = PiBrellaInterface;
