"use strict";

//
//  DimmableLightBase.js
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

const DimmableLight = require('./DimmableLight.js');
const ComponentBase = require('../ComponentBase.js');
const EventEmitter = require('events').EventEmitter;
const Light = require('./Light.js');
const ObjectDisposedException = require('../../ObjectDisposedException.js');

/**
 * @classdesc Base class for dimmable light component abstractions.
 * @implements {DimmableLight}
 * @extends {ComponentBase}
 * @extends {EventEmitter}
 */
class DimmableLightBase extends DimmableLight {
  /**
   * Initializes a new instance of the jsrpi.Components.Lights.DimmableLightBase
   * class.
   * @constructor
   */
  constructor() {
    super();

    this._base = new ComponentBase();
    this._emitter = new EventEmitter();
  }

  /**
   * Gets or sets the name of this component.
   * @property {String} componentName - The name of the component.
   * @override
   */
  get componentName() {
    return this._base.componentName;
  }

  set componentName(name) {
    this._base.componentName = name;
  }

  /**
   * Gets or sets the object this component is tagged with.
   * @property {Object} tag - The tag.
   * @override
   */
  get tag() {
    return this._base.tag;
  }

  set tag(t) {
    this._base.tag = t;
  }

  /**
  * Gets the custom property collection.
  * @property {Array} propertyCollection - The property collection.
  * @readonly
  * @override
  */
  get propertyCollection() {
    return this._base.propertyCollection;
  }

  /**
   * Checks to see if the property collection contains the specified key.
   * @param  {String} key The key name of the property to check for.
   * @return {Boolean}    true if the property collection contains the key;
   * Otherwise, false.
   * @override
   */
  hasProperty(key) {
    return this._base.hasProperty(key);
  }

  /**
   * Sets the value of the specified property. If the property does not already exist
	 * in the property collection, it will be added.
   * @param  {String} key   The property name (key).
   * @param  {String} value The value to assign to the property.
   * @override
   */
  setProperty(key, value) {
    this._base.setProperty(key, value);
  }

  /**
   * Determines whether or not this instance has been disposed. Returns
   * @property {Boolean} isDisposed - true if disposed; Otherwise, false.
   * @readonly
   * @override
   */
  get isDisposed() {
    return this._base.isDisposed;
  }

  /**
   * In subclasses, performs application-defined tasks associated with freeing,
   * releasing, or resetting resources.
   * @override
   */
  dispose() {
    if (this._base.isDisposed) {
      return;
    }

    this._emitter.removeAllListeners();
    this._emitter = undefined;
    this._base.dispose();
  }

  /**
   * Removes all event listeners.
   * @override
   */
  removeAllListeners() {
    if (!this._base.isDisposed) {
      this._emitter.removeAllListeners();
    }
  }

  /**
   * Attaches a listener (callback) for the specified event name.
   * @param  {String}   evt      The name of the event.
   * @param  {Function} callback The callback function to execute when the
   * event is raised.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @override
   */
  on(evt, callback) {
    if (this._base.isDisposed) {
      throw new ObjectDisposedException("GpioBase");
    }
    this._emitter.on(evt, callback);
  }

  /**
   * Emits the specified event.
   * @param  {String} evt  The name of the event to emit.
   * @param  {Object} args The object that provides arguments to the event.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @override
   */
  emit(evt, args) {
    if (this._base.isDisposed) {
      throw new ObjectDisposedException("GpioBase");
    }
    this._emitter.emit(evt, args);
  }

  /**
   * Gets a value indicating whether this light is on. Returns true if the light
   * is on; Otherwise, false.
   * @property {Boolean}
   * @readonly
   * @override
   */
  get isOn() {
    return (this.level > this.minLevel);
  }

  /**
   * Gets a value indicating whether this light is off.
   * @property {Boolean} isOff - true if the light is off; Otherwise, false.
   * @readonly
   * @override
   */
  get isOff() {
    return (this.level <= this.minLevel);
  }

  /**
   * Switches the light on.
   * @override
   */
  turnOn() {
    this.level = this.maxLevel;
  }

  /**
   * Switches the light off.
   * @override
   */
  turnOff() {
    this.level = this.minLevel;
  }

  /**
   * Fires the light state change event.
   * @param  {LightStateChangeEvent} lightChangeEvent The state change event
   * object.
   * @override
   */
  onLightStateChange(lightChangeEvent) {
    if (this._base.isDisposed) {
      throw new ObjectDisposedException("DimmableLightBase");
    }

    setImmediate(() => {
      this.emit(Light.EVENT_STATE_CHANGED, lightChangeEvent);
    });
  }

  /**
   * Raises the light level changed event.
   * @param  {LightlevelChangeEvent} levelChangeEvent The level change event
   * object.
   * @override
   */
  onLightLevelChanged(levelChangeEvent) {
    if (this._base.isDisposed) {
      throw new ObjectDisposedException("DimmableLightBase");
    }

    setImmediate(() => {
      this.emit(Light.EVENT_LEVEL_CHANGED, levelChangeEvent);
    });
  }

  /**
   * Gets the current brightness level percentage.
   * @param  {Number} level The brightness level.
   * @return {Number}       The brightness percentage level.
   * @override
   */
  getLevelPercentage(level) {
    level = level || this.level;
    let min = Math.min(this.minLevel, this.maxLevel);
    let max = Math.max(this.minLevel, this.maxLevel);
    let range = (max - min);
    let percentage = ((level * 100) / range);
    return percentage;
  }
}

module.exports = DimmableLightBase;
