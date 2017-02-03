"use strict";

//
//  MomentarySwitchBase.js
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

const MomentarySwitch = require('./MomentarySwitch.js');
const SwitchBase = require('./SwitchBase.js');
const ObjectDisposedException = require('../../ObjectDisposedException.js');

/**
* @classdesc Base class for momentary switch component abstractions.
* @extends {SwitchBase}
*/
class MomentarySwitchBase extends MomentarySwitch {
  /**
   * Initializes a new instance jsrpi.Components.Switches.MomentarySwitchBase
   * class.
   * @constructor
   */
  constructor() {
    super();

    this._base = new SwitchBase();
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
   * Gets or sets the object this component is tagged with (if set).
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
   * Determines whether or not this instance has been disposed.
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

    this._base.dispose();
  }

  /**
   * Removes all event listeners.
   * @override
   */
  removeAllListeners() {
    if (!this._base.isDisposed) {
      this._base.removeAllListeners();
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
    this._base.on(evt, callback);
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
    this._base.emit(evt, args);
  }
  /**
  * Fires the switch state change event.
  * @param  {SwitchStateChangeEvent} switchStateEvent The event info object.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @override
  */
  onSwitchStateChanged(switchStateEvent) {
    this._base.onSwitchStateChanged(switchStateEvent);
  }

  /**
  * In a derived class, gets the state of the switch.
  * @property {SwitchState} state - The switch state.
  */
  get state() {
    return this._base.state;
  }

  /**
  * Gets whether or not this switch is in the specified state.
  * @param  {SwitchState} state The state to check against.
  * @return {Boolean}     true if this switch is in the specified state;
  * Otherwise, false.
  * @override
  */
  isState(state) {
    return this._base.isState(state);
  }

  /**
  * Gets whether or not this switch is in the on position.
  * @property {Boolean} isOn - true if on; Otherwise, false.
  * @readonly
  * @override
  */
  get isOn() {
    return this._base.isOn;
  }

  /**
  * Gets whether or not this switch is in the off position.
  * @property {Boolean} isOff - true if off; Otherwise, false.
  * @readonly
  * @override
  */
  get isOff() {
    return this._base.isOff;
  }

  /**
  * Converts the current instance to it's string representation. This method
  * simply returns the component name.
  * @return {String} The component name.
  * @override
  */
  toString() {
    return this._base.componentName;
  }
}

module.exports = MomentarySwitchBase;
