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

const util = require('util');
const Disposable = require('../Disposable.js');
const LcdTransferProvider = require('./LcdTransferProvider.js');
const FunctionSetFlags = require('./FunctionSetFlags.js');
const PinState = require('../IO/PinState.js');
const LcdCommands = require('./LcdCommands.js');
const DisplayOnOffControl = require('./DisplayOnOffControl.js');
const DisplayEntryModes = require('./DisplayEntryModes.js');
const conv = require('convert-string');
const CoreUtils = require('../PiSystem/CoreUtils.js');
const IllegalArgumentException = require('../IllegalArgumentException.js');
const InvalidOperationException = require('../InvalidOperationException.js');

/**
 * @classdesc Hitachi HD44780-based LCD module control class, largely derived from:
 * Micro Liquid Crystal Library
 * http://microliquidcrystal.codeplex.com
 * Appache License Version 2.0
 * This classes uses the LcdTransferProvider to provide
 * an interface between the Raspberry Pi and the LCD module via GPIO.
 * @implements {Disposable}
 */
class LcdModule extends Disposable {
  /**
   * Initializes a new instance of the jsrpi.LCD.LcdModule class with the
   * transfer provider.
   * @param {LcdTransferProvider} provider The transfer provider to use to send
   * data and commands to the display.
   * @throws {IllegalArgumentException} if the specified provider is null,
   * undefined, or not an instance of LcdTransferProvider.
   * @constructor
   */
  constructor(provider) {
    super();

    if ((util.isNullOrUndefined(provider)) ||
        (!(provider instanceof LcdTransferProvider))) {
      throw new IllegalArgumentException("'provider' param must be an LcdTransferProvider.");
    }

    this._rowOffsets = [0x00, 0x40, 0x14, 0x54];
    this._provider = provider;
    this._showCursor = true;
    this._blinkCursor = true;
    this._visible = true;
    this._backlight = true;
    this._numLines = 0;
    this._numColumns = 0;
    this._displayFunction = 0;
    this._sendQueue = [];
    this._ready = false;
    this._isDisposed = false;
    // var _autoScroll = false  // TODO implement this?
    // var _currLine = 0;       // TODO implement this?

    if (this._provider.isFourBitMode) {
      this._displayFunction = (FunctionSetFlags.FourBitMode |
                                FunctionSetFlags.OneLine |
                                FunctionSetFlags.FiveByEightDots);
    }
    else {
      this._displayFunction = (FunctionSetFlags.EightBitMode |
                                FunctionSetFlags.OneLine |
                                FunctionSetFlags.FiveByEightDots);
    }
  }

  /**
   * Determines whether or not the current instance has been disposed.
   * @property {Boolean} isDisposed - true if disposed; Otherwise, false.
   * @readonly
   * @override
   */
  get isDisposed() {
    return this._isDisposed;
  }

  /**
   * Gets the number of rows.
   * @property {Number} rows - The number of supported rows.
   * @readonly
   */
  get rows() {
    return this._numLines;
  }

  /**
   * Gets the number of columns.
   * @property {number} columns - The number of supported columns.
   * @readonly
   */
  get columns() {
    return this._numColumns;
  }

  /**
   * Gets the LCD transfer provider.
   * @property {LcdTransferProvider} provider - The data transfer provider.
   * @see {GpioLcdTransferProviderStandard}
   * @readonly
   */
  get provider() {
    return this._provider;
  }

  /**
   * Sends a command to the display.
   * @param  {Byte|Number} data The data or command to send.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  sendCommand(data) {
    this._provider.send(data, PinState.Low, this._backlight);
  }

  /**
   * Updates the display control. This method should be called whenever any of
   * the display properties are changed.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @protected
   */
  _updateDisplayControl() {
    let command = LcdCommands.DisplayControl;
    command |= this._visible ? DisplayOnOffControl.DisplayOn : DisplayOnOffControl.DisplayOff;
    command |= this._showCursor ? DisplayOnOffControl.CursorOn : DisplayOnOffControl.CursorOff;
    command |= this._blinkCursor ? DisplayOnOffControl.BlinkOn : DisplayOnOffControl.BlinkOff;

    // NOTE: Backlight is updated with each command.
    this.sendCommand(command);
  }

  /**
   * Gets or sets a flag indicating whether or not to show the cursor.
   * @property {Boolean} showCursor - true if the cursor is shown; Otherwise,
   * false.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @readonly
   */
  get showCursor() {
    return this._showCursor;
  }

  set showCursor(show) {
    if (this._showCursor !== show) {
      this._showCursor = show;
      this._updateDisplayControl();
    }
  }

  /**
   * Gets or sets a flag indicating whether or not the cursor should blink.
   * @property {Boolean} blinkCursor - true if the cursor is blinking;
   * Otherwise, false.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  get blinkCursor() {
    return this._blinkCursor;
  }

  set blinkCursor(blink) {
    if (this._blinkCursor !== blink) {
      this._blinkCursor = blink;
      this._updateDisplayControl();
    }
  }

  /**
   * Gets or sets a flag indicating whether or not the LCD display is turned on
   * or off.
   * @property {Boolean} visible - true if the display is on; Otherwise, false.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  get visible() {
    return this._visible;
  }

  set visible(visible) {
    if (this._visible !== visible) {
      this._visible = visible;
      this._updateDisplayControl();
    }
  }

  /**
   * Gets or sets a flag indicating whether or not the backlight is enabled.
   * @property {Boolean} backlightEnabled - true if enabled; Otherwise, false.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  get backlightEnabled() {
    return this._backlight;
  }

  set backlightEnabled(enabled) {
    if (this._backlight !== enabled) {
      this._backlight = enabled;
      this._updateDisplayControl();
    }
  }

  /**
   * Sends on data byte to the display.
   * @param  {Byte|Number} data The data to send.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  writeByte(data) {
    this._provider.send(data, PinState.High, this._backlight);
  }

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
  createChar(location, charmap, offset) {
    location &= 0x07;  // We only have 8 locations (0 - 7).
    offset = offset || 0;
    this.sendCommand(LcdCommands.SetCgRamAddr | (location << 3));
    for (let i = 0; i < 8; i++) {
      this.writeByte(charmap[offset + i]);
    }
  }

  /**
   * Writes a specified number of bytes to the LCD using data from a buffer.
   * @param  {Array} buffer The byte array containing data to write to the display.
   * @param  {Number} offset The zero-base byte offset in the buffer at which to
   * begin copying bytes.
   * @param  {Number} count  The number of bytes to write.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  write(buffer, offset, count) {
    let len = (offset + count);
    for (let i = offset; i < len; i++) {
      this.writeByte(buffer[i]);
    }
  }

  /**
   * Writes text to the LCD.
   * @param  {String} str The text to display.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  writeString(str) {
    let buffer = conv.UTF8.stringToBytes(str);
    this.write(buffer, 0, buffer.length);
  }

  /**
   * Moves the cursor left or right.
   * @param  {Boolean} right Set true to move the cursor right; false to move left.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  moveCursor(right) {
    this.sendCommand(0x10 | (right ? 0x04 : 0x00));
  }

  /**
   * Scrolls the contents of the display (text and cursor) one
	 * space to the right.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  scrollDisplayRight() {
    this.sendCommand(0x18 | 0x04);
  }

  /**
   * Scrolls the contents of the display (text and cursor) one
 	 * space to the left.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  scrollDisplayLeft() {
    this.sendCommand(0x18 | 0x00);
  }

  /**
   * Position the LCD cursor; that is, set the location at which
	 * subsequent text written to the LCD will be displayed.
   * @param  {Number} column The column position.
   * @param  {Number} row    The row position.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  setCursorPosition(column, row) {
    if (row > this._numLines) {
      row = (this._numLines - 1);
    }

    let address = (column + this._rowOffsets[row]);
    this.sendCommand(LcdCommands.SetDdRamAddr | address);
  }

  /**
   * Positions the cursor in the upper-left of the LCD (home position).
	 * That is, use that location in outputting subsequent text to the
	 * display. To also clear the display, use the clear()
	 * method instead.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  returnHome() {
    this.sendCommand(LcdCommands.ReturnHome);
    CoreUtils.sleepMicroseconds(2000);  // This command takes some time.
  }

  /**
   * Clears the LCD screen and positions the cursor in the upper-left
	 * corner of the display.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   */
  clear() {
    this.sendCommand(LcdCommands.ClearDisplay);
    CoreUtils.sleepMicroseconds(2000);  // This command takes some time.
  }

  /**
   * Process commands to be sent from the queue synchronously and sequentially.
   * @param  {Number} timeout The amount of time to wait between executions in
   * milliseconds.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @private
   */
  _processSendQueue(timeout) {
    if ((!this._ready) || (this._sendQueue.length === 0)) {
      return;
    }

    this._ready = false;
    timeout = timeout || 0;
    let cmd = this._sendQueue.shift();
    if (cmd != null) {
        this.sendCommand(cmd);
    }

    let self = this;
    setTimeout(function() {
      self._ready = true;
      self._processSendQueue(timeout);
    }, timeout);
  }

  /**
   * Queues a command to be sent to the display.
   * @param  {Byte|Number} cmd     The command or data to send.
   * @param  {Number} timeout The amount of time in milliseconds to wait
   * before executing the command.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @private
   */
  _enqueueCommand(cmd, timeout) {
    this._sendQueue.push(cmd);
    this._processSendQueue(timeout);
  }

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
  begin(columns, lines, leftToRight, dotSize) {
    if (lines > 1) {
      this._displayFunction |= FunctionSetFlags.TwoLine;
    }

    leftToRight = leftToRight || true;
    dotSize = dotSize || false;

    // _currLine = 0;
    this._numLines = lines;
    this._numColumns = columns;

    // For some 1 line displays, you can select 10 pixel high font.
    if ((dotSize) && (lines === 1)) {
      this._displayFunction |= FunctionSetFlags.FiveByEightDots;
    }

    // LCD controller needs time to warm-up.
    this._enqueueCommand(null, 50);

    // rs, rw, and enable should be low by default.
    if (this._provider.isFourBitMode) {
      // This is according to the Hitachi HD44780 datasheet.
      // figure 24, pg 46.

      // We start in 8-bit mode, try to set to 4-bit mode.
      this.sendCommand(0x03);
      this._enqueueCommand(0x03, 5); // Wait minimum 4.1ms.
      this._enqueueCommand(0x03, 5);
      this._enqueueCommand(0x02, 5); // Finally, set to 4-bit interface.
    }
    else {
      // This is according to the Hitachi HD44780 datasheet
      // page 45, figure 23.

      // Send function set command sequence.
      this.sendCommand(LcdCommands.FunctionSet | this._displayFunction);
      this._enqueueCommand(LcdCommands.FunctionSet | this._displayFunction, 5);
      this._enqueueCommand(LcdCommands.FunctionSet | this._displayFunction, 5);
    }

    // Finally, set # of lines, font size, etc.
    this._enqueueCommand(LcdCommands.FunctionSet | this._displayFunction, 0);

    // Turn the display on with no cursor or blinking default.
    this._visible = true;
    this._showCursor = false;
    this._blinkCursor = false;
    this._backlight = true;
    this._updateDisplayControl();

    // Clear it off.
    this.clear();

    // Set the entry mode.
    let displayMode = (leftToRight ? DisplayEntryModes.EntryLeft : DisplayEntryModes.EntryRight);
    displayMode |= DisplayEntryModes.EntryShiftDecrement;
    this.sendCommand(LcdCommands.EntryModeSet | displayMode);
  }

  /**
   * Releases all managed resources used by this instance.
   * @override
   */
  dispose() {
    if (this._isDisposed) {
      return;
    }

    if (!util.isNullOrUndefined(this._provider)) {
      this._provider.dispose();
      this._provider = undefined;
    }
    this._isDisposed = true;
  }
}

module.exports = LcdModule;
