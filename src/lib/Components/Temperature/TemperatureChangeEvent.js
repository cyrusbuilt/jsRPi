"use strict";
//
//  TemperatureChangeEvent.js
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
* @classdesc The event that gets raised when a change in temperature occurs.
* @param {Number} oldTemp The temperature value prior to the change event.
* @param {Number} newTemp The temperature value since the change event.
* @constructor
* @event
*/
function TemperatureChangeEvent(oldTemp, newTemp) {
  var _oldTemp = oldTemp;
  if (util.isNullOrUndefined(_oldTemp)) {
    _oldTemp = 0;
  }

  var _newTemp = newTemp;
  if (util.isNullOrUndefined(_newTemp)) {
    _newTemp = 0;
  }

  /**
  * Gets the previous temperature value.
  * @return {Number} The previous temperature value.
  */
  this.getOldTemp = function() {
    return _oldTemp;
  };

  /**
  * Gets the current temperature value.
  * @return {Number} The current temperature.
  */
  this.getNewTemp = function() {
    return _newTemp;
  };

  /**
  * Gets the temperature change.
  * @return {Number} The change value (difference).
  */
  this.getTemperatureChange = function() {
    return (_newTemp - _oldTemp);
  };
}

TemperatureChangeEvent.prototype.constructor = TemperatureChangeEvent;
module.exports = TemperatureChangeEvent;
