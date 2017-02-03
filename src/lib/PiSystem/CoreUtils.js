"use strict";

//
//  CoreUtils.js
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
//

/**
 * @fileOverview Provides core utility methods.
 *
 * @module CoreUtils
 */

/**
 * Blocks the current thread for the specified microseconds. WARNING: This is a
 * busy loop method and will block execution of all JavaScript.
 * @param  {Number} micros The amount of time in microseconds to sleep.
 */
const sleepMicroseconds = function(micros) {
  let start = new Date().getTime();
  let diff = (micros / 1000);
  let end = start + diff;
  while (new Date().getTime() <= end) {
    // This isn't a *real* sleep. We just spin the CPU because we
		// aren't operating on a real-time OS, so the best we can do
		// is spin the CPU. We can't *really* sleep less than 1ms, and
		// even then, we can still get preempted by the OS at any time.
  }
};

module.exports.sleepMicroseconds = sleepMicroseconds;
