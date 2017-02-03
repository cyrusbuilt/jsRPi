"use strict";
//
//  CaptureStartEvent.js
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

/**
 * @classdesc The event that gets raised when an image capture starts.
 * @event
 */
class CaptureStartEvent {
  /**
   * Initializes a new instance of the jsrpi.Devices.PiCamera.CaptureStartEvent
   * class with the PID of the executing capture process.
   * @param {Number} pid The process ID of the image capture process.
   * @constructor
   */
  constructor(pid) {
    this._pid = pid || -1;
  }

  /**
   * Gets the process ID of the image capture proces. Returns -1 if the process
   * failed to start.
   * @property {Number} pid - The process ID of the image capture process.
   * @readonly
   */
  get pid() {
    return this._pid;
  }
}

module.exports = CaptureStartEvent;
