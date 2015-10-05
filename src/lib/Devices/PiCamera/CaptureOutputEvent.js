"use strict";
//
//  CaptureOutputEvent.js
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
 * @classdesc The event that gets raised when output is received from the image
 * capture process (stdout stream).
 * @param {String} output The process output.
 * @constructor
 * @event
 */
function CaptureOutputEvent(output) {
  var _output = output || "";

  /**
   * Gets the process outuput.
   * @return {String} The process output.
   */
  this.getOutput = function() {
    return _output;
  };
}

CaptureOutputEvent.prototype.constructor = CaptureOutputEvent;
module.exports = CaptureOutputEvent;
