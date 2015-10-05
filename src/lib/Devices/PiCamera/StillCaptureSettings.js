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

var util = require('util');
var path = require('path');
var Size = require('../../Size.js');
var ImageEncoding = require('./ImageEncoding.js');
var FileInfo = require('../../IO/FileInfo.js');
var CaptureUtils = require('./CaptureUtils.js');

var DEF_IMG_SZ_W = 640;
var DEF_IMG_SZ_H = 480;
var QUAL_MIN = 0;
var QUAL_MAX = 100;
var QUAL_DEF = 75;
var DEF_TIMEOUT = 5000;

/**
 * @classdesc Still capture camera settings.
 * @constructor
 */
function StillCaptureSettings() {
  var self = this;
  var _quality = QUAL_DEF;

  /**
   * Gets or sets the size of the image. Default of 640 x 480.
   * @property {Size}
   */
  this.imageSize = new Size(DEF_IMG_SZ_W, DEF_IMG_SZ_H);

  /**
   * Gets or sets the timeout in milliseconds. This is the time
	 * to elapse before capture and shutdown. Default is TIMEOUT_DEFAULT.
   * @property {Number}
   */
  this.timeout = DEF_TIMEOUT;

  /**
   * Gets or sets the time lapse interval in milliseconds. Set to zero to
   * disable time-lapse capture.
   * @property {Number}
   */
  this.timeLapseInterval = 0;

  /**
   * Gets or sets a value indicating whether or not the still capture will
	 * produce verbose output.
   * @property {Boolean}
   */
  this.verbose = false;

  /**
   * Gets or sets a value indicating whether or not to add raw Bayer data
	 * to JPEG metadata. This option inserts the raw Bayer data into the
	 * JPEG metadata if encoding property is set to ImageEncoding.JPEG.
   * @property {Boolean}
   */
  this.raw = false;

  /**
   * Gets or sets a value indicating whether or not to run in full preview mode.
	 * This runs the preview windows using the full resolution capture mode.
	 * Maximum frames-per-second in this mode is 15fps and the preview will have
	 * the same field of view as the capture. Captures should happen more quickly
	 * as no mode change should be required.
   * @property {Boolean}
   */
  this.fullPreview = false;

  /**
   * Gets or sets the still image capture encoding.
   * @property {ImageEncoding}
   */
  this.encoding = ImageEncoding.JPEG;

  /**
   * Gets or sets the output file the image will be captured to.
   * @property {FileInfo}
   */
  this.outputFile = null;

  /**
   * Gets the image quality.
   * @return {Number} The image quality value.
   */
  this.getImageQuality = function() {
    return _quality;
  };

  /**
   * Sets the image quality.
   * @param  {Number} qualityLevel The image quality level.
   * @throws {RangeError} if the quality value is less than QUALITY_MIN or
   * greater than QUALITY_MAX.
   */
  this.setImageQuality = function(qualityLevel) {
    if ((qualityLevel < QUAL_MIN) || (qualityLevel > QUAL_MAX)) {
      throw new RangeError("Quality value out of range.");
    }
    _quality = qualityLevel;
  };

  /**
   * Converts this instance to a string of arguments that can be passed to
   * raspistill.
   * @return {String} A string of arguments for the raspistill utility.
   */
  this.toArgumentString = function() {
    var fname = "";
    if (!util.isNullOrUndefined(self.outputFile)) {
      fname = self.outputFile.getFileNameWithoutExtension();
    }

    var args = "";
    if (self.imageSize !== Size.EMPTY) {
      args += " --width " + self.imageSize.width.toString();
      args += " --height " + self.imageSize.height.toString();
    }

    args += " --quality " + self.getImageQuality().toString();
    if (self.timeout > 0) {
      args += " --timeout " + self.timeout.toString();
    }

    if (self.timeLapseInterval > 0) {
      args += " --timelapse " + self.timeLapseInterval.toString();
      fname += "_%04d";
    }

    fname += "." + CaptureUtils.getEncodingFileExtension(self.encoding);
    fname = path.join(self.outputFile.getDirectoryName(), fname);
    self.outputFile = new FileInfo(fname);
    args += " --output " + self.outputFile.getFullName();

    if (self.verbose) {
      args += " --verbose";
    }

    args += " --encoding " + self.outputFile.getFileExtension();
    if (self.fullPreview) {
      args += " --fullpreview";
    }

    return args;
  };
}

StillCaptureSettings.prototype.constructor = StillCaptureSettings;

/**
 * The default image size width (640).
 * @type {Number}
 * @const
 */
StillCaptureSettings.DEFAULT_IMAGE_SIZE_W = DEF_IMG_SZ_W;

/**
 * The default image size height (480).
 * @type {Number}
 * @const
 */
StillCaptureSettings.DEFAULT_IMAGE_SIZE_H = DEF_IMG_SZ_H;

/**
 * The minimum quality value (0).
 * @type {Number}
 * @const
 */
StillCaptureSettings.QUALITY_MIN = QUAL_MIN;

/**
 * The maximum quality value (100). This value is almost completely uncompressed.
 * @type {Number}
 * @const
 */
StillCaptureSettings.QUALITY_MAX = QUAL_MAX;

/**
 * The default quality value (75). This provides the best all-around quality vs.
 * performance value.
 * @type {Number}
 * @const
 */
StillCaptureSettings.QUALITY_DEFAULT = QUAL_DEF;

/**
 * The default timeout value (5 seconds).
 * @type {Number}
 * @const
 */
StillCaptureSettings.TIMEOUT_DEFAULT = DEF_TIMEOUT;

module.exports = StillCaptureSettings;
