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

const util = require('util');
const proc = require('child_process');
const DeviceBase = require('../DeviceBase.js');
const EventEmitter = require('events').EventEmitter;
const CaptureDoneEvent = require('./CaptureDoneEvent.js');
const CaptureOutputEvent = require('./CaptureOutputEvent.js');
const CaptureStartEvent = require('./CaptureStartEvent.js');
const StillCaptureSettings = require('./StillCaptureSettings.js');
const ObjectDisposedException = require('../../ObjectDisposedException.js');

const CAP_START_EVT = "captureStartEvent";
const CAP_DONE_EVT = "captureDoneEvent";
const CAP_OUTPUT_EVT = "captureOutputEvent";

/**
* @classdesc An abstraction of the RaspiCam device. RaspiCam is a peripheral
* camera device designed specifically for use with the Raspberry Pi.
* The class provides a threaded wrapper around the raspistill utility
* and thus a means for still capture control.
*
* See http://www.raspberrypi.org/wp-content/uploads/2013/07/RaspiCam-Documentation.pdf
* for instructions on how to install and configure RaspiCam support.
* @extends {DeviceBase}
* @extends {EventEmitter}
*/
class PiCameraDevice extends DeviceBase {
    /**
    * Initializes a new instance of the jsrpi.Devices.PiCamera.PiCamera class
    * with the all the settings.
    * @param {StillCaptureSettings} settings The image capture settings to use.
    * @constructor
    */
    constructor(settings) {
        super();

        this._settings = settings;
        this._emitter = new EventEmitter();
        this._isRunning = false;
        this._processID = -1;
        this._exitCode = -1;
        this._captureTimer = null;
        this._captureProc = null;
        this._killCalled = false;
    }

    /**
    Removes all event listeners.
    @override
    */
    removeAllListeners() {
        if (!this.isDisposed) {
            this._emitter.removeAllListeners();
        }
    }

  /**
  * Attaches a listener (callback) for the specified event name.
  * @param  {String}   evt      The name of the event.
  * @param  {Function} callback The callback function to execute when the
  * event is raised.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @override
  */
  on(evt, callback) {
    if (super.isDisposed) {
      throw new ObjectDisposedException("PiCameraDevice");
    }
    this._emitter.on(evt, callback);
  }

  /**
  * Emits the specified event.
  * @param  {String} evt  The name of the event to emit.
  * @param  {Object} args The object that provides arguments to the event.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @override
  */
  emit(evt, args) {
    if (super.isDisposed) {
      throw new ObjectDisposedException("PiCameraDevice");
    }
    this._emitter.emit(evt, args);
  }

  /**
  * Gets or sets the still image capture settings.
  * @property {StillCaptureSettings}
  */
  get captureSettings() {
      return this._settings;
  }

  set captureSettings(settings) {
      this._settings = settings;
  }

  /**
  * Gets the process ID.
  * @property {Number} processID - The ID of the capture process if started;
  * Otherwise, -1.
  * @readonly
  */
  get processID() {
    return this._processID;
  }

  /**
  * Gets a value indicating whether this instance is running.
  * @property {Boolean} isRunning - true if the capture process is running;
  * Otherwise, false.
  * @readonly
  */
  get isRunning() {
    return this._isRunning;
  }

  /**
  * Gets the exit code of the underlying process.
  * @property {Number} exitCode - The process exit code if terminated normally;
  * Otherwise, -1.
  */
  get exitCode() {
    return this._exitCode;
  }

  /**
  * Raises the capture started event.
  * @param  {CaptureStartEvent} captureStartEvent The event object.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  */
  onCaptureStarted(captureStartEvent) {
    if (this.isDisposed) {
      throw new ObjectDisposedException("PiCameraDevice");
    }

    setImmediate(() => {
      this.emit(CAP_START_EVT, captureStartEvent);
    });
  }

  /**
  * Raises the capture output received event.
  * @param  {CaptureOutputEvent} captureOutputEvent The event object.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  */
  onCaptureOutputReceived(captureOutputEvent) {
    if (this.isDisposed) {
      throw new ObjectDisposedException("PiCameraDevice");
    }

    setImmediate(() => {
      this.emit(CAP_OUTPUT_EVT, captureOutputEvent);
    });
  }

  /**
  * Raises the capture done event.
  * @param  {CaptureDoneEvent} captureDoneEvent The event object.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  */
  onCaptureDone(captureDoneEvent) {
    if (this.isDisposed) {
      throw new ObjectDisposedException("PiCameraDevice");
    }

    setImmediate(() => {
      this.emit(CAP_DONE_EVT, captureDoneEvent);
    });
  }

  /**
  * Cancels the still capture process, if running. Should emit
  * EVENT_CAPTURE_DONE and include the termination signal.
  */
  cancel() {
    if (!this._isRunning) {
      return;
    }

    if (!util.isNullOrUndefined(this._captureProc)) {
      this._killCalled = true;
      this._captureProc.kill('SIGTERM');
    }
  }

  /**
  * Releases all resources used by the PiBrellaBase object.
  * @override
  */
  dispose() {
    if (this.isDisposed) {
      return;
    }

    this._emitter.removeAllListeners();
    this._emitter = undefined;

    this.cancel();
    this._captureSettings = undefined;
    this._processID = -1;
    this._captureProc = null;
    this._isRunning = false;
    super.dispose();
  }

  /**
  * Handles the data event on the process' standard output stream.
  * @param  {String} data The data received from the STDOUT.
  * @private
  */
  _onProcesStandardOutputData(data) {
    this.onCaptureOutputReceived(new CaptureOutputEvent(data));
  }

  /**
  * Handles the process close event.
  * @param  {Number} code   The exit code of the process if it terminated
  * normally.
  * @param  {String} signal The signal used to terminate the process if the
  * cancel() method was called or if another process sent a kill request.
  * @private
  */
  _onProcessClose(code, signal) {
    if (!util.isNullOrUndefined(code)) {
      this._exitCode = code;
    }

    this._isRunning = false;
    this.onCaptureDone(new CaptureDoneEvent(this._exitCode));
    if (!util.isNullOrUndefined(signal)) {
      this._onProcesStandardOutputData("Process terminated with signal: " + signal);
    }
  }

  /**
  * Handles the process error event. Determines if the error is the result of
  * calling cancel() and raises the EVENT_CAPTURE_OUTPUT event with the
  * appropriate message.
  * @param  {Error} err The error object.
  * @private
  */
  _onProcessError(err) {
    if (this._killCalled) {
      this._onProcesStandardOutputData("WARN: Process forcefully terminated.");
    }
    else {
      this._onProcesStandardOutputData("ERROR: Execution failed: " + err);
    }
  }

  /**
  * Starts the capture process asynchronously, then immediately returns and
  * will the process continues in the background.
  */
  start() {
    this._killCalled = false;
    let capSettings = this.captureSettings;
    if (util.isNullOrUndefined(capSettings)) {
      capSettings = new StillCaptureSettings();
    }

    // Start the process and get the PID.
    let args = capSettings.toArgumentString();
    this._captureProc = proc.spawn('raspistill', args);
    this._captureProc.on('error', (err) => {
        this._onProcessError(err);
    });
    this._isRunning = true;
    this._processID = this._captureProc.pid;

    // Notify listeners that the process started, then
    // start reading the output. Every time we get something
    // back from the process, we notify the output listeners.
    this.onCaptureStarted(new CaptureStartEvent(this._processID));
    this._captureProc.stdout.on('data', (data) => {
        this._onProcesStandardOutputData(data);
    });

    this._captureProc.on('close', (code, sig) => {
        this._onProcessClose(code, sig);
    });
  }

  /**
  * The name of the capture start event.
  * @type {String}
  * @const
  */
  static get EVENT_CAPTURE_STARTED() { return CAP_START_EVT; }

  /**
  * The name of the capture done event.
  * @type {String}
  * @const
  */
  static get EVENT_CAPTURE_DONE() { return CAP_DONE_EVT; }

  /**
  * The name of the capture output event.
  * @type {String}
  * @const
  */
  static get EVENT_CAPTURE_OUTPUT() { return CAP_OUTPUT_EVT; }
}

module.exports = PiCameraDevice;
