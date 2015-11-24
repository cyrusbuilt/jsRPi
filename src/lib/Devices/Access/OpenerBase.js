"use strict";
//
//  OpenerBase.js
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
var Opener = require('./Opener.js');
var DeviceBase = require('../DeviceBase.js');
var EventEmitter = require('events').EventEmitter;
var OpenerStateChangeEvent = require('./OpenerStateChangeEvent.js');
var OpenerLockChangeEvent = require('./OpenerLockChangeEvent.js');
var OpenerState = require('./OpenerState.js');
var ObjectDisposedException = require('../../ObjectDisposedException.js');

/**
 * @classdesc Base class for opener device abstractions.
 * @constructor
 * @implements {Opener}
 * @extends {DeviceBase}
 * @extends {EventEmitter}
 */
function OpenerBase() {
  	Opener.call(this);
	
  	var self = this;
	var _base = new DeviceBase();
	var _emitter = new EventEmitter();
	var _state = OpenerState.Closed;
	
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
		_emitter.removeAllListeners();
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
		if (_base.isDisposed()) {
			throw new ObjectDisposedException("OpenerBase");
		}
		_emitter.on(evt, callback);
	};
	
	/**
    * Emits the specified event.
    * @param  {String} evt  The name of the event to emit.
    * @param  {Object} args The object that provides arguments to the event.
    * @throws {ObjectDisposedException} if this instance has been disposed.
    * @override
    */
  	this.emit = function(evt, args) {
		if (_base.isDisposed()) {
			throw new ObjectDisposedException("OpenerBase");
		}
		_emitter.emit(evt, args);
	};
	
  	/**
    * Raises the opener state change event.
    * @param  {OpenerStateChangeEvent} stateChangeEvent The event object.
    * @override
    */
  	this.onOpenerStateChange = function(stateChangeEvent) {
		if (_base.isDisposed()) {
			throw new ObjectDisposedException("OpenerBase");
		}
		
		var e = _emitter;
		var evt = stateChangeEvent;
    	process.nextTick(function() {
      	e.emit(Opener.EVENT_STATE_CHANGED, evt);
    	}.bind(this));
  	};

	/**
 	 * Gets the state of this opener.
 	 * @return {OpenerState} The state of the opener.
 	 * @override                      
 	 */
	this.getState = function() {
		return _state;
	};
	
  	/**
    * Raises the lock state change event.
    * @param  {OpenerLockChangeEvent} lockStateChangeEvent The event object.
    * @override
    */
  	this.onLockStateChange = function(lockStateChangeEvent) {
		if (_base.isDisposed()) {
			throw new ObjectDisposedException("OpenerBase");
		}
		
		var e = _emitter;
		var evt = lockStateChangeEvent;
    	process.nextTick(function() {
      	e.emit(Opener.EVENT_LOCK_STATE_CHANGED, evt);
    	}.bind(this));
  	};

  	/**
    * Gets a value indicating whether this opener is open.
    * @return {Boolean} true if open; Otherwise, false.
    *                    @override
    */
  	this.isOpen = function() {
    	return (self.getState() === OpenerState.Open);
  	};

  	/**
    * Fets a value indicating whether this opner is in the the process of opening.
    * @return {Boolean} true if opening; Otherwise, false.
    * @override
    */
  	this.isOpening = function() {
    	return (self.getState() === OpenerState.Opening);
  	};

  	/**
    * Fets a value indicating whether this opener is closed.
    * @return {Boolean} true if closed; Otherwise, false.
    * @override
    */
  	this.isClosed = function() {
    	return (self.getState() === OpenerState.Closed);
  	};

  	/**
    * Fets a value indicating whether this opener is in the process of closing.
    * @return {Boolean} true if closing; Otherwise, false.
    * @override
    */
  	this.isClosing = function() {
    	return (self.getState() === OpenerState.Closing);
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
    * Releases all resources used by the GpioBase object.
    * @override
    */
  	this.dispose = function() {
		if (_base.isDisposed()) {
			return;
		}
		
		_emitter.removeAllListeners();
		_emitter = undefined;
		_state = OpenerState.Closed;
		_base.dispose();
	};
}

OpenerBase.prototype.constructor = OpenerBase;
inherits(OpenerBase, Opener);

module.exports = OpenerBase;
