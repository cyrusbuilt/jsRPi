"use strict";

//
//  ButtonEvent.js
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

var util = require('util');

/**
 * Button event arguments class.
 * @param {Button} button The button associated with this event.
 * @constructor
 * @event
 */
function ButtonEvent(button) {
  var _button = button || null;

  /**
   * Gets the button associated with this event.
   * @return {Button} The button assoicated with this event.
   */
  this.getButton = function() {
    return _button;
  };

  /**
   * Gets a flag indicating whether or not the button is pressed.
   * @return {Button} true if the button is pressed; Otherwise, false.
   */
  this.isPressed = function() {
    if (util.isNullOrUndefined(_button)) {
      return false;
    }
    return _button.isPressed();
  };

  /**
   * Gets a value indicating whether the button is released.
   * @return {Boolean} true if released; Otherwise, false.
   */
  this.isReleased = function() {
    if (util.isNullOrUndefined(_button)) {
      return false;
    }
    return _button.isReleased();
  };

  /**
   * Gets a flag indicating whether or not the button is in the specified state.
   * @param  {ButtonState} state The state to check.
   * @return {Boolean}     true if the button is in the specified state;
   * Otherwise, false.
   */
  this.isState = function(state) {
    if (util.isNullOrUndefined(_button)) {
      return false;
    }
    return _button.isState(state);
  };
}

ButtonEvent.prototype.constructor = ButtonEvent;

module.exports = ButtonEvent;
