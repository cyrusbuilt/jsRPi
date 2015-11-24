"use strict";

//
//  LcdBase.js
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

var inherits = require('util').inherits;
var ComponentBase = require('../ComponentBase.js');
var Lcd = require('./Lcd.js');
var StringUtils = require('../../StringUtils.js');
var InvalidOperationException = require('../../InvalidOperationException.js');
var LcdTextAlignment = require('./LcdTextAlignment.js');
var sb = require('string-builder');

/**
* Base class for LCD display abstractions.
* @constructor
* @implements {Lcd}
* @extends {ComponentBase}
*/
function LcdBase() {
  Lcd.call(this);

  var self = this;
  var _base = new ComponentBase();

  /**
  * Component name property.
  * @property {String}
  */
  this.componentName = _base.componentName;

  /**
  * Tag property.
  * @property {Object}
  */
  this.tag = _base.tag;

  /**
  * Gets the property collection.
  * @return {Array} A custom property collection.
  * @override
  */
  this.getPropertyCollection = function() {
    return _base.getPropertyCollection();
  };

  /**
  * Checks to see if the property collection contains the specified key.
  * @param  {String} key The key name of the property to check for.
  * @return {Boolean}    true if the property collection contains the key;
  * Otherwise, false.
  * @override
  */
  this.hasProperty = function(key) {
    return _base.hasProperty(key);
  };

  /**
  * Sets the value of the specified property. If the property does not already exist
  * in the property collection, it will be added.
  * @param  {String} key   The property name (key).
  * @param  {String} value The value to assign to the property.
  */
  this.setProperty = function(key, value) {
    _base.setProperty(key, value);
  };

  /**
  * Determines whether or not the current instance has been disposed.
  * @return {Boolean} true if disposed; Otherwise, false.
  * @override
  */
  this.isDisposed = function() {
    return _base.isDisposed();
  };

  /**
  * Gets the property collection.
  * @return {Array} A custom property collection.
  * @override
  */
  this.getPropertyCollection = function() {
    return _base.getPropertyCollection();
  };

  /**
  * Checks to see if the property collection contains the specified key.
  * @param  {String} key The key name of the property to check for.
  * @return {Boolean}    true if the property collection contains the key;
  * Otherwise, false.
  * @override
  */
  this.hasProperty = function(key) {
    return _base.hasProperty(key);
  };

  /**
  * Sets the value of the specified property. If the property does not already exist
  * in the property collection, it will be added.
  * @param  {String} key   The property name (key).
  * @param  {String} value The value to assign to the property.
  */
  this.setProperty = function(key, value) {
    _base.setProperty(key, value);
  };

  /**
  * Returns the string representation of this object. In this case, it simply
  * returns the component name.
  * @return {String} The name of this component.
  */
  this.toString = function() {
    return _base.toString();
  };

  /**
  * Releases all managed resources used by this instance.
  * @override
  */
  this.dispose = function() {
    if (_base.isDisposed()) {
      return;
    }

    _base.dispose();
  };

  /**
  * Validates the index of the specified row.
  * @param  {Number} row The index of the row to validate.
  * @throws {InvalidOperationException} if the row index is invalid for the
  * display.
  * @protected
  */
  this._validateRowIndex = function(row) {
    row = row || 0;
    if ((row >= self.getRowCount()) || (row < 0)) {
      throw new InvalidOperationException("Invalid row index.");
    }
  };

  /**
  * Validates the index of the column.
  * @param  {Number} column The index of the column to validate.
  * @throws {InvalidOperationException} if the column index is invalid for the
  * display.
  * @protected
  */
  this._validateColumnIndex = function(column) {
    column = column || 0;
    if ((column >= self.getColumnCount()) || (column < 0)) {
      throw new InvalidOperationException("Invalid column index.");
    }
  };

  /**
  * Validates the specified coordinates.
  * @param  {Number} row    The index of the row to validate.
  * @param  {Number} column The index of the column to validate
  * @throws {InvalidOperationException} if the row or column index is invalid
  * for the display.
  * @protected
  */
  this._validateCoordinates = function(row, column) {
    self._validateRowIndex(row);
    self._validateColumnIndex(column);
  };

  // TODO Implement setCursorPosition() in derived component.
  // setCursorPosition(row, column) {
  //  row = row || 0;
  //  column = column || 0;
  //  self._validateCoordinates(row, column);
  //  ...
  //  ...
  // }

  /**
  * Sends the cursor to the home position which is in the top-level corner of
  * the screen (row 0, column 0).
  * @override
  */
  this.sendCursorHome = function() {
    self.setCursorPosition(0, 0);
  };

  /**
  * Writes a single character to the display.
  * @param  {String} char A single character to write.
  * @override
  */
  this.writeSingleChar = function(char) {
    self.writeSingleByte(char.charCodeAt(0));
  };

  /**
  * Write the specified byte to the display at the specified position.
  * @param  {Number} row    The row to position the data in.
  * @param  {Number} column The column within the row to start the write.
  * @param  {Byte|Number} data   The byte to write.
  * @throws {InvalidOperationException} if the row or column index is invalid for
  * the display.
  * @override
  */
  this.writeByte = function(row, column, data) {
    self._validateCoordinates(row, column);
    self.setCursorPosition(row, column);
    self.writeSingleByte(data);
  };

  /**
  * Writes the specified byte buffer to the display at the specified position.
  * @param  {Number} row    The row to position the data in.
  * @param  {Number} column The column within the row to start the write.
  * @param  {Array} dataBuffer The array of bytes to write to the display.
  * @throws {InvalidOperationException} if the row or column index is invalid
  * for the display.
  * @override
  */
  this.writeBytes = function(row, column, dataBuffer) {
    self._validateCoordinates(row, column);
    self.setCursorPosition(row, column);
    for (var i = 0; i < dataBuffer.length; i++) {
      self.writeSingleByte(dataBuffer[i]);
    }
  };

  /**
  * Wwrites a single character to the display at the specified position.
  * @param  {Number} row       The row to position the character in.
  * @param  {Number} column    The column within the row to start the write.
  * @param  {String} char      The character to write.
  * @throws {InvalidOperationException} if the row or column index is invalid for
  * the display.
  * @override
  */
  this.writeChar = function(row, column, char) {
    self._validateCoordinates(row, column);
    self.setCursorPosition(row, column);
    self.writeSingleChar(char);
  };

  /**
  * Writes the specified character buffer to the display at the specified
  * position.
  * @param {Number} row    The row to position the data in.
  * @param {Number} column The column within the row to start the write.
  * @param {Array} charBuffer	The array of characters to write to the display.
  * @throws {InvalidOperationException} if the row or column index is invalid
  * for the display.
  * @override
  */

  this.writeChars = function(row, column, charBuffer) {
    self._validateCoordinates(row, column);
    self.setCursorPosition(row, column);
    for (var i = 0; i < charBuffer.length; i++) {
      self.writeSingleChar(charBuffer[i]);
    }
  };

  /**
  * In a derivative class, writes text to the display in the specified row.
  * @param  {Number} row                 The row to write the text in.
  * @param  {String} str                 The text string to write.
  * @param  {LcdTextAlignment} alignment The text alignment within the row.
  * @throws {InvalidOperationException} if the row index is invalid for the
  * display.
  * @override
  */
  this.writeString = function(row, str, alignment) {
    // Compute the column index.
    var columnIndex = 0;
    if ((alignment !== LcdTextAlignment.Left) &&
    (str.length < self.getColumnCount())) {
      var remaining = (self.getColumnCount() - str.length);
      if (alignment === LcdTextAlignment.Right) {
        columnIndex = remaining;
      }
      else if (alignment === LcdTextAlignment.Center) {
        columnIndex = (remaining / 2);
      }
    }

    // Validate and set cursor position.
    self._validateCoordinates(row, columnIndex);
    self.setCursorPosition(row, columnIndex);

    // Write out each character of the string.
    var chars = str.split("");
    for (var i = 0; i < chars.length; i++) {
      self.writeSingleChar(chars[i]);
    }
  };

  /**
  * Write the specified string to the display, aligned using the specified
  * alignment, then positions the cursor at the beginning of the next row.
  * @param  {Number} row                 The row to write the text in.
  * @param  {String} str                 The text string to write.
  * @param  {LcdTextAlignment} alignment The text alignment within the row.
  * @throws {InvalidOperationException} if the row index is invalid for the
  * display.
  * @override
  */
  this.writeLineAligned = function(row, str, alignment) {
    self.writeString(row, str, alignment);
    self.setCursorPosition(row + 1, 0);
  };

  /**
  * Write the specified data to the display with the text aligned to the left,
  * then position the cursor at the beginning of the next row.
  * @param  {Number} row The row to write the text in.
  * @param  {String} str The text string to write.
  * @throws {InvalidOperationException} if the row index is invalid for the
  * display.
  * @override
  */
  this.writeLine = function(row, str) {
    self.writeLineAligned(row, str, LcdTextAlignment.Left);
  };

  /**
  * Clear one or more characters starting at the specified row and column. Can
  * also be used to clear an entire row or the entire display. If only the row
  * is specified, then just that row will be cleared. If no parameters are
  * given, then the whole display is cleared.
  * @param  {Number} row    The number of the row (zero-based) to clear the
  * character(s) from.
  * @param  {Number} column The column (zero-based) that is the starting position.
  * @param  {Number} length The number of characters to clear. If zero or not
  * specified, then assumes remainder of row.
  * @override
  */
  this.clear = function(row, column, length) {
    row = row || 0;
    column = column || 0;
    length = length || self.getColumnCount();

    for (var i = row; i < length; i++) {
      sb.append(StringUtils.EMPTY);
    }

    self._validateRowIndex(row);
    for (var j = row; j < self.getRowCount(); j++) {
      self.writeString(j, sb.toString(), LcdTextAlignment.Left);
    }
  };
}

LcdBase.prototype.constructor = Lcd;
inherits(LcdBase, Lcd);
module.exports = LcdBase;
