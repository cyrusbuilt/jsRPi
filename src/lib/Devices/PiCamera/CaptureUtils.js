"use strict";
//
//  CaptureUtils.js
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
 * @fileOverview Image capture utility methods.
 *
 * @module CaptureUtils
 * @requires ImageEncoding
 */

const ImageEncoding = require('./ImageEncoding.js');

/**
 * Gets the encoding file extension.
 * @param  {ImageEncoding} encoding The image encoding format.
 * @return {String}          The file extension associated with the specified
 * encoding.
 */
const getEncodingFileExtension = function(encoding) {
  let ext = "";
  switch (encoding) {
    case ImageEncoding.Bitmap:
      ext = "bmp";
      break;
    case ImageEncoding.GIF:
      ext = "gif";
      break;
    case ImageEncoding.JPEG:
      ext = "jpg";
      break;
    case ImageEncoding.PNG:
      ext = "png";
      break;
    default:
      break;
  }
  return ext;
};

module.exports.getEncodingFileExtension = getEncodingFileExtension;
