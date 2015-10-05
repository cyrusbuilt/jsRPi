"use strict";

//
//  ArgumentNullException.js
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
 * @classdesc The exception that is thrown when null is passed to a method or
 * constructor as a parameter when that method or constructor does not allow it.
 * @param {String} sMessage A description of the error.
 * @constructor
 * @extends {Error}
 */
function ArgumentNullException(sMessage) {
  this.name = "ArgumentNullException";
  this.message = sMessage;
  this.stack = (new Error()).stack;
}

ArgumentNullException.prototype = Object.create(Error.prototype);
ArgumentNullException.prototype.constructor = ArgumentNullException;

module.exports = ArgumentNullException;
