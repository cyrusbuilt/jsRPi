"use strict";
//
//  ImageEncoding.js
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
 * Image encoding formats.
 * @enum {Number}
 */
var ImageEncoding = {
  /**
   * JPEG image encoding. NOTE: This is the only supported format that
	 * is hardware accelerated. All other image types will take much longer
	 * to save because they are not accelerated.
   * @type {Number}
   */
  JPEG : 0,

  /**
   * Bitmap image encoding.
   * @type {Number}
   */
  Bitmap : 1,

  /**
   * GIF image encoding.
   * @type {Number}
   */
  GIF : 2,

  /**
   * PNG image encoding.
   * @type {Number}
   */
  PNG : 3
};

module.exports = ImageEncoding;
