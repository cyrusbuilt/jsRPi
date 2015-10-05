"use strict";

//
//  IOException.js
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
 * @classdesc The exception that is throw when an I/O error occurs.
 * @param {String} sMessage A message describing the eception.
 * @constructor
 * @extends {Error}
 */
function IOException(sMessage) {
  this.name = "IOException";
  this.message = sMessage;
  this.stack = (new Error()).stack;
}

IOException.prototype = Object.create(Error.prototype);
IOException.prototype.constructor = IOException;

module.exports = IOException;
