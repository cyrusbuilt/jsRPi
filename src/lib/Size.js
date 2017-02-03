"use strict";
//
//  Size.js
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
 * A 2-dimensional size structure.
 * @struct
 */
class Size {
  /**
   * Initializes a new instance of the jsrpi.Size class.
   * @param {Number} width  The width of an object.
   * @param {Number} height The height of an object.
   * @constructor
   */
  constructor(width, height) {
    this._width = width || 0;
    this._height = height || 0;
  }

  /**
   * Gets or sets the object width.
   * @property {Number} width - The object width.
   */
  get width() {
    return this._width;
  }

  set width(w) {
    this._width = w;
  }

  /**
   * Gets or sets the object height.
   * @property {Number} height - The object height.
   */
  get height() {
    return this._height;
  }

  set height(h) {
    this._height = h;
  }

  /**
  * An empty instance of Size.
  * @type {Size}
  * @const
  */
  static get EMPTY() { return new Size(0, 0); }
}

module.exports = Size;
