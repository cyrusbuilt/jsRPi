"use strict";
//
//  FireplaceBase.js
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
var timespan = require('timespan');
var inherits = require('util').inherits;
var FireplaceInterface = require('./FireplaceInterface.js');
var FireplaceState = require('./FireplaceState.js');
var FireplaceTimeoutEvent = require('./FireplaceTimeoutEvent.js');
var DeviceBase = require('../DeviceBase.js');
var EventEmitter = require('events').EventEmitter;
var TimeUnit = require('../../PiSystem/TimeUnit.js');
var InvalidOperationException = require('../../InvalidOperationException.js');
var SystemInfo = require('../../PiSystem/SystemInfo.js');
var ObjectDisposedException = require('../../ObjectDisposedException.js');

/**
 * @classdesc Base class for fireplace device abstractions.
 * @constructor
 * @implements {FireplaceInterface}
 * @extends {DeviceBase}
 * @extends {EventEmitter}
 */
function FireplaceBase() {
  	FireplaceInterface.call(this);

  	var self = this;
	var _base = new DeviceBase();
	var _emitter = new EventEmitter();
  	var _timeoutDelay = 0;
  	var _timeoutDelayMillis = 0;
  	var _timeoutUnit = TimeUnit.Minutes;
  	var _backgroundTaskTimer = null;
  	var _killTimer = null;
	var _state = FireplaceState.Off;
	
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
 	 * Gets the fireplace state.
 	 * @return {FireplaceState} The current state.
 	 * @override
 	 */
	this.getState = function() {
		return _state;
	};
	
	/**
 	 * Sets the fireplace state.
 	 * @param  {FireplaceState} state The fireplace state.
 	 * @override
 	 */
	this.setState = function(state) {
		_state = state;
	};

  	/**
    * Gets a value indicating whether the fireplace is on.
    * @return {Boolean} true if the fireplace is on; Otherwise, false.
    * @override
    */
  	this.isOn = function() {
    	return (self.getState() === FireplaceState.On);
  	};

  	/**
    * Gets a value indicating whether the fireplace is off.
    * @return {Boolean} true if the fireplace is off; Otherwise, false.
    * @override
    */
  	this.isOff = function() {
    	return (self.getState() === FireplaceState.Off);
  	};

  	/**
    * Gets the timeout delay.
    * @return {Number} The timeout delay.
    * @override
    */
  	this.getTimeoutDelay = function() {
    	return _timeoutDelay;
  	};

  	/**
    * Gets the timeout unit of time.
    * @return {TimeUnit} Gets the time unit being used for the timeout delay.
    * @override
    */
  	this.getTimeoutUnit = function() {
    	return _timeoutUnit;
  	};

  	/**
    * Fires the state change event.
    * @param  {FireplaceStateChangeEvent} stateChangeEvent The event object.
    * @throws {ObjectDisposedException} if this instance has been disposed.                                                    
    * @override
    */
  	this.onFireplaceStateChange = function(stateChangeEvent) {
		if (_base.isDisposed()) {
			throw new ObjectDisposedException("FireplaceBase");
		}
		
		var e = _emitter;
		var evt = stateChangeEvent;
    	process.nextTick(function() {
      	e.emit(FireplaceInterface.EVENT_STATE_CHANGED, evt);
    	}.bind(this));
  	};

  	/**
    * Fires the operation timeout event.
    * @param  {FireplaceTimeoutEvent} timeoutEvent The event object.
    * @throws {ObjectDisposedException} if this instance has been disposed.                                             
    * @override
    */
  	this.onOperationTimeout = function(timeoutEvent) {
		if (_base.isDisposed()) {
			throw new ObjectDisposedException("FireplaceBase");
		}
		
		var e = _emitter;
		var evt = timeoutEvent;
    	process.nextTicket(function() {
      	e.emit(FireplaceInterface.EVENT_OPERATION_TIMEOUT, evt);
    	}.bind(this));
  	};

  	/**
    * Fires the pilot light state change event.
    * @param  {FireplacePilotLightEvent} pilotStateEvent The event object.
    * @throws {ObjectDisposedException} if this instance has been disposed.                                                   
    * @override
    */
  	this.onPilotLightStateChange = function(pilotStateEvent) {
		if (_base.isDisposed()) {
			throw new ObjectDisposedException("FireplaceBase");
		}
		
		var e = _emitter;
		var evt = pilotStateEvent;
    	process.nextTicket(function() {
      	e.emit(FireplaceInterface.EVENT_PILOT_LIGHT_STATE_CHANGED, evt);
    	}.bind(this));
  	};

  	/**
    * Cancels the timeout task (if running).
    * @private
    */
  	var cancelTimeoutTask = function() {
    	if (!util.isNullOrUndefined(_backgroundTaskTimer)) {
      	clearInterval(_backgroundTaskTimer);
      	_backgroundTaskTimer = null;
    	}
  	};

  	/**
    * An internal handler for the state change event.
    * @param  {FireplaceStateChangeEvent} stateChangeEvent The event object.
    * @private
    */
  	var internalStateChangeHandler = function(stateChangeEvent) {
    	cancelTimeoutTask();
  	};

  	self.on(FireplaceInterface.EVENT_STATE_CHANGED, internalStateChangeHandler);

  	/**
    * Cancels the timeout (if running).
    * @override
    */
  	this.cancelTimeout = function() {
    	cancelTimeoutTask();
  	};

  	/**
    * Gurns the fireplace off.
    * @override
    */
  	this.turnOff = function() {
    	self.setState(FireplaceState.Off);
  	};

  	/**
    * The action for the background timeout task. This fires the operation
    * timeout event, then turns off the fireplace.
    * @private
    */
  	var taskAction = function() {
    	var evt = new FireplaceTimeoutEvent();
    	self.onOperationTimeout(evt);
    	if (!evt.isHandled()) {
      	self.turnOff();
    	}
  	};

  	/**
    * Starts the background cancellation task.
    * @protected
    */
  	this._startCancelTask = function() {
    	if (!util.isNullOrUndefined(_killTimer)) {
      	_backgroundTaskTimer = setInterval(function() {
        	taskAction();
        	clearInterval(_killTimer);
      	}, _timeoutDelayMillis);
    	}
  	};

  	/**
    * Sets the timeout delay.
    * @param  {Number} delay   The timeout delay.
    * @param  {TimeUnit} unit  The time unit of measure for the timeout.
    * @throws {InvalidOperationException} if the fireplace is turned off.
    * @override
    */
  	this.setTimeoutDelay = function(delay, unit) {
    	if (self.isOff()) {
      	throw new InvalidOperationException("Cannot set timeout when the fireplace is off.");
    	}

    	_timeoutDelay = delay;
    	_timeoutUnit = unit;

    	self.cancelTimeout();

    	if (_timeoutDelay > 0) {
      	var waitTime = new timespan.TimeSpan(0, 0, 0, 0, 0);
      	switch (unit) {
        		case TimeUnit.Days:
          		waitTime = timespan.fromDays(delay);
          		break;
        		case TimeUnit.Hours:
					waitTime = timespan.fromHours(delay);
          		break;
        		case TimeUnit.Minutes:
          		waitTime = timespan.fromMinutes(delay);
          		break;
        		case TimeUnit.Seconds:
          		waitTime = timespan.fromSeconds(delay);
          		break;
        		case TimeUnit.Milliseconds:
          		waitTime = timespan.fromMilliseconds(delay);
          		break;
        		default:
          		break;
      	}

      	var killDelay = timespan.fromMilliseconds(SystemInfo.getCurrentTimeMillis());
      	killDelay.addSeconds(1);
      	_killTimer = setInterval(cancelTimeoutTask, killDelay.milliseconds);
      	self._startCancelTask();
    	}
  	};

  	/**
    * Turns the fireplace on with the specified timeout. If the operation is not
    * successful within the allotted time, the operation is cancelled for safety
    * reasons.
    * @param  {Number} timeoutDelay   The timeout delay. If not specified or less
    * than or equal to zero, then the fireplace is turned on without any saftey
    * delay (not recommended).
    * @param  {TimeUnit} timeoutUnit  The time unit of measure for the timeout.
    * If not specified, TimeUnit.Seconds is assumed.
    * @override
    */
  	this.turnOn = function(timeoutDelay, timeoutUnit) {
    	self.setState(FireplaceState.On);
    	timeoutUnit = timeoutUnit || _timeoutUnit;
    	if (!util.isNullOrUndefined(timeoutDelay)) {
      	if (timeoutDelay > 0) {
        		self.setTimeout(timeoutDelay, timeoutUnit);
      	}
    	}
  	};

  	/**
    * Shutdown the fireplace.
    * @override
    */
  	this.shutdown = function() {
    	self.cancelTimeout();
    	self.turnOff();
  	};

  	/**
    * Releases all resources used by the FireplaceBase object.
    * @override
    */
  	this.dispose = function() {
    	if (_base.isDisposed()) {
      	return;
    	}

    	cancelTimeoutTask();
    	if (!util.isNullOrUndefined(_killTimer)) {
      	clearInterval(_killTimer);
      	_killTimer = undefined;
    	}

		_emitter.removeAllListeners();
		_emitter = undefined;
    	_base.dispose();
  	};
}

FireplaceBase.prototype.constructor = FireplaceBase;
inherits(FireplaceBase, FireplaceInterface);

module.exports = FireplaceBase;
