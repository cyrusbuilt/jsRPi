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

var inherits = require('util').inherits;
var Disposable = require('../../Disposable.js');
var ButtonState = require('./ButtonState.js');

var STATE_CHANGED = "stateChanged";
var STATE_PRESSED = "buttonPressed";
var STATE_RELEASED = "buttonReleased";
var STATE_HOLD = "buttonHold";

/**
 * A button device abstraction component interface.
 * @interface
 */
function Button() {
  Disposable.call(this);
}

/**
 * In an implementing class, gets a value indicating whether this instance is
 * pressed.
 * @return {Boolean} true if pressed; Otherwise, false.
 */
Button.prototype.isPressed = function() { return false; };

/**
 * In an implementing class, gets a value indicating whether the button is
 * released.
 * @return {Boolean} true if released; Otherwise, false.
 */
Button.prototype.isReleased = function() { return false; };

/**
 * In an implementing class, gets the button state.
 * @return {ButtonState} Gets the state of the button.
 */
Button.prototype.getState = function() { return ButtonState.Unknown; };

/**
 * In an implementing class, checks to see if the button is in a state matching
 * the specified state.
 * @param  {ButtonState} state The state to check.
 * @return {Boolean}       true if the button is in the specified state;
 * Otherwise, false.
 */
Button.prototype.isState = function(state) { return false; };

/**
 * Fires the button state changed event.
 * @param  {ButtonEvent} btnEvent The event info.
 */
Button.prototype.onStateChanged = function(btnEvent) {};

/**
 * Fires the button pressend event.
 * @param  {ButtonEvent} btnEvent The event info.
 */
Button.prototype.onButtonPressed = function(btnEvent) {};

/**
 * Fires the button released event.
 * @param  {ButtonEvent} btnEvent The event info.
 */
Button.prototype.onButtonReleased = function(btnEvent) {};

/**
 * Fires the button hold event.
 * @param  {ButtonEvent} btnEvent The event info.
 */
Button.prototype.onButtonHold = function(btnEvent) {};

/**
 * The name of the state changed event.
 * @type {String}
 * @const
 */
Button.EVENT_STATE_CHANGED = STATE_CHANGED;

/**
 * The name of the button pressed event.
 * @type {String}
 * @const
 */
Button.EVENT_PRESSED = STATE_PRESSED;

/**
 * The name of the button released event.
 * @type {String}
 * @const
 */
Button.EVENT_RELEASED = STATE_RELEASED;

/**
 * The name of the button hold event.
 * @type {String}
 * @const
 */
Button.EVENT_HOLD = STATE_HOLD;


Button.prototype.constructor = Button;
inherits(Button, Disposable);

module.exports = Button;
