"use strict";

//
//  Component.js
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

const Disposable = require('../Disposable.js');

/**
 * A hardware abstraction component interface.
 * @interface
 * @extends {Disposable}
 */
class Component extends Disposable {
  /**
   * Initializes a new instanc of the jsrpi.Components.Component interface.
   * @constructor
   */
  constructor() {
    super();

    this._componentName = "";
    this._tag = null;
  }

  /**
   * Gets or sets the name of this component.
   * @property {String} componentName - The component name.
   */
  get componentName() {
    return this._componentName;
  }

  set componentName(name) {
    this._componentName = name;
  }

  /**
   * Gets or sets the object this component is tagged with (if set).
   * @property {Object} tag - The tag.
   */
  get tag() {
    return this._tag;
  }

  set tag(t) {
    this._tag = t;
  }

  /**
   * In an implementing class, gets the property collection.
   * @property {Array} propertyCollection - The property collection.
   * @readonly
   */
  get propertyCollection() {
    return null;
  }

  /**
   * In an implementing class, checks to see if the property collection contains
   * the specified key.
   * @param  {String} key The key name of the property to check for.
   * @return {Boolean}    true if the property collection contains the key;
   * Otherwise, false.
   */
  hasProperty(key) { return false; }
}

module.exports = Component;
