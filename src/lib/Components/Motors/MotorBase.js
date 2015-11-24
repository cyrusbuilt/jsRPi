"use strict";

//
//  MotorBase.js
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
var Motor = require('./Motor.js');
var MotorState = require('./MotorState.js');
var ComponentBase = require('../ComponentBase.js');
var EventEmitter = require('events').EventEmitter;
var MotorStateChangeEvent = require('./MotorStateChangeEvent.js');
var ObjectDisposedException = require('../../ObjectDisposedException.js');

/**
 * @classdesc Base class for motor abstraction components.
 * @constructor
 * @implements {Motor}
 * @extends {ComponentBase}
 * @extends {EventEmitter}
 */
function MotorBase() {
  Motor.call(this);

  var self = this;
  var _base = new ComponentBase();
  var _emitter = new EventEmitter();
  var _state = MotorState.Stop;

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
      throw new ObjectDisposedException("MotorBase");
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
      throw new ObjectDisposedException("MotorBase");
    }
    _emitter.emit(evt, args);
  };

  /**
   * Fires the motor state change event.
   * @param  {MotorStateChangeEvent} stateChangeEvent The event info object.
   * @override
   */
  this.onMotorStateChange = function(stateChangeEvent) {
    if (_base.isDisposed()) {
      throw new ObjectDisposedException("MotorBase");
    }

    var e = _emitter;
    var evt = stateChangeEvent;
    process.nextTick(function() {
      e.emit(Motor.EVENT_STATE_CHANGED, evt);
      switch (evt.getNewState()) {
        case MotorState.Stop:
          e.emit(Motor.EVENT_STOPPED);
          break;
        case MotorState.Forward:
          e.emit(Motor.EVENT_FORWARD);
          break;
        case MotorState.Reverse:
          e.emit(Motor.EVENT_REVERSE);
          break;
        default:
          break;
      }
    }.bind(this));
  };

  /**
   * Fets the state of the motor.
   * @return {MotorState} The motor state.
   */
  this.getState = function() {
    return _state;
  };

  /**
   * Sets the state of the motor.
   * @param  {MotorState} state The state to set the motor to.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  this.setState = function(state) {
    if (_base.isDisposed()) {
      throw new ObjectDisposedException("MotorBase");
    }
    _state = state;
  };

  /**
   * Determines whether the motor's current state is the specified state.
   * @param  {MotorState} state The state to check for.
   * @return {Boolean}       true if the motor is in the specified state;
   * Otherwise, false.
   * @override
   */
  this.isState = function(state) {
    return (self.getState() === state);
  };

  /**
   * Checks to see if the motor is stopped.
   * @return {Boolean} true if stopped; Otherwise, false.
   * @override
   */
  this.isStopped = function() {
    return self.isState(MotorState.Stop);
  };

  /**
   * Stops the motor's movement.
   * @override
   */
  this.stop = function() {
    if (self.getState() === MotorState.Stop) {
      return;
    }
    var oldState = self.getState();
    self.setState(MotorState.Stop);
    self.onMotorStateChange(new MotorStateChangeEvent(oldState, MotorState.Stop));
  };

  /**
   * Tells the motor to move forward for the specified amount of time.
   * @param  {Number} millis The number of milliseconds to continue moving
   * forward for. If zero, null, or undefined, then moves forward continuously
   * until stopped.
   * @override
   */
  this.forward = function(millis) {
    if (self.getState() === MotorState.Forward) {
      return;
    }
    var oldState = self.getState();
    self.setState(MotorState.Forward);
    self.onMotorStateChange(new MotorStateChangeEvent(oldState, MotorState.Forward));

    var ms = millis || 0;
    if (ms > 0) {
      setTimeout(function() {
        self.stop();
      }, ms);
    }
  };

  /**
   * Tells the motor to move in reverse for the specified amount of time.
   * @param  {Number} millis The number of milliseconds to continue moving in
   * reverse for. If zero, null, or undefined, then moves in reverse continuously
   * until stopped.
   * @override
   */
  this.reverse = function(millis) {
    if (self.getState() === MotorState.Reverse) {
      return;
    }
    var oldState = self.getState();
    self.setState(MotorState.Reverse);
    self.onMotorStateChange(new MotorStateChangeEvent(oldState, MotorState.Reverse));

    var ms = millis || 0;
    if (ms > 0) {
      setTimeout(function() {
        self.stop();
      }, ms);
    }
  };
}

MotorBase.prototype.constructor = MotorBase;
inherits(MotorBase, Motor);

module.exports = MotorBase;
