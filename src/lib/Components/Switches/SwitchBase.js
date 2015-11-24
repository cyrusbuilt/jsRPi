"use strict";

//
//  SwitchBase.js
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
var Switch = require('./Switch.js');
var ComponentBase = require('../ComponentBase.js');
var EventEmitter = require('events').EventEmitter;
var SwitchState = require('./SwitchState.js');
var ObjectDisposedException = require('../../ObjectDisposedException.js');

/**
 * @classdesc Base class for switch component abstractions.
 * @constructor
 * @implements {Switch}
 * @extends {ComponentBase}
 * @extends {EventEmitter}
 */
function SwitchBase() {
	Switch.call(this);
  
  	var self = this;
	var _base = new ComponentBase();
	var _emitter = new EventEmitter();
	var _state = SwitchState.Off;
	
	/**
    * Component name property.
    * @property {String}
    */
  	this.componentName = _base.componentName;

  	/**
    * Tag property.
    * @property {Object}
    */
  	this.tag = _base.tag;

  	/**
    * Gets the property collection.
    * @return {Array} A custom property collection.
    *                  @override
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
    * Determines whether or not this instance has been disposed.
    * @return {Boolean} true if disposed; Otherwise, false.
    * @override
    */
  	this.isDisposed = function() {
		return _base.isDisposed();
  	};
	
	/**
    * Releases all resources used by the SensorBase object.
    * @override
    */
	this.dispose = function() {
		if (_base.isDisposed()) {
			return;
		}
		
		_emitter.removeAllListeners();
		_emitter = undefined;
		_base.dispose();
	};
	
	/**
    * Removes all event listeners.
    * @override
    */
	this.removeAllListeners = function() {
   	if (!_base.isDisposed()) {
      	_emitter.removeAllListeners();
    	}
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
      	throw new ObjectDisposedException("SensorBase");
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
      	throw new ObjectDisposedException("SensorBase");
    	}
    	_emitter.emit(evt, args);
  	};

  	/**
    * Fires the switch state change event.
    * @param  {SwitchStateChangeEvent} switchStateEvent The event info object.
    * @throws {ObjectDisposedException} if this instance has been disposed.                                                  
    * @override
    */
  	this.onSwitchStateChanged = function(switchStateEvent) {
		if (_base.isDisposed()) {
			throw new ObjectDisposedException("SwitchBase");
		}
		
		var e = _emitter;
		var evt = switchStateEvent;
   	process.nextTick(function() {
      	e.emit(Switch.EVENT_STATE_CHANGED, evt);
    	}.bind(this));
  	};
	
	/**
 	 * In a derived class, gets the state of the switch.
    * @return {SwitchState} The state of the switch.
    */
	this.getState = function() {
		return _state;
	};

  	/**
    * Gets whether or not this switch is in the specified state.
    * @param  {SwitchState} state The state to check against.
    * @return {Boolean}     true if this switch is in the specified state;
    * Otherwise, false.
    * @override
    */
  	this.isState = function(state) {
   	return (self.getState() === state);
  	};

  	/**
    * Gets whether or not this switch is in the on position.
    * @return {Boolean} true if on; Otherwise, false.
    * @override
    */
  	this.isOn = function() {
   	return self.isState(SwitchState.On);
  	};

  	/**
    * Gets whether or not this switch is in the off position.
    * @return {Boolean} true if off; Otherwise, false.
    * @override
    */
  	this.isOff = function() {
   	return self.isState(SwitchState.Off);
  	};
	
	/**
    * Converts the current instance to it's string representation. This method
    * simply returns the component name.
    * @return {String} The component name.
    * @override
    */
  	this.toString = function() {
    	return self.componentName;
  	};
}

SwitchBase.prototype.constructor = SwitchBase;
inherits(SwitchBase, Switch);

module.exports = SwitchBase;
