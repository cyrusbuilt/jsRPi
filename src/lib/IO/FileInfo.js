"use strict";
//
//  FileInfo.js
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

var util = require('util');
var fs = require('fs');
var path = require('path');
var ArgumentNullException = require('../ArgumentNullException.js');

/**
 * @classdesc A file object. This represents a file specifically, and not a
 * directory or other container.
 * @param {String} filePath The fully qualified name of the new file, or the
 * relative file name.
 * @throws {ArgumentNullException} if filePath is null or undefined.
 * @constructor
 */
function FileInfo(filePath) {
  if (util.isNullOrUndefined(filePath)) {
    throw new ArgumentNullException("'filePath' param cannot be null or undefined.");
  }

  var self = this;
  var _name = path.basename(filePath);
  var _originalPath = filePath;
  var _fullPath = path.normalize(_originalPath);

  /**
   * Returns the path as a string.
   * @return {String} A string representing the path.
   * @override
   */
  this.toString = function() {
    return _originalPath;
  };

  /**
   * Checks to see if this file exists.
   * @return {Boolean} true if exists; Otherwise, false.
   */
  this.exists = function() {
    var result = -1;
    try {
      result = fs.openSync(_fullPath, 'r');
    }
    catch (e) {
    }

    if (result !== -1) {
      fs.closeSync(result);
      return true;
    }
    return false;
  };

  /**
   * Gets the directory name (path) the file is in.
   * @return {String} The directory component of the path.
   */
  this.getDirectoryName = function() {
    return path.dirname(_fullPath);
  };

  /**
   * Gets the file name.
   * @return {String} The file name component of the full file path.
   */
  this.getFileName = function() {
    return _name;
  };

  /**
   * Gets the file extension name.
   * @return {String} The file extension (ie. "txt" or "pdf").
   */
  this.getFileExtension = function() {
    return path.extname(_name).substring(1);
  };

  /**
   * Deletes this file.
   */
  this.delete = function() {
    fs.unlinkSync(_fullPath);
  };

  /**
   * Gets the file size in bytes.
   * @return {Number} The file size in bytes if it exists; Otherwise, zero. May
   * also return zero if this is a zero byte file.
   */
  this.getLength = function() {
    if (!self.exists()) {
      return 0;
    }
    var stats = fs.statSync(_fullPath);
    return stats["size"];
  };

  /**
   * Gets the file name, without the file extension.
   * @return {String} The file name without file extension.
   */
  this.getFileNameWithoutExtension = function() {
    var extLen = path.extname(_name).length;
    return _name.substring(0, _name.length - (extLen + 1));
  };

  /**
   * Gets the full file name path (dir + name + extension).
   * @return {String} The full file path.
   */
  this.getFullName = function() {
    return _fullPath;
  };
}

FileInfo.prototype.constructor = FileInfo;
module.exports = FileInfo;
