"use strict";
//
//  SprinklerZoneDevice.js
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
var inherits = require('util').inherits;
var SprinklerZoneBase = require('./SprinklerZoneBase.js');
var ZoneStateChangeEvent = require('./ZoneStateChangeEvent.js');
var RelayState = require('../../Components/Relays/RelayState.js');
var ArgumentNullException = require('../../ArgumentNullException.js');
var ObjectDisposedException = require('../../ObjectDisposedException.js');

/**
* @classdesc Base class for sprinkler zones.
* @param {Relay} relay The relay that will be used to control this zone.
* @param {String} name  The name of this sprinkler (optional).
* @throws {ArgumentNullException} if the 'relay' param is null or undefined.
* @constructor
* @extends {SprinklerZoneBase}
*/
function SprinklerZoneDevice(relay, name) {
	SprinklerZoneBase.call(this, name);

	if (util.isNullOrUndefined(relay)) {
		throw new ArgumentNullException("'relay' param cannot be null or undefined.");
	}

	var self = this;
	var _base = new SprinklerZoneBase(name);
	var _relay = relay;

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
	* Returns the string representation of this object. In this case, it simply
	* returns the component name.
	* @return {String} The name of this component.
	*/
	this.toString = function() {
		return self.deviceName;
	};

	/**
	* @inheritdoc
	*/
	this.sprinklerName = _base.sprinklerName;

	/**
	* @inheritdoc
	*/
	this.zoneID = _base.zoneID;

	/**
	* Releases all managed resources used by this instance.
	* @override
	*/
	this.dispose = function() {
		if (_base.isDisposed()) {
			return;
		}

		if (!util.isNullOrUndefined(_relay)) {
			_relay.dispose();
			_relay = undefined;
		}

		_base.dispose();
	};

	/**
	* Gets whether or not this zone is on.
	* @return {Boolean} true if the sprinkler is on; Otherwise, false.
	* @throws {ObjectDisposedException} if this instance has been disposed.
	* @override
	*/
	this.isOn = function() {
		if (_base.isDisposed()) {
			throw new ObjectDisposedException("SprinklerZoneDevice");
		}
		return _relay.isClosed();
	};

	/**
	* Sets the state of this zone.
	* @param  {Boolean} on Set true to turn the zone on or false to turn it off.
	* @throws {ObjectDisposedException} if this instance has been disposed.
	* @override
	*/
	this.setState = function(on) {
		if (_base.isDisposed()) {
			throw new ObjectDisposedException("SprinklerZoneDevice");
		}

		if (_relay.isClosed() !== on) {
			var state = on ? RelayState.Closed : RelayState.Open;
			_relay.setState(state);
			_base.setState(state);
		}
	};

	/**
	* Gets whether or not this zone is off.
	* @return {Boolean} true if the sprinkler is off; Otherwise, false.
	* @throws {ObjectDisposedException} if this instance has been disposed.
	* @override
	*/
	this.isOff = function() {
		return !self.isOn();
	};

	/**
	* Turns this zone on.
	* @throws {ObjectDisposedException} if this instance has been disposed.
	* @override
	*/
	this.turnOn = function() {
		self.setState(true);
	};

	/**
	* Turns this zone off.
	* @throws {ObjectDisposedException} if this instance has been disposed.
	* @override
	*/
	this.turnOff = function() {
		self.setState(false);
	};
}

SprinklerZoneBase.prototype.constructor = SprinklerZoneBase;
inherits(SprinklerZoneDevice, SprinklerZoneBase);

module.exports = SprinklerZoneBase;
