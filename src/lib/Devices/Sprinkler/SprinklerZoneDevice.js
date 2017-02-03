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

const util = require('util');
const SprinklerZoneBase = require('./SprinklerZoneBase.js');
const ZoneStateChangeEvent = require('./ZoneStateChangeEvent.js');
const RelayState = require('../../Components/Relays/RelayState.js');
const ArgumentNullException = require('../../ArgumentNullException.js');
const ObjectDisposedException = require('../../ObjectDisposedException.js');

/**
* @classdesc Base class for sprinkler zones.
* @constructor
* @extends {SprinklerZoneBase}
*/
class SprinklerZoneDevice extends SprinklerZoneBase {
	/**
	 * Initializes a new instance of the jsrpi.Devices.Sprinkler.SprinklerZoneDevice
	 * class with the relay being used to control the zone and the zone name.
	 * @param {Relay} relay The relay that will be used to control this zone.
	 * @param {String} name  The name of this sprinkler (optional).
	 * @throws {ArgumentNullException} if the 'relay' param is null or undefined.
	 */
	constructor(relay, name) {
		super(name);

		if (util.isNullOrUndefined(relay)) {
			throw new ArgumentNullException("'relay' param cannot be null or undefined.");
		}

		this._relay = relay;
	}

	/**
	* Releases all managed resources used by this instance.
	* @override
	*/
	dispose() {
		if (this.isDisposed) {
			return;
		}

		if (!util.isNullOrUndefined(this._relay)) {
			this._relay.dispose();
			this._relay = undefined;
		}

		super.dispose();
	}

	/**
	* Gets whether or not this zone is on.
	* @property {Boolean} isOn - true if the sprinkler is on; Otherwise, false.
	* @throws {ObjectDisposedException} if this instance has been disposed.
	* @readonly
	* @override
	*/
	get isOn() {
		if (this.isDisposed) {
			throw new ObjectDisposedException("SprinklerZoneDevice");
		}
		return this._relay.isClosed;
	}

	/**
	* Sets the state of this zone.
	* @param  {Boolean} on Set true to turn the zone on or false to turn it off.
	* @throws {ObjectDisposedException} if this instance has been disposed.
	* @override
	*/
	setState(on) {
		if (this.isDisposed) {
			throw new ObjectDisposedException("SprinklerZoneDevice");
		}

		if (this._relay.isClosed !== on) {
			let state = on ? RelayState.Closed : RelayState.Open;
			this._relay.state = state;
			this.setState(state);
		}
	}

	/**
	* Gets whether or not this zone is off.
	* @property {Boolean} isOff - true if the sprinkler is off; Otherwise, false.
	* @throws {ObjectDisposedException} if this instance has been disposed.
	* @readonly
	* @override
	*/
	get isOff() {
		return !this.isOn;
	}

	/**
	* Turns this zone on.
	* @throws {ObjectDisposedException} if this instance has been disposed.
	* @override
	*/
	turnOn() {
		this.setState(true);
	}

	/**
	* Turns this zone off.
	* @throws {ObjectDisposedException} if this instance has been disposed.
	* @override
	*/
	turnOff() {
		this.setState(false);
	}
}

module.exports = SprinklerZoneBase;
