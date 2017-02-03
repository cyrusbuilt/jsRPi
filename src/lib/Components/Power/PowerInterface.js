"use strict";

//
//  PowerInterface.js
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

const Component = require('../Component.js');
const PowerState = require('./PowerState.js');

const STATE_CHANGED = "powerStateChanged";

/**
 * An interface for power control device abstraction interfaces.
 * @interface
 * @extends {Component}
 */
class PowerInterface extends Component {
  /**
   * Initializes a new instance of the jsrpi.Components.Power.PowerInterface
   * interface.
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * In a derivative class, fires the power state changed event.
   * @param  {PowerStateChangeEvent} stateChangeEvent The event info object.
   */
  onPowerStateChanged(stateChangeEvent) {}

  /**
   * In a derivative class, checks to see if the component is on.
   * @property {Boolean} isOn - true if on; Otherwise, false.
   * @readonly
   */
  get isOn() { return false; }

  /**
   * In a derivative class, checks to see if the component is off.
   * @property {Boolean} isOff - true if off; Otherwise, false.
   * @readonly
   */
  get isOff() { return false; }

  /**
   * In a derivative class, gets or sets the state of the power component.
   * @property {PowerState} state - The state of the power component.
   * @throws {ObjectDisposedException} if this component instance has been disposed.
   * @throws {InvalidPinModeException} if the pin being used to control this
   * component is not configured as an output.
   * @throws {InvalidOperationException} if an invalid state is specified.
   */
  get state() { return PowerState.Unknown; }

  set state(s) {}

  /**
   * In a derivative class, turns the component on.
   */
  turnOn() {}

  /**
   * In a derivative class, turns the component off.
   */
  turnOff() {}

  /**
   * The name of the state change event.
   * @type {String}
   * @const
   */
  static get EVENT_STATE_CHANGED() { return STATE_CHANGED; }
}

module.exports = PowerInterface;
