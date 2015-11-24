"use strict";
//
//  PiCameraDevice.js
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

// TODO Need unit tests for this class.

var util = require('util');
var inherits = require('util').inherits;
var proc = require('child_process');
var DeviceBase = require('../DeviceBase.js');
var EventEmitter = require('events').EventEmitter;
var CaptureDoneEvent = require('./CaptureDoneEvent.js');
var CaptureOutputEvent = require('./CaptureOutputEvent.js');
var CaptureStartEvent = require('./CaptureStartEvent.js');
var StillCaptureSettings = require('./StillCaptureSettings.js');
var ObjectDisposedException = require('../../ObjectDisposedException.js');

var CAP_START_EVT = "captureStartEvent";
var CAP_DONE_EVT = "captureDoneEvent";
var CAP_OUTPUT_EVT = "captureOutputEvent";

/**
* @classdesc An abstraction of the RaspiCam device. RaspiCam is a peripheral
* camera device designed specifically for use with the Raspberry Pi.
* The class provides a threaded wrapper around the raspistill utility
* and thus a means for still capture control.
*
* See http://www.raspberrypi.org/wp-content/uploads/2013/07/RaspiCam-Documentation.pdf
* for instructions on how to install and configure RaspiCam support.
* @param {StillCaptureSettings} settings The image capture settings to use.
* @constructor
* @extends {DeviceBase}
* @extends {EventEmitter}
*/
function PiCameraDevice(settings) {
  DeviceBase.call(this);

  var self = this;
  var _base = new DeviceBase();
  var _emitter = new EventEmitter();
  var _isRunning = false;
  var _processID = -1;
  var _exitCode = -1;
  var _captureTimer = null;
  var _captureProc = null;
  var _killCalled = false;

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
      throw new ObjectDisposedException("PiCameraDevice");
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
      throw new ObjectDisposedException("PiCameraDevice");
    }
    _emitter.emit(evt, args);
  };

  /**
  * Gets or sets the still image capture settings.
  * @property {StillCaptureSettings}
  */
  this.captureSettings = settings;

  /**
  * Gets the process ID.
  * @return {Number} The ID of the capture process if started; Otherwise, -1.
  */
  this.getProcessID = function() {
    return _processID;
  };

  /**
  * Gets a value indicating whether this instance is running.
  * @return {Boolean} true if the capture process is running; Otherwise, false.
  */
  this.isRunning = function() {
    return _isRunning;
  };

  /**
  * Gets the exit code of the underlying process.
  * @return {Number} The process exit code if terminated normally; Otherwise, -1.
  */
  this.getExitCode = function() {
    return _exitCode;
  };

  /**
  * Raises the capture started event.
  * @param  {CaptureStartEvent} captureStartEvent The event object.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  */
  this.onCaptureStarted = function(captureStartEvent) {
    if (_base.isDisposed()) {
      throw new ObjectDisposedException("PiCameraDevice");
    }

    var e = _emitter;
    var evt = captureStartEvent;
    process.nextTick(function() {
      e.emit(CAP_START_EVT, evt);
    }.bind(this));
  };

  /**
  * Raises the capture output received event.
  * @param  {CaptureOutputEvent} captureOutputEvent The event object.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  */
  this.onCaptureOutputReceived = function(captureOutputEvent) {
    if (_base.isDisposed()) {
      throw new ObjectDisposedException("PiCameraDevice");
    }

    var e = _emitter;
    var evt = captureOutputEvent;
    process.nextTick(function() {
      e.emit(CAP_OUTPUT_EVT, evt);
    }.bind(this));
  };

  /**
  * Raises the capture done event.
  * @param  {CaptureDoneEvent} captureDoneEvent The event object.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  */
  this.onCaptureDone = function(captureDoneEvent) {
    if (_base.isDisposed()) {
      throw new ObjectDisposedException("PiCameraDevice");
    }

    var e = _emitter;
    var evt = captureDoneEvent;
    process.nextTick(function() {
      e.emit(CAP_DONE_EVT, evt);
    }.bind(this));
  };

  /**
  * Cancels the still capture process, if running. Should emit
  * EVENT_CAPTURE_DONE and include the termination signal.
  */
  this.cancel = function() {
    if (!_isRunning) {
      return;
    }

    if (!util.isNullOrUndefined(_captureProc)) {
      _killCalled = true;
      _captureProc.kill('SIGTERM');
    }
  };

  /**
  * Releases all resources used by the PiBrellaBase object.
  * @override
  */
  this.dispose = function() {
    if (_base.isDisposed()) {
      return;
    }

    _emitter.removeAllListeners();
    _emitter = undefined;

    self.cancel();
    self.captureSettings = null;
    _processID = -1;
    _captureProc = null;
    _isRunning = false;
    _base.dispose();
  };

  /**
  * Handles the data event on the process' standard output stream.
  * @param  {String} data The data received from the STDOUT.
  * @private
  */
  var onProcesStandardOutputData = function(data) {
    self.onCaptureOutputReceived(new CaptureOutputEvent(data));
  };

  /**
  * Handles the process close event.
  * @param  {Number} code   The exit code of the process if it terminated
  * normally.
  * @param  {String} signal The signal used to terminate the process if the
  * cancel() method was called or if another process sent a kill request.
  * @private
  */
  var onProcessClose = function(code, signal) {
    if (!util.isNullOrUndefined(code)) {
      _exitCode = code;
    }

    _isRunning = false;
    self.onCaptureDone(new CaptureDoneEvent(_exitCode));
    if (!util.isNullOrUndefined(signal)) {
      onProcesStandardOutputData("Process terminated with signal: " + signal);
    }
  };

  /**
  * Handles the process error event. Determines if the error is the result of
  * calling cancel() and raises the EVENT_CAPTURE_OUTPUT event with the
  * appropriate message.
  * @param  {Error} err The error object.
  */
  var onProcessError = function(err) {
    if (_killCalled) {
      onProcesStandardOutputData("WARN: Process forcefully terminated.");
    }
    else {
      onProcesStandardOutputData("ERROR: Execution failed: " + err);
    }
  };

  /**
  * Starts the capture process asynchronously, then immediately returns and
  * will the process continues in the background.
  */
  this.start = function() {
    _killCalled = false;
    var capSettings = self.captureSettings;
    if (util.isNullOrUndefined(capSettings)) {
      capSettings = new StillCaptureSettings();
    }

    // Start the process and get the PID.
    var args = capSettings.toArgumentString();
    _captureProc = proc.spawn('raspistill', args);
    _captureProc.on('error', onProcessError);
    _isRunning = true;
    _processID = _captureProc.pid;

    // Notify listeners that the process started, then
    // start reading the output. Every time we get something
    // back from the process, we notify the output listeners.
    self.onCaptureStarted(new CaptureStartEvent(_processID));
    _captureProc.stdout.on('data', onProcesStandardOutputData);
    _captureProc.on('close', onProcessClose);
  };
}

/**
* The name of the capture start event.
* @const {String}
*/
PiCameraDevice.EVENT_CAPTURE_STARTED = CAP_START_EVT;

/**
* The name of the capture done event.
* @const {String}
*/
PiCameraDevice.EVENT_CAPTURE_DONE = CAP_DONE_EVT;

/**
* The name of the capture output event.
* @const {String}
*/
PiCameraDevice.EVENT_CAPTURE_OUTPUT = CAP_OUTPUT_EVT;

PiCameraDevice.prototype.constructor = PiCameraDevice;
inherits(PiCameraDevice, DeviceBase);

module.exports = PiCameraDevice;
