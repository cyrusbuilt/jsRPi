"use strict";

//
//  Lcd.js
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

const Component = require('../Component.js');

/**
 * An LCD display device abstraction component interface.
 * @interface
 * @extends {Component}
 */
class Lcd extends Component {
  /**
   * Initializes a new instance of the jsrpi.Components.LcdDisplay.Lcd interface.
   */
  constructor() {
    super();
  }

  /**
   * In an implementing class, gets the number of rows supported by the display.
   * @property {Number} rowCount - The number of supported rows.
   * @readonly
   */
  get rowCount() { return 0; }

  /**
   * In an implementing class, gets the columns supported by the display.
   * @property {Number} columnCount - The number of supported columns.
   * @readonly
   */
  get columnCount() { return 0; }

  /**
   * In an implementing class, clear one or more characters starting at the
   * specified row and column. Can also be used to clear an entire row or the
   * entire display. If only the row is specified, then just that row will be
   * cleared. If no parameters are given, then the whole display is cleared.
   * @param  {Number} row    The number of the row (zero-based) to clear the
   * character(s) from.
   * @param  {Number} column The column (zero-based) that is the starting position.
   * @param  {Number} length The number of characters to clear. If zero or not
   * specified, then assumes remainder of row.
   */
  clear(row, column, length) {}

  /**
   * In an implementing class, positions the cursor at the specified column and
   * row. If only the row is given, then the cursor is placed at the beginning of
   * the specified row.
   * @param  {Number} row    The number of the row to position the cursor in.
   * @param  {Number} column The number of the column in the specified row to
   * position the cursor.
   */
  setCursorPosition(row, column) {}

  /**
   * In an implementing class, sends the cursor to the home position which is in
   * the top-level corner of the screen (row 0, column 0).
   */
  sendCursorHome() {}

  /**
   * In an implementing class, writes a single byte of data to the display.
   * @param  {Byte|Number} data The byte to send.
   */
  writeSingleByte(data) {}

  /**
   * In an implementing class, writes a single character to the display.
   * @param  {String} char A single character to write.
   */
  writeSingleChar(char) {}

  /**
   * In an implementing class, write the specified byte to the display at the
   * specified position.
   * @param  {Number} row    The row to position the data in.
   * @param  {Number} column The column within the row to start the write.
   * @param  {Byte|Number} data   The byte to write.
   * @throws {InvalidOperationException} if the row or column index is invalid for
   * the display.
   */
  writeByte(row, column, data) {}

  /**
   * In an implementing class, writes the specified byte buffer to the display at
   * the specified position.
   * @param  {Number} row    The row to position the data in.
   * @param  {Number} column The column within the row to start the write.
   * @param  {Array} dataBuffer The array of bytes to write to the display.
   * @throws {InvalidOperationException} if the row or column index is invalid for
   * the display.
   */
  writeBytes(row, column, dataBuffer) {}

  /**
   * In an implementing class, writes a single character to the display at the
   * specified position.
   * @param  {Number} row       The row to position the character in.
   * @param  {Number} column    The column within the row to start the write.
   * @param  {String} char      The character to write.
   * @throws {InvalidOperationException} if the row or column index is invalid for
   * the display.
   */
  writeChar(row, column, char) {}

  /**
   * In an implementing class, writes the specified character buffer to the display
   * at the specified position.
   * @param {Number} row    The row to position the data in.
   * @param {Number} column The column within the row to start the write.
   * @param {Array} charBuffer	The array of characters to write to the display.
   * @throws {InvalidOperationException} if the row or column index is invalid for
   * the display.
   */
  writeChars(row, column, charBuffer) {}

  /**
   * In a derivative class, writes text to the display in the specified row.
   * @param  {Number} row                 The row to write the text in.
   * @param  {String} str                 The text string to write.
   * @param  {LcdTextAlignment} alignment The text alignment within the row.
   * @throws {InvalidOperationException} if the row index is invalid for the
   * display.
   */
  writeString(row, str, alignment) {}

  /**
   * In a derivative class, write the specified string to the display, aligned
   * using the specified alignment, then positions the cursor at the beginning of
   * the next row.
   * @param  {Number} row                 The row to write the text in.
   * @param  {String} str                 The text string to write.
   * @param  {LcdTextAlignment} alignment The text alignment within the row.
   * @throws {InvalidOperationException} if the row index is invalid for the
   * display.
   */
  writeLineAligned(row, str, alignment) {}

  /**
   * In a derivative class, write the specified data to the display with the text
   * aligned to the left, then position the cursor at the beginning of the next row.
   * @param  {Number} row The row to write the text in.
   * @param  {String} str The text string to write.
   * @throws {InvalidOperationException} if the row index is invalid for the
   * display.
   */
  writeLine(row, str) {}
}

module.exports = Lcd;
