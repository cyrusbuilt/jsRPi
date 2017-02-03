"use strict";

//
//  TimeUnit.js
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
 * Time units of measure.
 * @enum {number}
 */
const TimeUnit = {
  /**
   * Time in years.
   * @type {Number}
   */
  Years : 1,

  /**
   * Time in months.
   * @type {Number}
   */
  Months : 2,

  /**
   * Time in weeks.
   * @type {Number}
   */
  Weeks : 3,

  /**
   * Time in days.
   * @type {Number}
   */
  Days : 4,

  /**
   * Time in hours.
   * @type {Number}
   */
  Hours : 5,

  /**
   * Time in minutes.
   * @type {Number}
   */
  Minutes : 6,

  /**
   * Time in seconds.
   * @type {Number}
   */
  Seconds : 7,

  /**
   * Time in Milliseconds.
   * @type {Number}
   */
  Milliseconds : 8
};

module.exports = TimeUnit;
