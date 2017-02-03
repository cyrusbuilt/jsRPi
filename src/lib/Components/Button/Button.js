"use strict";

//
//  Button.js
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
const ButtonState = require('./ButtonState.js');

const STATE_CHANGED = "stateChanged";
const STATE_PRESSED = "buttonPressed";
const STATE_RELEASED = "buttonReleased";
const STATE_HOLD = "buttonHold";

/**
 * A button device abstraction component interface.
 * @interface
 * @extends {Component}
 */
class Button extends Component {
  /**
   * Initializes a new instance of the jsrpi.Components.Button.Button interface.
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * In an implementing class, gets a value indicating whether this instance is
   * pressed.
   * @property {Boolean} isPressed - true if pressed; Otherwise, false.
   * @readonly
   */
  get isPressed() { return false; }

  /**
   * In an implementing class, gets a value indicating whether the button is
   * released.
   * @property {Boolean} isReleased - true if released; Otherwise, false.
   * @readonly
   */
  get isReleased() { return false; }

  /**
   * In an implementing class, gets the button state.
   * @property {ButtonState} state - The button state.
   */
  get state() { return ButtonState.Unknown; }

  /**
   * In an implementing class, checks to see if the button is in a state matching
   * the specified state.
   * @param  {ButtonState} state The state to check.
   * @return {Boolean} true if the button is in the specified state; Otherwise,
   * false.
   */
  isState(state) { return false; }

  /**
   * Fires the button state changed event.
   * @param  {ButtonEvent} btnEvent The event info.
   */
  onStateChanged(btnEvent) {}

  /**
   * Fires the button pressend event.
   * @param  {ButtonEvent} btnEvent The event info.
   */
  onButtonPressed(btnEvent) {}

  /**
   * Fires the button released event.
   * @param  {ButtonEvent} btnEvent The event info.
   */
  onButtonReleased(btnEvent) {}

  /**
   * Fires the button hold event.
   * @param  {ButtonEvent} btnEvent The event info.
   */
  onButtonHold(btnEvent) {}

  /**
   * The name of the state changed event.
   * @type {String}
   * @const
   */
  static get EVENT_STATE_CHANGED() { return STATE_CHANGED; }

  /**
   * The name of the button pressed event.
   * @type {String}
   * @const
   */
  static get EVENT_PRESSED() { return STATE_PRESSED; }

  /**
   * The name of the button released event.
   * @type {String}
   * @const
   */
  static get EVENT_RELEASED() { return STATE_RELEASED; }

  /**
   * The name of the button hold event.
   * @type {String}
   * @const
   */
  static get EVENT_HOLD() { return STATE_HOLD; }
}

module.exports = Button;
