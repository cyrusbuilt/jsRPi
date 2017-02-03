"use strict";

//
//  StringUtils.js
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
 * @fileOverview Provides utility methods and constants for working with strings.
 *
 * @module StringUtils
 * @requires util
 * @requires string-builder
 * @requires IllegalArgumentException
 */

const util = require('util');
const StringBuilder = require("string-builder");
const IllegalArgumentException = require("./IllegalArgumentException.js");

/**
 * The default padding character.
 * @constant {String}
 */
const DEFAULT_PAD_CHAR = ' ';

/**
 * Represents an empty string.
 * @constant {String}
 */
const EMPTY = "";

/**
 * Creates a string from the specified character or string.
 * @param  {String} c      The character or string to create the string from. If
 * null or an empty string, then DEFAULT_PAD_CHAR is used instead.
 * @param  {Integer} length The number of instances or the specified character
 * or string to construct the string from.
 * @return {String}        The constructed string.
 */
const create = function(c, length) {
  if ((util.isNullOrUndefined(c)) || (c === EMPTY)) {
    c = DEFAULT_PAD_CHAR;
  }

  let sb = new StringBuilder();
  for (var i = 0; i < length; i++) {
    sb.append(c);
  }
  return sb.toString();
};

/**
 * Pads the left side of the specified string.
 * @param  {String} data   The string to pad.
 * @param  {String} pad    The character or string to pad the specified string
 * with. If null or empty string, then DEFAULT_PAD_CHAR will be used instead.
 * @param  {Integer} length The number of pad characters or instances of string
 * to inject.
 * @return {String}        The padded version of the string.
 */
const padLeft = function(data, pad, length) {
  if ((util.isNullOrUndefined(pad)) || (pad === EMPTY)) {
    pad = DEFAULT_PAD_CHAR;
  }

  let sb = new StringBuilder();
  for (var i = 0; i < length; i++) {
    sb.append(pad);
  }

  sb.append(data);
  return sb.toString();
};

/**
 * Pads the righ side of the specified string.
 * @param  {String} data   The string to pad.
 * @param  {String} pad    The character or string to pad the specified string
 * with. If null or empty string, DEFAULT_PAD_CHAR will be used instead.
 * @param  {Integer} length The number of padding characters or instances of
 * string to use.
 * @return {String}        The padded version of the string.
 */
const padRight = function(data, pad, length) {
  if ((util.isNullOrUndefined(pad)) || (pad === EMPTY)) {
    pad = DEFAULT_PAD_CHAR;
  }

  let sb = new StringBuilder();
  sb.append(data);
  for (var i = 0; i < length; i++) {
    sb.append(pad);
  }

  return sb.toString();
};

/**
 * Pads the specified string on both sides.
 * @param  {String} data   The string to pad.
 * @param  {String} pad    The character or string to pad the specified string
 * with. If null or empty string, DEFAULT_PAD_CHAR will be used instead.
 * @param  {Integer} length The number of characters or instances of string to
 * pad on both sides.
 * @return {String}        The padded version of the string.
 */
const pad = function(data, pad, length) {
  if ((util.isNullOrUndefined(pad)) || (pad === EMPTY)) {
    pad = DEFAULT_PAD_CHAR;
  }

  let p = create(pad, length);
  let sb = new StringBuilder();
  sb.append(p);
  sb.append(data);
  sb.append(p);
  return sb.toString();
};

/**
 * Pads the center of the specified string.
 * @param  {String} data   The string to pad.
 * @param  {String} c      The character or string to pad the center of the
 * specified string with. If null or empty string, DEFAULT_PAD_CHAR will be
 * used instead.
 * @param  {Number} length The number of characters or instances of string to
 * pad the center with.
 * @return {String}        The padded version of the string.
 * @throws {IllegalArgumentException} if data param is null or not a string.
 */
const padCenter = function(data, c, length) {
  if ((util.isNullOrUndefined(data)) || (typeof data !== 'string')) {
    throw new IllegalArgumentException("data param must be a string.");
  }

  if ((util.isNullOrUndefined(c)) || (c === EMPTY)) {
    c = DEFAULT_PAD_CHAR;
  }

  if ((data.length > 2) && (length > 0)) {
    let firstHalf = data.substring(0, (data.length / 2));
    let secondHalf = data.substring((data.length / 2), data.length);
    let pad = create(c, length);

    let sb = new StringBuilder();
    sb.append(firstHalf);
    sb.append(pad);
    sb.append(secondHalf);
    return sb.toString();
  }
  return data;
};

/**
 * Checks to see if the specified string ends with the specified suffix.
 * @param  {String} str    The string to check.
 * @param  {String} suffix The suffix to search the specified string for.
 * @return {Boolean}       true if the string ends with the specified suffix;
 * Otherwise, false.
 */
const endsWith = function(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

/**
 * Checks to see if the specified string begins with the specified prefix.
 * @param  {String} str    The string to check.
 * @param  {String} prefix The prefix to search the specified string for.
 * @return {Boolean}       true if the string starts with the specified suffix;
 * Otherwise, false.
 */
const startsWith = function(str, prefix) {
  return str.indexOf(prefix, 0) === 0;
};

/**
 * Checks to see if the specified string is null or empty.
 * @param  {String} str The string object to inspect.
 * @return {Boolean}    true if the specified string is null or empty;
 * Otherwise, false.
 */
const isNullOrEmpty = function(str) {
  if ((util.isNullOrUndefined(str)) || (str.length === 0)) {
    return true;
  }
  return false;
};

/**
 * Trims whitespace from the beginning and end of the specified string.
 * @param  {String} str The string to trim.
 * @return {String}     The resulting (trimmed) string.
 */
const trim = function(str) {
  if ((util.isNullOrUndefined(str)) || (typeof str !== 'string')) {
    return "";
  }

  if (isNullOrEmpty(str)) {
    return "";
  }
  return str.replace(/^\s+|\s+$/gm,'');
};

/**
 * Checks to see if the specified string contains the specified substring.
 * @param  {String} str    The string to check.
 * @param  {String} substr The string to search for.
 * @return {Boolean}       true if at least one instance of the specified
 * substring was found within the specified string.
 */
const contains = function(str, substr) {
  return (str.indexOf(substr) > -1);
};

/**
 * Coverts a string value to a byte value.
 * @param  {String} str A string representing a byte value (ie. "00000000").
 * @return {Byte|Number}     The byte value.
 */
const convertStringToByte = function(str) {
  let ch = 0;
  let st = [];
  let re = [];
  for (let i = 0; i < str.length; i++) {
    st = [];
    ch = str.charCodeAt(i);
    while (ch) {
      st.push(ch & 0xFF);
      ch >>= 8;
    }
    re = re.concat(st.reverse());
  }
  return re;
};

module.exports.DEFAULT_PAD_CHAR = DEFAULT_PAD_CHAR;
module.exports.EMPTY = EMPTY;
module.exports.create = create;
module.exports.padLeft = padLeft;
module.exports.padRight = padRight;
module.exports.pad = pad;
module.exports.padCenter = padCenter;
module.exports.endsWith = endsWith;
module.exports.startsWith = startsWith;
module.exports.isNullOrEmpty = isNullOrEmpty;
module.exports.trim = trim;
module.exports.contains = contains;
module.exports.convertStringToByte = convertStringToByte;
