"use strict";
//
//  GarageDoorOpenerBase.js
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
var GarageDoorOpener = require('./GarageDoorOpener.js');
var OpenerDevice = require('../Access/OpenerDevice.js');

/**
* @classdesc Base class for garage door opener device abstractions.
* @param {Relay} relay                The relay that controls the door.
* @param {Sensor} doorSensor          The sensor that indicates the state of
* the door.
* @param {SensorState} doorSensorOpenState The sensor state that indicates the
* door is open.
* @param {Switch} lok                 The switch that controls the lock.
* @constructor
* @implements {GarageDoorOpener}
* @extends {OpenerDevice}
*/
function GarageDoorOpenerBase(relay, doorSensor, doorSensorOpenState, lok) {
  GarageDoorOpener.call(this);

  var self = this;
  var _base = new OpenerDevice(relay, doorSensor, doorSensorOpenState, lok);

  /**
  * Device name property.
  * @property {String}
  */
  this.deviceName = _base.deviceName;

  /**
  * Tag property.
  * @property {Object}
  */
  this.tag = _base.tag;

  /**
  * Gets relay being used to trigger the opener motor.
  * @returns {Relay} The relay used to the trigger the opener motor.
  */
  this.getTriggerRelay = function() {
    return _base.getTriggerRelay();
  };

  /**
  * Gets the sensor used to determine the opener's state.
  * @returns {Sensor} The sensor used to determine the state.
  */
  this.getStateSensor = function() {
    return _base.getStateSensor();
  };

  /**
  * Gets the switch being used to lock the opener.
  * @returns {Switch} Switch used to enable/disable the lock.
  */
  this.getLockSwitch = function() {
    return _base.getLockSwitch();
  };

  /**
  * Determines whether or not the current instance has been disposed.
  * @return {Boolean} true if disposed; Otherwise, false.
  * @override
  */
  this.isDisposed = function() {
    return _base.isDisposed();
  };

  /**
  * Gets the property collection.
  * @return {Array} A custom property collection.
  * @override
  */
  this.getPropertyCollection = function() {
    return _base.getPropertyCollection();
  };

  /**
  * Checks to see if the property collection contains the specified key.
  * @param  {String}  key The key name of the property to check for.
  * @return {Boolean} true if the property collection contains the key;
  * Otherwise, false.
  * @override
  */
  this.hasProperty = function(key) {
    return _base.hasProperty(key);
  };

  /**
  * Sets the value of the specified property. If the property does not already exist
  * in the property collection, it will be added.
  * @param  {String} key   The property name (key).
  * @param  {String} value The value to assign to the property.
  */
  this.setProperty = function(key, value) {
    _base.setProperty(key, value);
  };

  /**
  * Removes all event listeners.
  * @override
  */
  this.removeAllListeners = function() {
    _base.removeAllListeners();
  };

  /**
  * Attaches a listener (callback) for the specified event name.
  * @param  {String}   evt      The name of the event.
  * @param  {Function} callback The callback function to execute when the
  * event is raised.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @override
  */
  this.on = function(evt, callback) {
    _base.on(evt, callback);
  };

  /**
  * Emits the specified event.
  * @param  {String} evt  The name of the event to emit.
  * @param  {Object} args The object that provides arguments to the event.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @override
  */
  this.emit = function(evt, args) {
    _base.emit(evt, args);
  };

  /**
  * Raises the opener state change event.
  * @param  {OpenerStateChangeEvent} stateChangeEvent The event object.
  * @override
  */
  this.onOpenerStateChange = function(stateChangeEvent) {
    _base.onOpenerStateChange(stateChangeEvent);
  };

  /**
  * Raises the lock state change event.
  * @param  {OpenerLockChangeEvent} lockStateChangeEvent The event object.
  * @override
  */
  this.onLockStateChange = function(lockStateChangeEvent) {
    _base.onLockStateChange(lockStateChangeEvent);
  };

  /**
  * Releases all resources used by the OpenerDevice object.
  * @override
  */
  this.dispose = function() {
    _base.dispose();
  };

  /**
  * Gets a value indicating whether this opener is locked and thus, cannot be
  * opened.
  * @return {Boolean} true if locked; Otherwise, false.
  *                    @override
  */
  this.isLocked = function() {
    return _base.isLocked();
  };

  /**
  * Gets the state of this opener.
  * @return {OpenerState} The state of the opener.
  * @override
  */
  this.getState = function() {
    return _base.getState();
  };

  /**
  * Gets a value indicating whether this opener is open.
  * @return {Boolean} true if open; Otherwise, false.
  *                    @override
  */
  this.isOpen = function() {
    return _base.isOpen();
  };

  /**
  * Fets a value indicating whether this opner is in the the process of opening.
  * @return {Boolean} true if opening; Otherwise, false.
  * @override
  */
  this.isOpening = function() {
    return _base.isOpening();
  };

  /**
  * Fets a value indicating whether this opener is closed.
  * @return {Boolean} true if closed; Otherwise, false.
  * @override
  */
  this.isClosed = function() {
    return _base.isClosed();
  };

  /**
  * Fets a value indicating whether this opener is in the process of closing.
  * @return {Boolean} true if closing; Otherwise, false.
  * @override
  */
  this.isClosing = function() {
    return _base.isClosing();
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
  * Instructs the device to open.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @throws {OpenerLockedException} If the opener is currently locked.
  * @override
  */
  this.open = function() {
    _base.open();
  };

  /**
  * Instructs the device to close.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @throws {OpenerLockedException} If the opener is currently locked.
  * @override
  */
  this.close = function() {
    _base.close();
  };

  /**
  * Manually overrides the state of the lock. This can be used to force lock or
  * force unlock the opener. This will cause this opener to ignore the state of
  * the lock (if specified) and only read the specified lock state.
  * @param  {SwitchState} overridedState The state to override with.
  */
  this.overrideLock = function(overridedState) {
    _base.overrideLock(overridedState);
  };

  /**
  * Disables the lock override. This will cause this opener to resume reading
  * the actual state of the lock (if specified).
  */
  this.disableOverride = function() {
    _base.disableOverride();
  };
}

GarageDoorOpenerBase.prototype.constructor = GarageDoorOpenerBase;
inherits(GarageDoorOpenerBase, GarageDoorOpener);

module.exports = GarageDoorOpenerBase;
