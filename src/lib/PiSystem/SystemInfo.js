"use strict";

//
//  SystemInfo.js
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
 * @fileOverview This module provides methods for getting system-specific info
 * about the host OS and the board it is running on.
 *
 * @module SystemInfo
 * @requires os
 * @requires ExecUtils
 * @requires StringUtils
 * @requires InvalidOperationException
 * @requires BoardType
 */

var os = require('os');
var ExecUtils = require("../ExecUtils.js");
var StringUtils = require("../StringUtils.js");
var InvalidOperationException = require("../InvalidOperationException.js");
var BoardType = require("./BoardType.js");

/**
 * Internal CPU info cache.
 * @type {Array}
 * @package
 */
var _cpuInfo = null;

/**
 * Gets information about the CPU and returns the value from the specified
 * target field.
 * @param  {String} target The target attribute to get the value of. Throws
 * InvalidOperationException if the specified target is invalid (unknown).
 * @return {String}        The value of the specified CPU attribute.
 * @package
 */
var getCpuInfo = function(target) {
  if (_cpuInfo == null) {
    _cpuInfo = [];
    var result = ExecUtils.executeCommand("cat /proc/cpuinfo");
    if (result != null) {
      var line = StringUtils.EMPTY;
      var parts = [];
      for (var i = 0; i < result.length; i++) {
        line = result[i];
        parts = line.split(':');
        if ((parts.length >= 2) &&
            (!StringUtils.isNullOrEmpty(StringUtils.trim(parts[0]))) &&
            (!StringUtils.isNullOrEmpty(StringUtils.trim(parts[1])))) {
            _cpuInfo[StringUtils.trim(parts[0])] = StringUtils.trim(parts[1]);
        }
      }
    }
  }

  if (target in _cpuInfo) {
    return _cpuInfo[target];
  }

  throw new InvalidOperationException("Invalid target: " + target);
};

/**
 * Gets the processor.
 * @return {String} The processor.
 */
var getProcessor = function() {
  return getCpuInfo("Processor");
};

/**
 * Get the Bogo MIPS.
 * @return {String} The Bogo MIPS.
 */
var getBogoMIPS = function() {
  return getCpuInfo("BogoMIPS");
};

/**
 * Gets the CPU features.
 * @return {Array} The CPU features.
 */
var getCpuFeatures = function() {
  return getCpuInfo("Features").split(' ');
};

/**
 * Gets the CPU implementer.
 * @return {String} The CPU implementer.
 */
var getCpuImplementer = function() {
  return getCpuInfo("CPU implementer");
};

/**
 * Gets the CPU architecture.
 * @return {String} The CPU architecture.
 */
var getCpuArchitecture = function() {
  return getCpuInfo("CPU architecture");
};

/**
 * Gets the CPU variant.
 * @return {String} The CPU variant.
 */
var getCpuVariant = function() {
  return getCpuInfo("CPU variant");
};

/**
 * Gets the CPU part.
 * @return {String} The CPU part.
 */
var getCpuPart = function() {
  return getCpuInfo("CPU part");
};

/**
 * Gets the CPU revision.
 * @return {String} The CPU revision.
 */
var getCpuRevision = function() {
  return getCpuInfo("CPU revision");
};

/**
 * Gets the hardware the system is implemented on.
 * @return {String} The hardware.
 */
var getHardware = function() {
  return getCpuInfo("Hardware");
};

/**
 * Gets the system revision.
 * @return {String} The system revision.
 */
var getSystemRevision = function() {
  return getCpuInfo("Revision");
};

/**
 * Gets the serial number.
 * @return {String} The serial number.
 */
var getSerial = function() {
  return getCpuInfo("Serial");
};

/**
 * Gets the name of the OS.
 * @return {String} The OS name.
 */
var getOsName = function() {
  return os.type();
};

/**
 * Gets the OS version.
 * @return {String} The OS version.
 */
var getOsVersion = function() {
  return os.release();
};

/**
 * Gets the OS architecture.
 * @return {String} The OS architecture.
 */
var getOsArch = function() {
  return os.arch();
};

/**
 * Gets the OS firmware build.
 * @return {String} The OS firmware build.
 * @throws {InvalidOperationException} if an unexpected response is received.
 */
var getOsFirmwareBuild = function() {
  var results = ExecUtils.executeCommand("/opt/vc/bin/vcgencmd version");
  var val = StringUtils.EMPTY;
  if (results != null) {
    var line = StringUtils.EMPTY;
    for (var i = 0; i < results.length; i++) {
      line = results[i];
      if (StringUtils.startsWith(line, "version ")) {
        val = line;
        break;
      }
    }
  }

  if (!StringUtils.isNullOrEmpty(val)) {
    return val.substring(8);
  }

  throw new InvalidOperationException("Invalid command or response.");
};

/**
 * Gets the OS firwmware date.
 * @return {String} The OS firwmware date.
 * @throws {InvalidOperationException} if an unexpected response is received.
 */
var getOsFirmwareDate = function() {
  var results = ExecUtils.executeCommand("/opt/vc/bin/vcgencmd version");
  var val = StringUtils.EMPTY;
  if (results != null) {
    var line = StringUtils.EMPTY;
    for (var i = 0; i < results.length; i++) {
      line = results[i];
      val = line;
      break;
    }
  }

  if (!StringUtils.isNullOrEmpty(val)) {
    return val;
  }

  throw new InvalidOperationException("Invalid command or response.");
};

/**
 * Gets the system memory info
 * @return {Array} The memory info.
 * @private
 */
var getMemory = function() {
  var values = [];
  var result = ExecUtils.executeCommand("free -b");
  if (result != null) {
    var parts = [];
    var part = StringUtils.EMPTY;
    var line = StringUtils.EMPTY;
    var linePart = StringUtils.EMPTY;
    var val = 0;
    for (var i = 0; i < result.length; i++) {
      if (StringUtils.startsWith(line, "Mem:")) {
        parts = line.split(' ');
        for (var j = 0; j < parts.length; j++) {
          part = parts[j];
          linePart = StringUtils.trim(part);
          if ((!StringUtils.isNullOrEmpty(linePart)) &&
              (line.toUpperCase() === "Mem:".toUpperCase())) {
            values.push(parseFloat(val));
          }
        }
      }
    }
  }
  return values;
};

/**
 * Gets the total amount of system memory.
 * @return {Number} If successful, the total system memory; Otherwise, -1.
 */
var getMemoryTotal = function() {
  var values = getMemory();
  if ((values != null) && (values.length > 0)) {
    return values[0];  // Total memory value is the first position.
  }
  return -1;
};

/**
 * Gets the amount of memory consumed.
 * @return {Number} If successful, the amount of memory that is in use;
 * Otherwise, -1.
 */
var getMemoryUsed = function() {
  var values = getMemory();
  if ((values != null) && (values.length > 1)) {
    return values[1];  // Used memory value is the second position.
  }
  return -1;
};

/**
 * Gets the free memory available.
 * @return {Number} If successful, the amount of memory available; Otherwise, -1.
 */
var getMemoryFree = function() {
  var values = getMemory();
  if ((values != null) && (values.length > 2)) {
    return values[2];  // Free memory value is the third position.
  }
  return -1;
};

/**
 * Gets the amount of shared memory.
 * @return {Number} If successful, the shared memory; Otherwise, -1.
 */
var getMemoryShared = function() {
  var values = getMemory();
  if ((values != null) && (values.length > 3)) {
    return values[3];  // Shared memory value is the fourth position.
  }
  return -1;
};

/**
 * Gets the buffer memory.
 * @return {Number} If successful, the buffer memory; Otherwise, -1.
 */
var getMemoryBuffers = function() {
  var values = getMemory();
  if ((values != null) && (values.length > 4)) {
    return values[4];  // Buffer memory value is the fifth position.
  }
  return -1;
};

/**
 * Gets the amount of cache memory.
 * @return {Number} If successful, the cache memory; Otherwise, -1.
 */
var getMemoryCached = function() {
  var values = getMemory();
  if ((values != null) && (values.length > 5)) {
    return values[5];  // Cache memory value is the sixth position.
  }
  return -1;
};

/**
 * Gets the type of the board the executing script is running on.
 * @return {BoardType} The board type.
 */
var getBoardType = function() {
  // The following info obtained from:
	// http://www.raspberrypi.org/archives/1929
	// http://raspberryalphaomega.org.uk/?p=428
	// http://www.raspberrypi.org/phpBB3/viewtopic.php?p=281039#p281039
  var bt = BoardType.Unknown;
  switch (getSystemRevision()) {
    case "0002":  // Model B Revision 1
    case "0003":  // Model B Revision 1 + Fuses mod and D14 removed
      bt = BoardType.ModelB_Rev1;
      break;
    case "0004":  // Model B Revision 2 256MB (Sony)
    case "0005":  // Model B Revision 2 256MB (Qisda)
    case "0006":  // Model B Revision 2 256MB (Egoman)
    case "000d":  // Model B Revision 2 512MB (Egoman)
    case "000e":  // Model B Revision 2 512MB (Sony)
    case "000f":  // Model B Revision 2 512MB (Qisda)
      bt = BoardType.ModelB_Rev2;
      break;
    default:
      break;
  }
  return bt;
};

/**
 * Gets the CPU temperature.
 * @return {Number} The CPU temperature.
 * @throws {InvalidOperationException} if invalid command ("measure_temp") or
 * response.
 */
var getCpuTemperature = function() {
  // CPU temperature is in the form
	// pi@mypi$ /opt/vc/bin/vcgencmd measure_temp
	// temp=42.3'C
	// Support for this was added around firmware version 3357xx per info
	// at http://www.raspberrypi.org/phpBB3/viewtopic.php?p=169909#p169909
	var result = ExecUtils.executeCommand("/opt/vc/bin/vcgencmd measure_temp");
  if (result != null) {
    var parts = [];
    var val = -1;
    var line = StringUtils.EMPTY;
    var separators = ["\\\[", "\\\=", "\\\]", "\\\'"];
    for (var i = 0; i < result.length; i++) {
      line = result[i];
      parts = line.split(new RegExp(separators.join('|'), 'g'), 3);
      val = parseFloat(parts[1]);
      if (val === "NaN") {
        val = -1;
      }
    }
    return val;
  }
  throw new InvalidOperationException("Invalid command or response.");
};

/**
 * Gets the voltage.
 * @param  {String} id The ID of the voltage type to get (core, sdram_c, etc).
 * @return {Number}    The voltage.
 * @throws {InvalidOperationException} if invalid command ("measure_temp") or
 * response.
 * @private
 */
var getVoltage = function(id) {
  var result = ExecUtils.executeCommand("/opt/vc/bin/vcgencmd measure_volts " + id);
  if (result != null) {
    var val = -1;
    var parts = [];
    var line = StringUtils.EMPTY;
    var separators = ["\\\[", "\\\=", "\\\V", "\\\]"];
    for (var i = 0; i < result.length; i++) {
      line = result[i];
      parts = line.split(new RegExp(separators.join('|')), 3);
      val = parseFloat(parts[1]);
      if (val === "NaN") {
        val = -1;
      }
    }
    return val;
  }
  throw new InvalidOperationException("Invalid command or response.");
};

/**
 * Gets the CPU voltage.
 * @return {Number} The CPU voltage.
 * @throws {InvalidOperationException} if invalid command ("measure_temp") or
 * response.
 */
var getCpuVoltage = function() {
  return getVoltage("core");
};

/**
 * Gets the memory voltage of SDRAM C.
 * @return {Number} The memory voltage of SDRAM C.
 * @throws {InvalidOperationException} if invalid command ("measure_temp") or
 * response.
 */
var getMemoryVoltageSDRamC = function() {
  return getVoltage("sdram_c");
};

/**
 * Gets the memory voltage of SDRAM I.
 * @return {Number} The memory voltage of SDRAM I.
 * @throws {InvalidOperationException} if invalid command ("measure_temp") or
 * response.
 */
var getMemoryVoltageSDRamI = function() {
  return getVoltage("sdram_i");
};

/**
 * Gets the memory voltage of SDRAM P.
 * @return {Number} The memory voltage of SDARM P.
 * @throws {InvalidOperationException} if invalid command ("measure_temp") or
 * response.
 */
var getMemoryVoltageSDRamP = function() {
  return getVoltage("sdram_p");
};

/**
 * Gets whether or not the specified codec is enabled.
 * @param  {String} codec The codec to get.
 * @return {Boolean} true if the codec is enabled; Otherwise, false.
 * @throws {InvalidOperationException} if invalid command ("measure_temp") or
 * response.
 * @private
 */
var getCodecEnabled = function(codec) {
  var enabled = false;
  var result = ExecUtils.executeCommand("/opt/vc/bin/vcgencmd codec_enabled " + codec);
  if (result != null) {
    var parts = [];
    var line = StringUtils.EMPTY;
    for (var i = 0; i < result.length; i++) {
      line = result[i];
      parts = line.split('=', 2);
      if (StringUtils.trim(parts[1]).toUpperCase() === "ENABLED") {
        enabled = true;
        break;
      }
    }
  }
  return enabled;
};

/**
 * Determines if the H264 codec is enabled.
 * @return {Boolean} true if H264 is enabled; Otherwise, false.
 */
var isCodecH264Enabled = function() {
  return getCodecEnabled("H264");
};

/**
 * Determines if the MPG2 codec is enabled.
 * @return {Boolean} true if H264 is enabled; Otherwise, false.
 */
var isCodecMPG2Enabled = function() {
  return getCodecEnabled("MPG2");
};

/**
 * Determines if the WVC1 codec is enabled.
 * @return {Boolean} true if WVC1 is enabled; Otherwise, false.
 */
var isCodecWVC1Enabled = function() {
  return getCodecEnabled("WVC1");
};

/**
 * Gets the clock frequency for the specified target.
 * @param  {String} target The target clock to get the frequency of.
 * @return {Number}        The clock frequency, if successful; Otherwise, -1.
 */
var getClockFrequency = function(target) {
  if (target == null) {
    return -1;
  }

  target = StringUtils.trim(target);
  var val = -1;
  var result = ExecUtils.executeCommand("/opt/vc/bin/vcgencmd measure_clock " + target);
  if (result != null) {
    var parts = [];
    var line = StringUtils.EMPTY;
    var temp = -1;
    for (var i = 0; i < result.length; i++) {
      line = result[i];
      parts = line.split('=', 2);
      temp = parseFloat(StringUtils.trim(parts[1]));
      if (temp !== "NaN") {
        val = temp;
        break;
      }
    }
  }
  return val;
};

/**
 * Gets the BaSH version info. This method is used to help determine the
 * HARD-FLOAT / SOFT-FLOAT ABI of the system.
 * @return {String} The BaSH version info.
 * @private
 */
var getBashVersionInfo = function() {
  var ver = StringUtils.EMPTY;
  try {
    var result = ExecUtils.executeCommand("bash --version");
    var line = StringUtils.EMPTY;
    for (var i = 0; i < result.length; i++) {
      line = result[i];
      if (!StringUtils.isNullOrEmpty(line)) {
        ver = line;  // Return only the first line.
        break;
      }
    }
  }
  catch (e) {
  }
  return ver;
};

/**
 * This method will obtain a specified tag value from the ELF info in the
 * '/proc/self/exe' program (this method is used to help determine the
 * HARD-FLOAT / SOFT-FLOAT ABI of the system).
 * @param  {String} tag The tag to get the value of.
 * @return {String}     The ABI tag value.
 * @private
 */
var getReadElfTag = function(tag) {
  var tagVal = StringUtils.EMPTY;
  try {
    var result = ExecUtils.executeCommand("/usr/bin/readelf -A /proc/self/exe");
    if (result != null) {
      var lineParts = [];
      var part = StringUtils.EMPTY;
      var line = StringUtils.EMPTY;
      for (var i = 0; i < result.length; i++) {
        line = result[i];
        part = StringUtils.trim(line);
        if ((StringUtils.startsWith(part, tag)) &&
            (StringUtils.contains(part, ":"))) {
          lineParts = part.split(':', 2);
          if (lineParts.length > 1) {
            tagVal = StringUtils.trim(lineParts[1]);
          }
          break;
        }
      }
    }
  }
  catch (e) {
  }
  return tagVal;
};

/**
 * This method will determine if a specified tag exists from the ELF info in the
 * '/proc/self/exe' program (this method is used to help determine the
 * HARD-FLOAT / SOFT-FLOAT ABI of the system).
 * @param  {String} tag The tag to check for.
 * @return {Boolean}    true if contains the specified ELF tag.
 * @private
 */
var hasReadElfTag = function(tag) {
  var tagValue = getReadElfTag(tag);
  return !StringUtils.isNullOrEmpty(tagValue);
};

/**
 * Determines if is hard float ABI.
 * @return {Boolean} true if is hard float ABI; Otherwise, false.
 */
var isHardFloatABI = function() {
  return ((StringUtils.contains(getBashVersionInfo(), "gnueabihf")) ||
          (hasReadElfTag("Tag_ABI_HardFP_use")));
};

/**
 * Gets the current system time in milliseconds.
 * @return {Number} The current time millis.
 */
var getCurrentTimeMillis = function() {
  return new Date().getMilliseconds();
};


module.exports.getProcessor = getProcessor;
module.exports.getBogoMIPS = getBogoMIPS;
module.exports.getCpuFeatures = getCpuFeatures;
module.exports.getCpuImplementer = getCpuImplementer;
module.exports.getCpuArchitecture = getCpuArchitecture;
module.exports.getCpuVariant = getCpuVariant;
module.exports.getCpuPart = getCpuPart;
module.exports.getCpuRevision = getCpuRevision;
module.exports.getHardware = getHardware;
module.exports.getSystemRevision = getSystemRevision;
module.exports.getSerial = getSerial;
module.exports.getOsName = getOsName;
module.exports.getOsVersion = getOsVersion;
module.exports.getOsArch = getOsArch;
module.exports.getOsFirmwareBuild = getOsFirmwareBuild;
module.exports.getOsFirmwareDate = getOsFirmwareDate;
module.exports.getMemoryTotal = getMemoryTotal;
module.exports.getMemoryUsed = getMemoryUsed;
module.exports.getMemoryFree = getMemoryFree;
module.exports.getMemoryShared = getMemoryShared;
module.exports.getMemoryBuffers = getMemoryBuffers;
module.exports.getMemoryCached = getMemoryCached;
module.exports.getBoardType = getBoardType;
module.exports.getCpuTemperature = getCpuTemperature;
module.exports.getCpuVoltage = getCpuVoltage;
module.exports.getMemoryVoltageSDRamC = getMemoryVoltageSDRamC;
module.exports.getMemoryVoltageSDRamI = getMemoryVoltageSDRamI;
module.exports.getMemoryVoltageSDRamP = getMemoryVoltageSDRamP;
module.exports.isCodecH264Enabled = isCodecH264Enabled;
module.exports.isCodecMPG2Enabled = isCodecMPG2Enabled;
module.exports.isCodecWVC1Enabled = isCodecWVC1Enabled;
module.exports.getClockFrequency = getClockFrequency;
module.exports.isHardFloatABI = isHardFloatABI;
module.exports.getCurrentTimeMillis = getCurrentTimeMillis;
