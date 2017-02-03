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

const util = require('util');
const fs = require('fs');
const path = require('path');
const ArgumentNullException = require('../ArgumentNullException.js');
const IOException = require('./IOException.js');

/**
 * @classdesc A file object. This represents a file specifically, and not a
 * directory or other container.
 */
class FileInfo {
  /**
   * Initializes a new instance of the jsrpi.IO.FileInfo class with the
   * fully-qualified or relative name of the file or directory.
   * @param {String} filePath The fully qualified name of the new file, or the
   * relative file name.
   * @throws {ArgumentNullException} if filePath is null or undefined.
   * @constructor
   */
  constructor(filePath) {
    if (util.isNullOrUndefined(filePath)) {
      throw new ArgumentNullException("'filePath' param cannot be null or undefined.");
    }

    this._name = path.basename(filePath);
    this._originalPath = filePath;
    this._fullPath = path.normalize(this._originalPath);
  }


  /**
   * Returns the path as a string.
   * @return {String} A string representing the path.
   * @override
   */
  toString() {
    return this._originalPath;
  }

  /**
   * Checks to see if this file exists.
   * @return {Boolean} true if exists; Otherwise, false.
   */
  exists() {
    let result = -1;
    try {
      result = fs.openSync(this._fullPath, 'r');
    }
    catch (e) {
    }

    if (result !== -1) {
      fs.closeSync(result);
      return true;
    }
    return false;
  }

  /**
   * Gets the directory name (path) the file is in.
   * @return {String} The directory component of the path.
   */
  getDirectoryName() {
    return path.dirname(this._fullPath);
  }

  /**
   * Gets the file name.
   * @return {String} The file name component of the full file path.
   */
  getFileName() {
    return this._name;
  }

  /**
   * Gets the file extension name.
   * @return {String} The file extension (ie. "txt" or "pdf").
   */
  getFileExtension() {
    return path.extname(this._name).substring(1);
  }

  /**
   * Deletes this file.
   * @throws {IOException} if an error occurred while trying to delete the file
   * (such as if the file does not exist).
   */
  delete() {
    try {
      fs.unlinkSync(this._fullPath);
    }
    catch (e) {
      throw new IOException(e.message);
    }
  }

  /**
   * Gets the file size in bytes.
   * @return {Number} The file size in bytes if it exists; Otherwise, zero. May
   * also return zero if this is a zero byte file.
   */
  getLength() {
    if (!this.exists()) {
      return 0;
    }

    let stats = fs.statSync(this._fullPath);
    return stats["size"];
  }

  /**
   * Gets the file name, without the file extension.
   * @return {String} The file name without file extension.
   */
  getFileNameWithoutExtension() {
    let extLen = path.extname(this._name).length;
    return this._name.substring(0, this._name.length - extLen);
  }

  /**
   * Gets the full file name path (dir + name + extension).
   * @return {String} The full file path.
   */
  getFullName() {
    return this._fullPath;
  }
}

module.exports = FileInfo;
