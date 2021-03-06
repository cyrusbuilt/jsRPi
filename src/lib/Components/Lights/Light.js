"use strict";

//
//  Light.js
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

const STATE_CHANGED = "lightStateChanged";
const LEVEL_CHANGED = "lightLevelChanged";

/**
 * An interface for light abstraction components.
 * @interface
 * @extends {Component}
 */
class Light extends Component {
  /**
   * Initializes a new instance of the jsrpi.Components.Lights.Light interface.
   */
  constructor() {
    super();
  }

  /**
   * In a derivative class, gets a value indicating whether this light is on.
   * @property {Boolean} isOn - true if the light is on; Otherwise, false.
   * @readonly
   */
  get isOn() { return false; }

  /**
   * In a derivative class, gets a value indicating whether this light is off.
   * @property {Boolean} isOff - true if the light is off; Otherwise, false.
   * @readonly
   */
  get isOff() { return false; }

  /**
   * In a derivative class, switches the light on.
   */
  turnOn() {}

  /**
   * In a derivative class, switches the light off.
   */
  turnOff() {}

  /**
   * In a derivate class, fires the light state change event.
   * @param  {LightStateChangeEvent} lightChangeEvent The state change event object.
   */
  onLightStateChange(lightChangeEvent) {}

  /**
   * The name of the light state changed event.
   * @type {String}
   * @const
   */
  static get EVENT_STATE_CHANGED() { return STATE_CHANGED; }

  /**
   * The name of the light level changed event.
   * @type {String}
   * @const
   */
  static get EVENT_LEVEL_CHANGED() { return LEVEL_CHANGED; }
}

module.exports = Light;
