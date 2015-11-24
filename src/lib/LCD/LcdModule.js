"use strict";

//
//  LcdModule.js
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
var Disposable = require('../Disposable.js');
var LcdTransferProvider = require('./LcdTransferProvider.js');
var FunctionSetFlags = require('./FunctionSetFlags.js');
var PinState = require('../IO/PinState.js');
var LcdCommands = require('./LcdCommands.js');
var DisplayOnOffControl = require('./DisplayOnOffControl.js');
var DisplayEntryModes = require('./DisplayEntryModes.js');
var conv = require('convert-string');
var CoreUtils = require('../PiSystem/CoreUtils.js');
var IllegalArgumentException = require('../IllegalArgumentException.js');
var InvalidOperationException = require('../InvalidOperationException.js');

/**
 * @classdesc Hitachi HD44780-based LCD module control class, largely derived from:
 * Micro Liquid Crystal Library
 * http://microliquidcrystal.codeplex.com
 * Appache License Version 2.0
 * This classes uses the LcdTransferProvider to provide
 * an interface between the Raspberry Pi and the LCD module via GPIO.
 * @param {LcdTransferProvider} provider The transfer provider to use to send
 * data and commands to the display.
 * @throws {IllegalArgumentException} if the specified provider is null,
 * undefined, or not an instance of LcdTransferProvider.
 * @constructor
 * @implements {Disposable}
 */
function LcdModule(provider) {
  Disposable.call(this);

  // **** Begin main constructor logic ****
  if ((util.isNullOrUndefined(provider)) ||
      (!(provider instanceof LcdTransferProvider))) {
    throw new IllegalArgumentException("'provider' param must be an LcdTransferProvider.");
  }

  var self = this;
  var _rowOffsets = [0x00, 0x40, 0x14, 0x54];
  var _provider = provider;
  var _showCursor = true;
  var _blinkCursor = true;
  var _visible = true;
  var _backlight = true;
  var _numLines = 0;
  var _numColumns = 0;
  var _displayFunction = 0;
  var _sendQueue = [];
  var _ready = false;
  var _isDisposed = false;
  // var _autoScroll = false  // TODO implement this?
  // var _currLine = 0;       // TODO implement this?

  if (_provider.isFourBitMode()) {
    _displayFunction = (FunctionSetFlags.FourBitMode |
                        FunctionSetFlags.OneLine |
                        FunctionSetFlags.FiveByEightDots);
  }
  else {
    _displayFunction = (FunctionSetFlags.EightBitMode |
                        FunctionSetFlags.OneLine |
                        FunctionSetFlags.FiveByEightDots);
  }
  // **** End main constructor logic ****

  /**
   * Determines whether or not the current instance has been disposed.
   * @return {Boolean} true if disposed; Otherwise, false.
   * @override
   */
  this.isDisposed = function() {
    return _isDisposed;
  };

  /**
   * Gets the number of rows.
   * @return {Number} The number of rows.
   */
  this.rows = function() {
    return _numLines;
  };

  /**
   * Gets the number of columns.
   * @return {number} The number of columns.
   */
  this.columns = function() {
    return _numColumns;
  };

  /**
   * Gets the LCD transfer provider.
   * @return {LcdTransferProvider} The LCD transfer provider.
   * @see {GpioLcdTransferProviderStandard}
   */
  this.provider = function() {
    return _provider;
  };

  /**
   * Gets a flag indicating whether or not to show the cursor.
   * @return {Boolean} true if the cursor is shown; Otherwise, false.
   */
  this.getShowCursor = function() {
    return _showCursor;
  };

  /**
   * Sends a command to the display.
   * @param  {Byte|Number} data The data or command to send.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  this.sendCommand = function(data) {
    _provider.send(data, PinState.Low, _backlight);
  };

  /**
   * Updates the display control. This method should be called whenever any of
   * the display properties are changed.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @protected
   */
  this._updateDisplayControl = function() {
    var command = LcdCommands.DisplayControl;
    command |= _visible ? DisplayOnOffControl.DisplayOn : DisplayOnOffControl.DisplayOff;
    command |= _showCursor ? DisplayOnOffControl.CursorOn : DisplayOnOffControl.CursorOff;
    command |= _blinkCursor ? DisplayOnOffControl.BlinkOn : DisplayOnOffControl.BlinkOff;

    // NOTE: Backlight is updated with each command.
    self.sendCommand(command);
  };

  /**
   * Sets a flag indicating whether or not the cursor should be shown.
   * @param  {Boolean} show true to show the cursor; Otherwise, false.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  this.setShowCursor = function(show) {
    if (_showCursor !== show) {
      _showCursor = show;
      self._updateDisplayControl();
    }
  };

  /**
   * Gets a flag indicating whether or not the cursor should blink.
   * @return {Boolean} true if the cursor is blinking; Otherwise, false.
   */
  this.getBlinkCursor = function() {
    return _blinkCursor;
  };

  /**
   * Sets a flag indicating whether or not the cursor should blink.
   * @param  {Boolean} blink Set true if the cursor should blink.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  this.setBlinkCursor = function(blink) {
    if (_blinkCursor !== blink) {
      _blinkCursor = blink;
      self._updateDisplayControl();
    }
  };

  /**
   * Gets a flag indicating whether or not the LCD display is turned on or off.
   * @return {Boolean} true if the display is on; Otherwise, false.
   */
  this.getVisible = function() {
    return _visible;
  };

  /**
   * Sets a flag to turn the display on or off. If true, this will restore the
   * text (and cursor) that was on the display.
   * @param  {Boolean} visible Set true to turn the display on.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  this.setVisible = function(visible) {
    if (_visible !== visible) {
      _visible = visible;
      self._updateDisplayControl();
    }
  };

  /**
   * Gets a flag indicating whether or not the backlight is enabled.
   * @return {Boolean} true if enabled; Otherwise, false.
   */
  this.getBacklightEnabled = function() {
    return _backlight;
  };

  /**
   * Sets a flag indicating whether or not the backligh should be enabled.
   * @param  {Boolean} enabled Set true to enable.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  this.setBacklightEnabled = function(enabled) {
    if (_backlight !== enabled) {
      _backlight = enabled;
      self._updateDisplayControl();
    }
  };

  /**
   * Sends on data byte to the display.
   * @param  {Byte|Number} data The data to send.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  this.writeByte = function(data) {
    _provider.send(data, PinState.High, _backlight);
  };

  /**
   * Creates a custom character (glyph) for use on the LCD. Up to eight
   * characters of 5x8 pixels are supported (numbered 0 - 7). The appearance of
   * each custom character is specified by an array of eight bytes, one for each
   * row. The five least significan bits of each byte determine the pixels in
   * that row. To display a custom character on the screen, call writeByte() and
   * pass its number.
   * @param  {Number} location Which character to create (0 - 7).
   * @param  {Array} charmap   The character's pixel data.
   * @param  {Number} offset   Offset in the charmap where character data is found.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  this.createChar = function(location, charmap, offset) {
    location &= 0x07;  // We only have 8 locations (0 - 7).
    offset = offset || 0;
    self.sendCommand(LcdCommands.SetCgRamAddr | (location << 3));
    for (var i = 0; i < 8; i++) {
      self.writeByte(charmap[offset + i]);
    }
  };

  /**
   * Writes a specified number of bytes to the LCD using data from a buffer.
   * @param  {Array} buffer The byte array containing data to write to the display.
   * @param  {Number} offset The zero-base byte offset in the buffer at which to
   * begin copying bytes.
   * @param  {Number} count  The number of bytes to write.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  this.write = function(buffer, offset, count) {
    var len = (offset + count);
    for (var i = offset; i < len; i++) {
      self.writeByte(buffer[i]);
    }
  };

  /**
   * Writes text to the LCD.
   * @param  {String} str The text to display.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  this.writeString = function(str) {
    var buffer = conv.UTF8.stringToBytes(str);
    self.write(buffer, 0, buffer.length);
  };

  /**
   * Moves the cursor left or right.
   * @param  {Boolean} right Set true to move the cursor right; false to move left.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  this.moveCursor = function(right) {
    self.sendCommand(0x10 | (right ? 0x04 : 0x00));
  };

  /**
   * Scrolls the contents of the display (text and cursor) one
	 * space to the right.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  this.scrollDisplayRight = function() {
    self.sendCommand(0x18 | 0x04);
  };

  /**
   * Scrolls the contents of the display (text and cursor) one
 	 * space to the left.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  this.scrollDisplayLeft = function() {
    self.sendCommand(0x18 | 0x00);
  };

  /**
   * Position the LCD cursor; that is, set the location at which
	 * subsequent text written to the LCD will be displayed.
   * @param  {Number} column The column position.
   * @param  {Number} row    The row position.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  this.setCursorPosition = function(column, row) {
    if (row > _numLines) {
      row = (_numLines - 1);
    }
    var address = (column + _rowOffsets[row]);
    self.sendCommand(LcdCommands.SetDdRamAddr | address);
  };

  /**
   * Positions the cursor in the upper-left of the LCD (home position).
	 * That is, use that location in outputting subsequent text to the
	 * display. To also clear the display, use the clear()
	 * method instead.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  this.returnHome = function() {
    self.sendCommand(LcdCommands.ReturnHome);
    CoreUtils.sleepMicroseconds(2000);  // This command takes some time.
  };

  /**
   * Clears the LCD screen and positions the cursor in the upper-left
	 * corner of the display.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  this.clear = function() {
    self.sendCommand(LcdCommands.ClearDisplay);
    CoreUtils.sleepMicroseconds(2000);  // This command takes some time.
  };

  /**
   * Process commands to be sent from the queue synchronously and sequentially.
   * @param  {Number} timeout The amount of time to wait between executions in
   * milliseconds.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @private
   */
  var processSendQueue = function(timeout) {
    if ((!_ready) || (_sendQueue.length === 0)) {
      return;
    }

    _ready = false;
    timeout = timeout || 0;
    var cmd = _sendQueue.shift();
    if (cmd != null) {
        self.sendCommand(cmd);
    }

    setTimeout(function() {
      _ready = true;
      processSendQueue(timeout);
    }, timeout);
  };

  /**
   * Queues a command to be sent to the display.
   * @param  {Byte|Number} cmd     The command or data to send.
   * @param  {Number} timeout The amount of time in milliseconds to wait
   * before executing the command.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @private
   */
  var enqueueCommand = function(cmd, timeout) {
    _sendQueue.push(cmd);
    processSendQueue(timeout);
  };

  /**
   * Initializes the LCD. Specifies dimensions (width and height)
	 * of the display.
   * @param  {Number} columns     The number of columns that the display has.
   * @param  {Number} lines       The number of rows the display has.
   * @param  {Boolean} leftToRight If set to true left to right, versus right to left.
   * @param  {Boolean} dotSize     If set true and only one line set, then the
   * font size will be set 10px high.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  this.begin = function(columns, lines, leftToRight, dotSize) {
    if (lines > 1) {
      _displayFunction |= FunctionSetFlags.TwoLine;
    }

    leftToRight = leftToRight || true;
    dotSize = dotSize || false;

    // _currLine = 0;
    _numLines = lines;
    _numColumns = columns;

    // For some 1 line displays, you can select 10 pixel high font.
    if ((dotSize) && (lines === 1)) {
      _displayFunction |= FunctionSetFlags.FiveByEightDots;
    }

    // LCD controller needs time to warm-up.
    enqueueCommand(null, 50);

    // rs, rw, and enable should be low by default.
    if (_provider.isFourBitMode()) {
      // This is according to the Hitachi HD44780 datasheet.
      // figure 24, pg 46.

      // We start in 8-bit mode, try to set to 4-bit mode.
      self.sendCommand(0x03);
      enqueueCommand(0x03, 5); // Wait minimum 4.1ms.
      enqueueCommand(0x03, 5);
      enqueueCommand(0x02, 5); // Finally, set to 4-bit interface.
    }
    else {
      // This is according to the Hitachi HD44780 datasheet
			// page 45, figure 23.

			// Send function set command sequence.
			self.sendCommand(LcdCommands.FunctionSet | _displayFunction);
      enqueueCommand(LcdCommands.FunctionSet | _displayFunction, 5);
      enqueueCommand(LcdCommands.FunctionSet | _displayFunction, 5);
    }

    // Finally, set # of lines, font size, etc.
    enqueueCommand(LcdCommands.FunctionSet | _displayFunction, 0);

    // Turn the display on with no cursor or blinking default.
    _visible = true;
    _showCursor = false;
    _blinkCursor = false;
    _backlight = true;
    self._updateDisplayControl();

    // Clear it off.
    self.clear();

    // Set the entry mode.
    var displayMode = (leftToRight ? DisplayEntryModes.EntryLeft : DisplayEntryModes.EntryRight);
    displayMode |= DisplayEntryModes.EntryShiftDecrement;
    self.sendCommand(LcdCommands.EntryModeSet | displayMode);
  };

  /**
   * Releases all managed resources used by this instance.
   * @override
   */
  this.dispose = function() {
    if (_isDisposed) {
      return;
    }

    if (!util.isNullOrUndefined(_provider)) {
      _provider.dispose();
      _provider = undefined;
    }
    _isDisposed = true;
  };
}

LcdModule.prototype.constructor = LcdModule;
inherits(LcdModule, Disposable);

module.exports = LcdModule;
