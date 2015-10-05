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

var util = require('util');
var inherits = require('util').inherits;
var LcdBase = require('./LcdBase.js');
var LcdModule = require('../../LCD/LcdModule.js');
var ArgumentNullException = require('../../ArgumentNullException.js');
var LcdTransferProvider = require('../../LCD/LcdTransferProvider.js');
var IllegalArgumentException = require('../../IllegalArgumentException.js');

/**
 * An LCD display device abstraction component.
 * @param {LcdTransferProvider} provider The LCD transfer provider.
 * @param {Number} rows     The number of rows in the display.
 * @param {Number} columns  The number of columns.
 * @throws {ArgumentNullException} if the specified provider is null or undefined.
 * @throws {IllegalArgumentException} if the specified provider is not actually
 * of type LcdTransferProvider or derivative.
 * @constructor
 * @extends {LcdBase}
 */
function LcdComponent(provider, rows, columns) {
  LcdBase.call(this);

  var self = this;
  var _module = provider || null;
  columns = columns || 0;
  rows = rows || 0;

  if (util.isNullOrUndefined(_module)) {
    throw new ArgumentNullException("'provider' param cannot be null or undefined.");
  }

  if (!(_module instanceof LcdTransferProvider)) {
    throw new IllegalArgumentException("'provider' param must be of LcdTransferProvider or derivative.");
  }

  _module = new LcdModule(provider);
  _module.begin(columns, rows);

  /**
   * Releases all managed resources used by this instance.
   * @override
   */
  this.dispose = function() {
    if (LcdBase.prototype.isDisposed.call(this)) {
      return;
    }

    if (!util.isNullOrUndefined(_module)) {
      _module.clear();
      _module.provider().dispose();
      _module = undefined;
    }
    LcdBase.prototype.dispose.call(this);
  };

  /**
   * Gets the row count.
   * @return {Number} The number of rows supported by the display.
   * @override
   */
  this.getRowCount = function() {
    return _module.rows();
  };

  /**
   * Gets the column count.
   * @return {Number} The number of columns supported by the display.
   * @override
   */
  this.getColumnCount = function() {
    return _module.columns();
  };

  /**
   * Positions the cursor at the specified column and row. If only the row is
   * given, then the cursor is placed at the beginning of the specified row.
   * @param  {Number} row    The number of the row to position the cursor in.
   * @param  {Number} column The number of the column in the specified row to
   * position the cursor.
   * @override
   */
  this.setCursorPosition = function(row, column) {
    row = row || 0;
    column = column || 0;
    LcdBase.prototype._validateCoordinates.call(this, row, column);
    _module.setCursorPosition(column, row);
  };

  /**
   * Writes a single byte of data to the display.
   * @param  {Byte|Number} data The byte to send.
   * @override
   */
  this.writeSingleByte = function(data) {
    _module.writeByte(data);
  };

  /**
   * Clears the display.
   */
  this.clearDisplay = function() {
    _module.clear();
  };

  /**
   * Sets the cursor in the home position.
   */
  this.setCursorHome = function() {
    _module.returnHome();
  };

  /**
   * Converts the current instance to it's string representation. This method
   * simply returns the component name.
   * @return {String} The component name.
   * @override
   */
  this.toString = function() {
    return LcdBase.prototype.componentName;
  };
}

LcdComponent.prototype.constructor = LcdComponent;
inherits(LcdComponent, LcdBase);

module.exports = LcdComponent;
