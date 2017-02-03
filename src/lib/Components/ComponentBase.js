"use strict";

//
//  ComponentBase.js
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

const Component = require('./Component.js');

/**
* @classdesc Base class for hardware abstraction components.
* @implements {Component}
*/
class ComponentBase extends Component {
  /**
   * Initializes a new instance of the jsrpi.Components.ComponentBase class with
   * an optional array of properties.
   * @param {Array} props A collection of component properties (optional).
   * @constructor
   */
  constructor(props) {
      super();
      
    this._props = props || [];
    this._isDisposed = false;
  }

  /**
  * Determines whether or not the current instance has been disposed.
  * @property {Boolean} isDisposed - true if disposed; Otherwise, false.
  * @readonly
  * @override
  */
  get isDisposed() {
    return this._isDisposed;
  }

  /**
  * Gets the custom property collection.
  * @property {Array} propertyCollection - The property collection.
  * @readonly
  * @override
  */
  get propertyCollection() {
    return this._props;
  }

  /**
  * Checks to see if the property collection contains the specified key.
  * @param  {String} key The key name of the property to check for.
  * @return {Boolean}    true if the property collection contains the key;
  * Otherwise, false.
  * @override
  */
  hasProperty(key) {
    return (key in this._props);
  }

  /**
  * Sets the value of the specified property. If the property does not already exist
  * in the property collection, it will be added.
  * @param  {String} key   The property name (key).
  * @param  {String} value The value to assign to the property.
  */
  setProperty(key, value) {
    this._props[key] = value;
  }

  /**
  * Returns the string representation of this object. In this case, it simply
  * returns the component name.
  * @return {String} The name of this component.
  * @override
  */
  toString() {
    return super.componentName;
  }

  /**
  * Releases all managed resources used by this instance.
  * @override
  */
  dispose() {
    if (this._isDisposed) {
      return;
    }

    this._props = undefined;
    super.tag = undefined;
    super.componentName = undefined;
    this._isDisposed = true;
  }
}

module.exports = ComponentBase;
