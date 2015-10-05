"use strict";

//
//  RelayComponent.js
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
var Relay = require('./Relay.js');
var RelayBase = require('./RelayBase.js');
var RelayState = require('./RelayState.js');
var RelayStateChangeEvent = require('./RelayStateChangeEvent.js');
var PinState = require('../../IO/PinState.js');

/**
 * @classdesc A component that is an abstraction of a relay.
 * @param {Gpio} pin The I/O pin to use to drive the relay.
 * @throws {ArgumentNullException} if the pin is null or undefined.
 * @constructor
 * @extends {RelayBase}
 */
function RelayComponent(pin) {
  RelayBase.call(this, pin);
  var self = this;

  /**
   * Gets the relay state.
   * @return {RelayState} The state of the relay.
   * @override
   */
  this.getState = function() {
    if (RelayBase.prototype.getState.call(this) === Relay.OPEN_STATE) {
      return RelayState.Open;
    }
    return RelayState.Closed;
  };

  /**
   * Sets the state of the relay.
   * @param  {RelayState} state the state to set.
   * @override
   */
  this.setState = function(state) {
    var oldState = self.getState();
    if (oldState !== state) {
      switch(state) {
        case RelayState.Open:
          if (!RelayBase.prototype.isOpen.call(this)) {
            RelayBase.prototype.getPin.call(this).write(PinState.Low);
          }
          break;
        case RelayState.Closed:
          if (!RelayBase.prototype.isClosed.call(this)) {
            RelayBase.prototype.getPin.call(this).write(PinState.High);
          }
          break;
        default:
          break;
      }
      var evt = new RelayStateChangeEvent(oldState, self.getState());
      RelayBase.prototype.onRelayStateChanged.call(this, evt);
    }
  };
}

RelayComponent.prototype.constructor = RelayComponent;
inherits(RelayComponent, RelayBase);

module.exports = RelayComponent;
