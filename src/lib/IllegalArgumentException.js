"use strict";

//
//  IllegalArgumentException.js
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
 * @classdesc The exception that is thrown if an argument value passed to a
 * function is illegal or invalid.
 * @extends {Error}
 */
 class IllegalArgumentException extends Error {
     /**
     * Initializes a new instance of the jsrpi.IllegalArgumentException class with
     * a message describing the error.
     * @param {String} sMessage A description of the error.
     * @constructor
     */
     constructor(sMessage) {
         super(sMessage);
         this.name = this.constructor.name;
         if (typeof Error.captureStackTrace === 'function') {
             Error.captureStackTrace(this, this.constructor);
         } else {
             this.stack = (new Error(sMessage)).stack;
         }
     }
 }

module.exports = IllegalArgumentException;
