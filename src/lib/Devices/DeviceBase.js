"use strict";

//
//  DeviceBase.js
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
var Device = require('./Device.js');

/**
 * @classdesc Base class for device abstractions.
 * @param {Array} props A collection of component properties (optional).
 * @constructor
 * @implements {Device}
 */
function DeviceBase(props) {
  Device.call(this);

  var self = this;
  var _props = props || [];
  var _isDisposed = false;

  /**
   * Determines whether or not the current instance has been disposed.
   * @return {Boolean} true if disposed; Otherwise, false.
   * @override
   */
  this.isDisposed = function() {
    return _isDisposed;
  };

  /**
   * Gets the property collection.
   * @return {Array} A custom property collection.
   * @override
   */
  this.getPropertyCollection = function() {
    return _props;
  };

  /**
   * Checks to see if the property collection contains the specified key.
   * @param  {String} key The key name of the property to check for.
   * @return {Boolean}    true if the property collection contains the key;
   * Otherwise, false.
   * @override
   */
  this.hasProperty = function(key) {
    return (key in _props);
  };

  /**
   * Sets the value of the specified property. If the property does not already exist
	 * in the property collection, it will be added.
   * @param  {String} key   The property name (key).
   * @param  {String} value The value to assign to the property.
   */
  this.setProperty = function(key, value) {
    if (self.hasProperty(key)) {
      _props[key] = value;
    }
    else {
      _props.push([key, value]);
    }
  };

  /**
   * Returns the string representation of this object. In this case, it simply
   * returns the component name.
   * @return {String} The name of this component.
   */
  this.toString = function() {
    return self.deviceName;
  };

  /**
   * Releases all managed resources used by this instance.
   * @override
   */
  this.dispose = function() {
    if (_isDisposed) {
      return;
    }

    _props = undefined;
    self.tag = undefined;
    self.deviceName = undefined;
    _isDisposed = true;
  };
}

DeviceBase.prototype.constructor = DeviceBase;
inherits(DeviceBase, Device);

module.exports = DeviceBase;
