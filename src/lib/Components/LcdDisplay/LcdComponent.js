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

const util = require('util');
const LcdBase = require('./LcdBase.js');
const LcdModule = require('../../LCD/LcdModule.js');
const ArgumentNullException = require('../../ArgumentNullException.js');
const LcdTransferProvider = require('../../LCD/LcdTransferProvider.js');
const IllegalArgumentException = require('../../IllegalArgumentException.js');

/**
* @classdesc An LCD display device abstraction component.
* @extends {LcdBase}
*/
class LcdComponent extends LcdBase {
  /**
   * Initializes a new instance of the jsrpi.Components.LcdDisplay.LcdComponent
   * class with the transfer provider and number of rows and columns,
   * @param {LcdTransferProvider} provider The LCD transfer provider.
   * @param {Number} rows     The number of rows in the display.
   * @param {Number} columns  The number of columns.
   * @throws {ArgumentNullException} if the specified provider is null or undefined.
   * @throws {IllegalArgumentException} if the specified provider is not actually
   * of type LcdTransferProvider or derivative.
   * @constructor
   */
  constructor(provider, rows, columns) {
    super();

    this._module = provider || null;
    columns = columns || 0;
    rows = rows || 0;

    if (util.isNullOrUndefined(this._module)) {
      throw new ArgumentNullException("'provider' param cannot be null or undefined.");
    }

    if (!(this._module instanceof LcdTransferProvider)) {
      throw new IllegalArgumentException("'provider' param must be of LcdTransferProvider or derivative.");
    }

    this._module = new LcdModule(provider);
    this._module.begin(columns, rows);
  }

  /**
  * Releases all managed resources used by this instance.
  * @override
  */
  dispose() {
    if (this.isDisposed) {
      return;
    }

    if (!util.isNullOrUndefined(this._module)) {
      this._module.clear();
      this._module.provider.dispose();
      this._module = undefined;
    }

    super.dispose();
  }

  /**
  * Gets the number of rows supported by the display.
  * @property {Number} rowCount - The number of supported rows.
  * @readonly
  * @override
  */
  get rowCount() {
    return this._module.rows;
  }

  /**
  * Gets the number of columns supported by the display.
  * @property {Number} columnCount - The number of supported columns.
  * @readonly
  * @override
  */
  get columnCount() {
    return this._module.columns;
  }

  /**
  * Positions the cursor at the specified column and row. If only the row is
  * given, then the cursor is placed at the beginning of the specified row.
  * @param  {Number} row    The number of the row to position the cursor in.
  * @param  {Number} column The number of the column in the specified row to
  * position the cursor.
  * @override
  */
  setCursorPosition(row, column) {
    row = row || 0;
    column = column || 0;
    this._validateCoordinates(row, column);
    this._module.setCursorPosition(column, row);
  }

  /**
  * Writes a single byte of data to the display.
  * @param  {Byte|Number} data The byte to send.
  * @override
  */
  writeSingleByte(data) {
    this._module.writeByte(data);
  }

  /**
  * Clears the display.
  */
  clearDisplay() {
    this._module.clear();
  }

  /**
  * Sets the cursor in the home position.
  */
  setCursorHome() {
    this._module.returnHome();
  }

  /**
  * Converts the current instance to it's string representation. This method
  * simply returns the component name.
  * @return {String} The component name.
  * @override
  */
  toString() {
    return this.componentName;
  }
}

module.exports = LcdComponent;
