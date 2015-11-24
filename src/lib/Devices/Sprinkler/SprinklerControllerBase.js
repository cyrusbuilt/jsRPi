"use strict";
//
//  SprinklerControllerBase.js
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

var _ = require('underscore');
var util = require('util');
var inherits = require('util').inherits;
var SprinklerController = require('./SprinklerController.js');
var ZoneStateChangeEvent = require('./ZoneStateChangeEvent.js');
var SprinklerZone = require('./SprinklerZone.js');
var DeviceBase = require('../DeviceBase.js');
var EventEmitter = require('events').EventEmitter;
var NotImplementedException = require('../../NotImplementedException.js');
var ObjectDisposedException = require('../../ObjectDisposedException.js');

/**
 * @classdesc Sprinkler controller base class.
 * @constructor
 * @implements {SprinklerController}
 * @extends {DeviceBase}
 * @extends {EventEmitter}
 */
function SprinklerControllerBase() {
  	SprinklerController.call(this);

  	var self = this;
	var _base = new DeviceBase();
	var _emitter = new EventEmitter();
  	var _zones = [];
	
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
			throw new ObjectDisposedException("FireplaceBase");
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
			throw new ObjectDisposedException("FireplaceBase");
		}
		_emitter.emit(evt, args);
	};

  	/**
    * Releases all managed resources used by this instance. This *does not*
    * dispose any sprinkler zones attached to this controller.
    * @override
    */
  	this.dispose = function() {
    	if (_base.isDisposed()) {
      	return;
    	}

    	if (!util.isNullOrUndefined(_zones)) {
			for (var i = 0; i < _zones.length; i++) {
				_zones[i].dispose();
			}
      	_zones = undefined;
    	}
		
		_emitter.removeAllListeners();
		_emitter = undefined;
    	_base.dispose();
  	};

  	/**
    * Adds a sprikler zone to this controller if it does not already exist.
    * @param  {SprinklerZone} sprinklerZone The zone to add.
    */
  	this.addZone = function(sprinklerZone) {
    	if ((_zones[sprinklerZone.zoneID] === undefined) &&
        	 (_zones.indexOf(sprinklerZone) === -1)) {
      	_zones.push(sprinklerZone);
      	var idx = _zones.indexOf(sprinklerZone);
      	_zones[idx].zoneID = idx;
    	}
  	};

  	/**
    * Removes the specified zone from the controller if it exists.
    * @param  {SprinklerZone} sprinklerZone The zone to remove.
    */
  	this.removeZone = function(sprinklerZone) {
    	if ((_zones[sprinklerZone.zoneID] !== undefined) ||
        	 (_zones.indexOf(sprinklerZone) > 0)) {
      	var idx = sprinklerZone.zoneID || _zones.indexOf(sprinklerZone);
      	_zones[idx].zoneID = -1;
      	_zones.splice(idx, 1);
    	}
  	};

  	/**
    * Raises the SprinklerZone.EVENT_STATE_CHANGED event.
    * @param  {ZoneStateChangeEvent} sprinklerStateChangeEvent The event object.
    */
  	this.onSprinklerStateChange = function(sprinklerStateChangeEvent) {
		if (_base.isDisposed()) {
			throw new ObjectDisposedException("FireplaceBase");
		}
		
		var e = _emitter;
		var evt = sprinklerStateChangeEvent;
    	process.nextTick(function() {
      	e.emit(SprinklerZone.EVENT_STATE_CHANGED, evt);
    	}.bind(this));
  	};

  	/**
    * Gets the zone count.
    * @return {Number} The number zones being controlled.
    */
  	this.getZoneCount = function() {
    	return _.size(_zones);
  	};

  	/**
    * Gets the zones assigned to this controller.
    * @return {Array} An array of zones (SprinklerZone objects) assigned to the
    * controller.
    */
  	this.getZones = function() {
    	return _zones;
  	};

  	/**
    * Gets a value indicating whether this controller is on.
    * @return {Boolean} true if the controller is on; Otherwise, false.
    */
  	this.isOn = function() {
    	var result = false;
		var count = self.getZoneCount();
     	for (var i = 0; i < count; i++) {
      	result = _zones[i].isOn();
      	if (result) {
        		break;
      	}
    	}
    	return result;
  	};

  	/**
    * Gets a value indicating whether this controller is off.
    * @return {Boolean} true if the controller is off; Otherwise, false.
    */
  	this.isOff = function() {
    	return !self.isOn();
  	};

  	/**
    * Determines whether the specified zone is on.
    * @param  {Number}  zone The zone to check.
    * @return {Boolean} true if the specified zone is on; Otherwise, false.
    */
  	this.isOnForZone = function(zone) {
    	if (_.isNumber(zone)) {
      	if ((zone >= 0) && (_zones[zone] !== undefined)) {
        		return _zones[zone].isOn();
      	}
    	}
    	return false;
  	};

  	/**
    * Determines whether the specified zone is off.
    * @param  {Number}  zone The zone to check.
    * @return {Boolean} true if the specified zone is off; Otherwise, false.
    */
  	this.isOffForZone = function(zone) {
    	if (_.isNumber(zone)) {
      	if ((zone >= 0) && (_zones[zone] !== undefined)) {
        		return _zones[zone].isOff();
      	}
    	}
    	return false;
  	};

  	/**
    * In a derived class, turns the specified zone on.
    * @param  {Number} zone The zone to turn on.
    */
  	this.turnOn = function(zone) {
    	if (self.isOffForZone(zone)) {
      	if (_.isNumber(zone)) {
        		if ((zone >= 0) && (_zones[zone] !== undefined)) {
          		_zones[zone].turnOn();
          		self.onSprinklerStateChange(new ZoneStateChangeEvent(false, true, zone));
        		}
      	}
    	}
  	};

  	/**
    * Turns all zones on.
    */
  	this.turnOnAllZones = function() {
		var count = self.getZoneCount();
    	for (var i = 0; i < count; i++) {
      	if (_zones[i].isOff()) {
        		_zones[i].turnOn();
        		self.onSprinklerStateChange(new ZoneStateChangeEvent(false, true, i));
      	}
    	}
  	};

  	/**
    * Turns off the specified zone.
    * @param  {Number} zone The zone to turn off.
    */
  	this.turnOff = function(zone) {
    	if (self.isOnForZone(zone)) {
      	if (_.isNumber(zone)) {
        		if ((zone >= 0) && (_zones[zone] !== undefined)) {
          		_zones[zone].turnOff();
          		self.onSprinklerStateChange(new ZoneStateChangeEvent(true, false, zone));
        		}
      	}
    	}
  	};

  	/**
    * Turns off all zones.
    */
  	this.turnOffAllZones = function() {
		var count = self.getZoneCount();
    	for (var i = 0; i < count; i++) {
      	if (_zones[i].isOn()) {
        		_zones[i].turnOff();
        		self.onSprinklerStateChange(new ZoneStateChangeEvent(true, false, i));
      	}
    	}
  	};

  	/**
    * Sets the state of the specified zone.
    * @param  {Number}  zone The zone to set the state of.
    * @param  {Boolean} on   Set true to turn on the specified zone.
    */
  	this.setState = function(zone, on) {
    	var oldState = self.isOnForZone(zone);
    	_zones[zone].setState(on);
    	self.onSprinklerStateChange(new ZoneStateChangeEvent(oldState, on, zone));
  	};

  	/**
    * Gets a value indicating whether the sprinklers are raining.
    * @return {Boolean} true if the sprinklers are raining; Otherwise, false.
    * @throws {NotImplementedException} because this method is not implemented
    * in this class.
    * @override
    */
  	this.isRaining = function() {
    	throw new NotImplementedException();
  	};
}

SprinklerControllerBase.prototype.constructor = SprinklerControllerBase;
inherits(SprinklerControllerBase, SprinklerController);

module.exports = SprinklerControllerBase;
