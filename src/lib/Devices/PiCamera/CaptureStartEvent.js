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
 * @param {Number} pid The process ID of the image capture process.
 * @constructor
 * @event
 */
function CaptureStartEvent(pid) {
  var _pid = pid || -1;

  /**
   * Gets the process ID of the image capture proces.
   * @return {Number} The process ID or -1 if the process failed to start.
   */
  this.getPID = function() {
    return _pid;
  };
}

CaptureStartEvent.prototype.constructor = CaptureStartEvent;
module.exports = CaptureStartEvent;
