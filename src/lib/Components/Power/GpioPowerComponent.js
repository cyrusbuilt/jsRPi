"use strict";

//
//  GpioPowerComponent.js
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
var PowerBase = require('./PowerBase.js');
var PowerState = require('./PowerState.js');
var PowerStateChangeEvent = require('./PowerStateChangeEvent.js');
var PowerUtils = require('./PowerUtils.js');
var PowerInterface = require('./PowerInterface.js');
var Gpio = require('../../IO/Gpio.js');
var PinState = require('../../IO/PinState.js');
var PinMode = require('../../IO/PinMode.js');
var PinStateChangeEvent = require('../../IO/PinStateChangeEvent.js');
var ArgumentNullException = require('../../ArgumentNullException.js');
var ObjectDisposedException = require('../../ObjectDisposedException.js');
var InvalidPinModeException = require('../../IO/InvalidPinModeException.js');
var InvalidOperationException = require('../../InvalidOperationException.js');

/**
 * @classdesc A power control component implemented using a single native GPIO
 * configured as an output.
 * @param {RaspiGpio} pin      [description]
 * @param {PinState} onState  [description]
 * @param {PinState} offState [description]
 * @throws {ArgumentNullException}
 * @constructor
 * @extends {PowerBase}
 */
function GpioPowerComponent(pin, onState, offState) {
  PowerBase.call(this);

  if (util.isNullOrUndefined(pin)) {
    throw new ArgumentNullException("'pin' param cannot be null or undefined.");
  }

  var self = this;
  var _base = new PowerBase();
  var _output = pin;
  var _onState = onState || PinState.High;
  var _offState = offState || PinState.Low;

  /**
   * Internal handler for the output pin state change event. This dispatches the
   * power state change event based on the state of the pin.
   * @param  {PinStateChangeEvent} e The state change event.
   * @private
   */
  var onOutputStateChanged = function(e) {
    if (e.getNewState() === _onState) {
      _base.onPowerStateChanged(new PowerStateChangeEvent(PowerState.Off, PowerState.On));
    }
    else {
      _base.onPowerStateChanged(new PowerStateChangeEvent(PowerState.On, PowerState.Off));
    }
  };

  _output.on(Gpio.EVENT_STATE_CHANGED, onOutputStateChanged);

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
   * @override
   */
  this.getPropertyCollection = function() {
    return _base.getPropertyCollection();
  };

  /**
   * Checks to see if the property collection contains the specified key.
   * @param  {String} key The key name of the property to check for.
   * @return {Boolean}    true if the property collection contains the key;
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
   * Releases all resources used by the GpioBase object.
   * @override
   */
  this.dispose = function() {
    if (_base.isDisposed()) {
      return;
    }

    if (!util.isNullOrUndefined(_output)) {
      _output.dispose();
      _output = undefined;
    }

    _base.dispose();
  };

  /**
   * Removes all event listeners.
   * @override
   */
  this.removeAllListeners = function() {
    if (!_base.isDisposed()) {
      _base.removeAllListeners();
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
      throw new ObjectDisposedException("PowerBase");
    }
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
    if (_base.isDisposed()) {
      throw new ObjectDisposedException("PowerBase");
    }
    _base.emit(evt, args);
  };

  /**
   * In a derivative class, gets the state of the component.
   * @return {PowerState} The component state.
   * @override
   */
  this.getState = function() {
    if (_output.state() === _onState) {
      return PowerState.On;
    }
    else if (_output.state() === _offState) {
      return PowerState.Off;
    }
    else {
      return PowerState.Unknown;
    }
  };

  /**
   * Sets the state of the component.
   * @param  {PowerState} state The power state to set.
   * @throws {ObjectDisposedException} if this component instance has been disposed.
   * @throws {InvalidPinModeException} if the pin being used to control this
   * component is not configured as an output.
   * @throws {InvalidOperationException} if an invalid state is specified.
   * @override
   */
  this.setState = function(state) {
    if (_base.isDisposed()) {
      throw new ObjectDisposedException("GpioPowerComponent");
    }

    if (_output.mode() !== PinMode.OUT) {
      throw new InvalidPinModeException(_output, "Pins in use by power components MUST be configured as outputs.");
    }

    switch (state) {
      case PowerState.Off:
        _output.write(_offState);
        _base.setState(state);
        break;
      case PowerState.On:
        _output.write(_onState);
        _base.setState(state);
        break;
      default:
        var badState = PowerUtils.getPowerStateName(state);
        throw new InvalidOperationException("Cannot set power state: " + badState);
    }
  };

  /**
   * Fires the power state changed event.
   * @param  {PowerStateChangeEvent} stateChangeEvent The event info object.
   * @override
   */
  this.onPowerStateChanged = function(stateChangeEvent) {
    _base.onPowerStateChanged(stateChangeEvent);
  };

  /**
   * Checks to see if the component is on.
   * @return {Boolean} true if on; Otherwise, false.
   * @override
   */
  this.isOn = function() {
    return (self.getState() === PowerState.On);
  };

  /**
   * Checks to see if the component is off.
   * @return {Boolean} true if off; Otherwise, false.
   * @override
   */
  this.isOff = function() {
    return (self.getState() === PowerState.Off);
  };

  /**
   * Turns the component on.
   * @override
   */
  this.turnOn = function() {
    self.setState(PowerState.On);
  };

  /**
   * Turns the component off.
   * @override
   */
  this.turnOff = function() {
    self.setState(PowerState.Off);
  };
}

GpioPowerComponent.prototype.constructor = GpioPowerComponent;
inherits(GpioPowerComponent, PowerBase);

module.exports = GpioPowerComponent;
