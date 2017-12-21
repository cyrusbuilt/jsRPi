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

const ComponentBase = require('../ComponentBase.js');
const Lcd = require('./Lcd.js');
const StringUtils = require('../../StringUtils.js');
const InvalidOperationException = require('../../InvalidOperationException.js');
const LcdTextAlignment = require('./LcdTextAlignment.js');
const sb = require('string-builder');

/**
* Base class for LCD display abstractions.
* @implements {Lcd}
* @extends {ComponentBase}
*/
class LcdBase extends Lcd {
  /**
   * Initializes a new instance of the jsrpi.Components.LcdDisplay.LcdBase class.
   * @constructor
   */
  constructor() {
    super();

    this._base = new ComponentBase();
  }

  /**
   * Gets or sets the name of this component.
   * @property {String} componentName - The name of the component.
   * @override
   */
  get componentName() {
    return this._base.componentName;
  }

  set componentName(name) {
    this._base.componentName = name;
  }

  /**
   * Gets or sets the object this component is tagged with.
   * @property {Object} tag - The tag.
   * @override
   */
  get tag() {
    return this._base.tag;
  }

  set tag(t) {
    this._base.tag = t;
  }

  /**
  * Gets the cutsom property collection.
  * @property {Array} propertyCollection - The property collection.
  * @readonly
  * @override
  */
  get propertyCollection() {
    return this._base.propertyCollection;
  }

  /**
  * Checks to see if the property collection contains the specified key.
  * @param  {String} key The key name of the property to check for.
  * @return {Boolean}    true if the property collection contains the key;
  * Otherwise, false.
  * @override
  */
  hasProperty(key) {
    return this._base.hasProperty(key);
  }

  /**
  * Sets the value of the specified property. If the property does not already exist
  * in the property collection, it will be added.
  * @param  {String} key   The property name (key).
  * @param  {String} value The value to assign to the property.
  * @override
  */
  setProperty(key, value) {
    this._base.setProperty(key, value);
  }

  /**
  * Determines whether or not the current instance has been disposed.
  * @property {Boolean} isDisposed - true if disposed; Otherwise, false.
  * @readonly
  * @override
  */
  get isDisposed() {
    return this._base.isDisposed;
  }

  /**
  * Returns the string representation of this object. In this case, it simply
  * returns the component name.
  * @return {String} The name of this component.
  * @override
  */
  toString() {
    return this._base.toString();
  }

  /**
  * Releases all managed resources used by this instance.
  * @override
  */
  dispose() {
    if (this._base.isDisposed) {
      return;
    }

    this._base.dispose();
  }

  /**
  * Validates the index of the specified row.
  * @param  {Number} row The index of the row to validate.
  * @throws {InvalidOperationException} if the row index is invalid for the
  * display.
  * @protected
  */
  _validateRowIndex(row) {
    row = row || 0;
    if ((row >= this.rowCount) || (row < 0)) {
      throw new InvalidOperationException("Invalid row index.");
    }
  }

  /**
  * Validates the index of the column.
  * @param  {Number} column The index of the column to validate.
  * @throws {InvalidOperationException} if the column index is invalid for the
  * display.
  * @protected
  */
  _validateColumnIndex(column) {
    column = column || 0;
    if ((column >= this.columnCount) || (column < 0)) {
      throw new InvalidOperationException("Invalid column index.");
    }
  }

  /**
  * Validates the specified coordinates.
  * @param  {Number} row    The index of the row to validate.
  * @param  {Number} column The index of the column to validate
  * @throws {InvalidOperationException} if the row or column index is invalid
  * for the display.
  * @protected
  */
  _validateCoordinates(row, column) {
    this._validateRowIndex(row);
    this._validateColumnIndex(column);
  }

  /**
  * Sends the cursor to the home position which is in the top-level corner of
  * the screen (row 0, column 0).
  * @override
  */
  sendCursorHome() {
    this.setCursorPosition(0, 0);
  }

  /**
  * Writes a single character to the display.
  * @param  {String} char A single character to write.
  * @override
  */
  writeSingleChar(char) {
    this.writeSingleByte(char.charCodeAt(0));
  }

  /**
  * Write the specified byte to the display at the specified position.
  * @param  {Number} row    The row to position the data in.
  * @param  {Number} column The column within the row to start the write.
  * @param  {Byte|Number} data   The byte to write.
  * @throws {InvalidOperationException} if the row or column index is invalid for
  * the display.
  * @override
  */
  writeByte(row, column, data) {
    this._validateCoordinates(row, column);
    this.setCursorPosition(row, column);
    this.writeSingleByte(data);
  }

  /**
  * Writes the specified byte buffer to the display at the specified position.
  * @param  {Number} row    The row to position the data in.
  * @param  {Number} column The column within the row to start the write.
  * @param  {Array} dataBuffer The array of bytes to write to the display.
  * @throws {InvalidOperationException} if the row or column index is invalid
  * for the display.
  * @override
  */
  writeBytes(row, column, dataBuffer) {
    this._validateCoordinates(row, column);
    this.setCursorPosition(row, column);
    for (let i = 0; i < dataBuffer.length; i++) {
      this.writeSingleByte(dataBuffer[i]);
    }
  }

  /**
  * Wwrites a single character to the display at the specified position.
  * @param  {Number} row       The row to position the character in.
  * @param  {Number} column    The column within the row to start the write.
  * @param  {String} char      The character to write.
  * @throws {InvalidOperationException} if the row or column index is invalid for
  * the display.
  * @override
  */
  writeChar(row, column, char) {
    this._validateCoordinates(row, column);
    this.setCursorPosition(row, column);
    this.writeSingleChar(char);
  }

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

  writeChars(row, column, charBuffer) {
    this._validateCoordinates(row, column);
    this.setCursorPosition(row, column);
    for (let i = 0; i < charBuffer.length; i++) {
      this.writeSingleChar(charBuffer[i]);
    }
  }

  /**
  * In a derivative class, writes text to the display in the specified row.
  * @param  {Number} row                 The row to write the text in.
  * @param  {String} str                 The text string to write.
  * @param  {LcdTextAlignment} alignment The text alignment within the row.
  * @throws {InvalidOperationException} if the row index is invalid for the
  * display.
  * @override
  */
  writeString(row, str, alignment) {
    // Compute the column index.
    let columnIndex = 0;
    if ((alignment !== LcdTextAlignment.Left) &&
    (str.length < this.columnCount)) {
      let remaining = (this.columnCount - str.length);
      if (alignment === LcdTextAlignment.Right) {
        columnIndex = remaining;
      }
      else if (alignment === LcdTextAlignment.Center) {
        columnIndex = (remaining / 2);
      }
    }

    // Validate and set cursor position.
    this._validateCoordinates(row, columnIndex);
    this.setCursorPosition(row, columnIndex);

    // Write out each character of the string.
    let chars = str.split("");
    for (let i = 0; i < chars.length; i++) {
      this.writeSingleChar(chars[i]);
    }
  }

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
  writeLineAligned(row, str, alignment) {
    this.writeString(row, str, alignment);
    this.setCursorPosition(row + 1, 0);
  }

  /**
  * Write the specified data to the display with the text aligned to the left,
  * then position the cursor at the beginning of the next row.
  * @param  {Number} row The row to write the text in.
  * @param  {String} str The text string to write.
  * @throws {InvalidOperationException} if the row index is invalid for the
  * display.
  * @override
  */
  writeLine(row, str) {
    this.writeLineAligned(row, str, LcdTextAlignment.Left);
  }

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
  clear(row, column, length) {
    row = row || 0;
    column = column || 0;
    length = length || this.columnCount;

    for (let i = row; i < length; i++) {
      sb.append(StringUtils.EMPTY);
    }

    this._validateRowIndex(row);
    for (let j = row; j < this.rowCount; j++) {
      this.writeString(j, sb.toString(), LcdTextAlignment.Left);
    }
  }
}

module.exports = LcdBase;
