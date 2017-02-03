"use strict";

//
//  ToggleSwitchComponent.js
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
const ToggleSwitchBase = require('./ToggleSwitchBase.js');
const Switch = require('./Switch.js');
const SwitchState = require('./SwitchState.js');
const PinState = require('../../IO/PinState.js');
const PinMode = require('../../IO/PinMode.js');
const Gpio = require('../../IO/Gpio.js');
const SwitchStateChangeEvent = require('./SwitchStateChangeEvent.js');
const ArgumentNullException = require('../../ArgumentNullException.js');
const ObjectDisposedException = require('../../ObjectDisposedException.js');
const InvalidOperationException = require('../../InvalidOperationException.js');

const OFF_STATE = PinState.Low;
const ON_STATE = PinState.High;

/**
* @classdesc A component that is an abstraction of a toggle switch. This is an
* implementation of SwitchBase.
* @extends {ToggleSwitchBase}
*/
class ToggleSwitchComponent extends ToggleSwitchBase {
	/**
	 * Initializes a new instance of the jsrpi.Components.Switches.ToggleSwitchComponent
	 * class with the pin the toggle switch is attached to.
	 * @param {Gpio} pin The input pin the switch is attached to.
	 * @throws {ArgumentNullException} if pin is null or undefined.
	 * @constructor
	 */
	constructor(pin) {
		super();

		if (util.isNullOrUndefined(pin)) {
			throw new ArgumentNullException("'pin' param cannot be null or undefined.");
		}

		this._pin = pin;
		this._isPolling = false;
		this._pollTimer = null;
		this._pin.provision();
		this._pin.on(Gpio.EVENT_STATE_CHANGED, (evt) => {
			this._onPinStateChanged(evt);
		});
	}

	/**
	* Handles the pin state change event. This verifies the state has actually
	* changed, then fires the switch state change event.
	* @param  {PinStateChangeEvent} psce The pin state change event info.
	* @private
	*/
	_onPinStateChanged(psce) {
		if (psce.newState !== psce.oldState) {
			let evt = new SwitchStateChangeEvent(SwitchState.On, SwitchState.Off);
			if (psce.newState === ON_STATE) {
				evt = new SwitchStateChangeEvent(SwitchState.Off, SwitchState.On);
			}

			this.onSwitchStateChanged(evt);
		}
	}

	/**
	* Gets the state of the switch.
	* @property {SwitchState} state - The switch state.
	* @readonly
	* @override
	*/
	get state() {
		if (this._pin.state === ON_STATE) {
			return SwitchState.On;
		}
		return SwitchState.Off;
	}

	/**
	* Gets whether or not this switch is in the specified state.
	* @param  {SwitchState} state The state to check against.
	* @return {Boolean}     true if this switch is in the specified state;
	* Otherwise, false.
	* @override
	*/
	isState(state) {
		return (this.state === state);
	}

	/**
	* Gets whether or not this switch is in the on position.
	* @property {Boolean} isOn - true if on; Otherwise, false.
	* @readonly
	* @override
	*/
	get isOn() {
		return this.isState(SwitchState.On);
	}

	/**
	* Gets whether or not this switch is in the off position.
	* @property {Boolean} isOff - true if off; Otherwise, false.
	* @readonly
	* @override
	*/
	get isOff() {
		return this.isState(SwitchState.Off);
	}

	/**
	* Checks to see if the switch is in poll mode, where it reads the switch
	* state every 500ms and fires state change events when the state changes.
	* @property {Boolean} isPolling - true if the switch is polling; Otherwise,
	* false.
	* @readonly
	*/
	get isPolling() {
		return this._isPolling;
	}

	/**
	* Executes the poll cycle. This simply polls the pin, which in turn fires
	* pin state change events that we handle internally by firing switch state
	* change events. This only occurs if polling is enabled.
	* @private
	*/
	_executePoll() {
		if (this.isPolling) {
			this._pin.read();
		}
	}

	/**
	* Starts the poll timer. Every time the timer elapses, executePoll() will be
	* called.
	* @private
	*/
	_startPollTimer() {
		this._isPolling = true;
		this._pollTimer = setInterval(() => { this._executePoll(); }, 500);
	}

	/**
	* Polls the switch status.
	* @throws {ObjectDisposedException} if this instance has been disposed and
	* can no longer be used.
	* @throws {InvalidOperationException} if this switch is attached to a pin
	* that has not been configured as an input.
	*/
	poll() {
		if (this.isDisposed) {
			throw new ObjectDisposedException('SwitchComponent');
		}

		if (this._pin.mode !== PinMode.IN) {
			throw new InvalidOperationException("The pin this button is attached to" +
			" must be configured as an input.");
		}

		if (this.isPolling) {
			return;
		}

		this._startPollTimer();
	}

	/**
	* Interrupts the poll cycle.
	*/
	interruptPoll() {
		if (!this.isPolling) {
			return;
		}

		if (this._pollTimer != null) {
			clearInterval(this._pollTimer);
			this._pollTimer = null;
		}
		this._isPolling = false;
	}

	/**
	* Releases all resources used by the GpioBase object.
	* @override
	*/
	dispose() {
		if (this.isDisposed) {
			return;
		}

		this.interruptPoll();
		if (!util.isNullOrUndefined(this._pin)) {
			this._pin.dispose();
			this._pin = undefined;
		}

		super.dispose();
	}
}

module.exports = ToggleSwitchComponent;
