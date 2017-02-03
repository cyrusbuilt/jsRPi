"use strict";
//
//  StillCaptureSettings.js
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
const path = require('path');
const Size = require('../../Size.js');
const ImageEncoding = require('./ImageEncoding.js');
const FileInfo = require('../../IO/FileInfo.js');
const CaptureUtils = require('./CaptureUtils.js');
const IllegalArgumentException = require('../../IllegalArgumentException.js');

const DEF_IMG_SZ_W = 640;
const DEF_IMG_SZ_H = 480;
const QUAL_MIN = 0;
const QUAL_MAX = 100;
const QUAL_DEF = 75;
const DEF_TIMEOUT = 5000;

/**
 * @classdesc Still capture camera settings.
 */
class StillCaptureSettings {
  /**
   * Initializes a new instance of the jsrpi.Devices.PiCamera.StillCaptureSettings
   * class.
   * @constructor
   */
  constructor() {
    this._quality = QUAL_DEF;
    this._size = new Size(DEF_IMG_SZ_W, DEF_IMG_SZ_H);
    this._timeout = DEF_TIMEOUT;
    this._timeLapseInterval = 0;
    this._verbose = false;
    this._raw = false;
    this._fullPreview = false;
    this._encoding = ImageEncoding.JPEG;
    this._outputFile = null;
  }

  /**
   * Gets or sets the size of the image. Default of 640 x 480.
   * @property {Size} imageSize - The image size.
   * @throws {IllegalArgumentException} if the value set is not of type
   * jsrpi.Size.
   */
  get imageSize() {
    return this._size;
  }

  set imageSize(sz) {
    if (!(sz instanceof Size)) {
      throw new IllegalArgumentException("imageSize property must be of type: jsrpi.Size.");
    }

    this._size = sz;
  }

  /**
   * Gets or sets the timeout in milliseconds. This is the time to elapse before capture
   * and shutdown. Default is TIMEOUT_DEFAULT.
   * @property {Number} timeout - The capture timeout.
   */
  get timeout() {
    return this._timeout;
  }

  set timeout(tm_out) {
    this._timeout = tm_out;
  }

  /**
   * Gets or sets the time lapse interval in milliseconds. Default is zero (disabled).
   * @property {Number} timeLapseInterval - The time lapse interval.
   */
  get timeLapseInterval() {
    return this._timeLapseInterval;
  }

  set timeLapseInterval(interval) {
    this._timeLapseInterval = interval;
  }

  /**
   * Gets a value indicating whether or not the still capture will
   * produce verbose output. Default is false.
   * @property {Boolean} verbose - true: verbose enabled, false: verbose
   * disabled.
   */
  get verbose() {
    return this._verbose;
  }

  set verbose(v) {
    this._verbose = v;
  }

  /**
   * Gets a value indicating whether or not to add raw Bayer data
   * to JPEG metadata. This option inserts the raw Bayer data into the
   * JPEG metadata if encoding property is set to ImageEncoding.JPEG. Default is
   * false.
   * @property {Boolean} raw - When true, will add raw bayer data.
   */
  get raw() {
    return this._raw;
  }

  set raw(flag) {
    this._raw = flag;
  }

  /**
   * Gets or sets a value indicating whether or not to run in full preview mode.
   * This runs the preview windows using the full resolution capture mode.
   * Maximum frames-per-second in this mode is 15fps and the preview will have
   * the same field of view as the capture. Captures should happen more quickly
   * as no mode change should be required.
   * @property {Boolean} fullPreview - true to run in full preview mode;
   * Otherwise, false.
   */
  get fullPreview() {
    return this._fullPreview;
  }

  set fullPreview(flag) {
    this._fullPreview = flag;
  }

  /**
   * Gets or sets the still image capture encoding.
   * @property {ImageEncoding} encoding - The image encoding.
   */
  get encoding() {
    return this._encoding;
  }

  set encoding(e) {
    this._encoding = e;
  }

  /**
   * Gets or sets the output file the image will be captured to.
   * @property {FileInfo} outputFile - The output file that the image will be
   * stored in.
   * @throws {IllegalArgumentException} if the specified value is not of type
   * jsrpi.IO.FileInfo.
   */
  get outputFile() {
    return this._outputFile;
  }

  set outputFile(file) {
    if (!(file instanceof FileInfo)) {
      throw new IllegalArgumentException("Specified value must be of type jsrpi.IO.FileInfo.");
    }

    this._outputFile = file;
  }

  /**
   * Gets or sets the image quality.
   * @property {Number} imageQuality - The image quality level.
   * @throws {RangeError} if the quality value is less than QUALITY_MIN or
   * greater than QUALITY_MAX.
   */
  get imageQuality() {
    return this._quality;
  }

  set imageQuality(qualityLevel) {
    if ((qualityLevel < QUAL_MIN) || (qualityLevel > QUAL_MAX)) {
      throw new RangeError("Quality value out of range.");
    }
    this._quality = qualityLevel;
  }

  /**
   * Converts this instance to a string of arguments that can be passed to
   * raspistill.
   * @return {String} A string of arguments for the raspistill utility.
   */
  toArgumentString() {
    let fname = "";
    if (!util.isNullOrUndefined(this.outputFile)) {
      fname = this.outputFile.getFileNameWithoutExtension();
    }

    let args = "";
    if (this.imageSize !== Size.EMPTY) {
      args += " --width " + this.imageSize.width.toString();
      args += " --height " + this.imageSize.height.toString();
    }

    args += " --quality " + this.imageQuality.toString();
    if (this.timeout > 0) {
      args += " --timeout " + this.timeout.toString();
    }

    if (this.timeLapseInterval > 0) {
      args += " --timelapse " + this.timeLapseInterval.toString();
      fname += "_%04d";
    }

    fname += "." + CaptureUtils.getEncodingFileExtension(this.encoding);
    fname = path.join(this.outputFile.getDirectoryName(), fname);
    this.outputFile = new FileInfo(fname);
    args += ' --output "' + this.outputFile.getFullName() + '"';

    if (this.verbose) {
      args += " --verbose";
    }

    args += " --encoding " + this.outputFile.getFileExtension();
    if (this.fullPreview) {
      args += " --fullpreview";
    }

    return args;
  }

  /**
   * The default image size width (640).
   * @type {Number}
   * @const
   */
  static get DEFAULT_IMAGE_SIZE_W() { return DEF_IMG_SZ_W; }

  /**
   * The default image size height (480).
   * @type {Number}
   * @const
   */
  static get DEFAULT_IMAGE_SIZE_H() { return DEF_IMG_SZ_H; }

  /**
   * The minimum quality value (0).
   * @type {Number}
   * @const
   */
  static get QUALITY_MIN() { return QUAL_MIN; }

  /**
   * The maximum quality value (100). This value is almost completely uncompressed.
   * @type {Number}
   * @const
   */
  static get QUALITY_MAX() { return QUAL_MAX; }

  /**
   * The default quality value (75). This provides the best all-around quality vs.
   * performance value.
   * @type {Number}
   * @const
   */
  static get QUALITY_DEFAULT() { return QUAL_DEF; }

  /**
   * The default timeout value (5 seconds).
   * @type {Number}
   * @const
   */
  static get TIMEOUT_DEFAULT() { return DEF_TIMEOUT; }
}

module.exports = StillCaptureSettings;
