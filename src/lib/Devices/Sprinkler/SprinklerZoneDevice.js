"use strict";
//
//  SprinklerZoneDevice.js
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
var inherits = require('util').inherits;
var SprinklerZoneBase = require('./SprinklerZoneBase.js');
var ZoneStateChangeEvent = require('./ZoneStateChangeEvent.js');
var RelayState = require('../../Components/Relays/RelayState.js');
var ArgumentNullException = require('../../ArgumentNullException.js');
var ObjectDisposedException = require('../../ObjectDisposedException.js');

/**
 * @classdesc Base class for sprinkler zones.
 * @param {Relay} relay The relay that will be used to control this zone.
 * @param {String} name  The name of this sprinkler (optional).
 * @throws {ArgumentNullException} if the 'relay' param is null or undefined.
 * @constructor
 * @extends {SprinklerZoneBase}
 */
function SprinklerZoneDevice(relay, name) {
  SprinklerZoneBase.call(this, name);

  if (util.isNullOrUndefined(relay)) {
    throw new ArgumentNullException("'relay' param cannot be null or undefined.");
  }

  var _relay = relay;

  /**
   * Releases all managed resources used by this instance.
   * @override
   */
  this.dispose = function() {
    if (SprinklerZoneBase.prototype.isDisposed.call(this)) {
      return;
    }

    if (!util.isNullOrUndefined(_relay)) {
      _relay.dispose();
      _relay = undefined;
    }

    SprinklerZoneBase.prototype.dispose.call(this);
  };

  /**
   * Gets whether or not this zone is on.
   * @return {Boolean} true if the sprinkler is on; Otherwise, false.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @override
   */
  this.isOn = function() {
    if (SprinklerZoneBase.prototype.isDisposed.call(this)) {
      throw new ObjectDisposedException("SprinklerZoneDevice");
    }
    return _relay.isClosed();
  };

  /**
   * Sets the state of this zone.
   * @param  {Boolean} on Set true to turn the zone on or false to turn it off.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  this.setState = function(on) {
    if (SprinklerZoneBase.prototype.isDisposed.call(this)) {
      throw new ObjectDisposedException("SprinklerZoneDevice");
    }

    if (_relay.isClosed() !== on) {
      var state = on ? RelayState.Closed : RelayState.Open;
      _relay.setState(state);
    }
  };
}

SprinklerZoneBase.prototype.constructor = SprinklerZoneBase;
inherits(SprinklerZoneDevice, SprinklerZoneBase);

module.exports = SprinklerZoneBase;
