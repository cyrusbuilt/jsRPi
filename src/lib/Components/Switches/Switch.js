"use strict";

//
//  Switch.js
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
const SwitchState = require('./SwitchState.js');

const STATE_CHANGED = "switchStateChanged";

/**
 * An interface for switch device abstractions.
 * @interface
 * @extends {Component}
 */
class Switch extends Component {
  /**
   * Initializes a new instance of the jsrpi.Components.Switches.Switch interface.
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * In a derived class, fires the switch state change event.
   * @param  {SwitchStateChangeEvent} switchStateEvent The event info object.
   */
  onSwitchStateChanged(switchStateEvent) {}

  /**
   * In a derived class, gets whether or not this switch is in the on position.
   * @property {Boolean} isOn - true if on; Otherwise, false.
   * @readonly
   */
  get isOn() { return false; }

  /**
   * In a derived class, gets whether or not this switch is in the off position.
   * @property {Boolean} isOff - true if off; Otherwise, false.
   * @readonly
   */
  get isOff() { return false; }

  /**
   * In a derived class, gets the state of the switch.
   * @property {SwitchState} state - The switch state.
   * @readonly
   */
  get state() { return SwitchState.Off; }

  /**
   * In a derived class, gets whether or not this switch is in the specified state.
   * @param  {SwitchState} state The state to check against.
   * @return {Boolean}       true if this switch is in the specified state;
   * Otherwise, false.
   */
  isState(state) { return false; }

  /**
   * Gets the underlying physical pin this switch is attached to.
   * @property {Gpio} pin - The pin.
   * @readonly
   */
  get pin() { return null; }

  /**
   * The name of the state change event.
   * @type {String}
   * @const
   */
  static get EVENT_STATE_CHANGED() { return STATE_CHANGED; }
}

module.exports = Switch;
