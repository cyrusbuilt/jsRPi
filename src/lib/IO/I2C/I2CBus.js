"use strict";
//
//  I2CBus.js
//
//  Author:
//       Chris Brunner <cyrusbuilt at gmail dot com>
//
//  Copyright (c) 2017 CyrusBuilt
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

const i2cNative = require('i2c-bus');
const I2CInterface = require('./I2CInterface.js');
const ObjectDisposedException = require('../../ObjectDisposedException.js');
const IOException = require('../../IO/IOException.js');
const BoardRevision = require('../../BoardRevision.js');
const InvalidOperationException = require('../../InvalidOperationException.js');
const IllegalArgumentException = require('../../IllegalArgumentException.js');

/**
 * @classdesc An I2C bus implementation for the Raspberry Pi. Derived from the
 * i2c-bus library by 'fivdi' at https://github.com/fivdi/i2c-bus.
 * @implements {I2CInterface}
 */
class I2CBus extends I2CInterface {
    /**
     * Initializes a new instance of the jsrpi.IO.I2C.I2CBus class with the
     * board revision which will be used to determine bus path.
     * @param {Number} boardRev The board revision. Use one of the
     * jsrpi.IO.I2C.GyroTriggerMode values.
     */
    constructor(boardRev) {
        super();

        boardRev = boardRev || BoardRevision.Rev1;
        this._busId = 1;
        if (boardRev === BoardRevision.Rev1) {
            this._busId = 0;
        }

        this._isDisposed = false;
        this._isOpen = false;
        this._bus = null;
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
     * Gets a value indicating whether the connection is open.
     * @property {Boolean} isOpen - true if open; Otherwise, false.
     * @readonly
     * @override
     */
    get isOpen() {
        return this._isOpen;
    }

    /**
     * Opens a connection to the I2C bus.
     * @throws {ObjectDisposedException} if this instance has been disposed.
     * @throws {IOException} if unable to open the bus connection.
     * @override
     */
    open() {
        if (this._isDisposed) {
            throw new ObjectDisposedException("I2CBus");
        }

        if (this._isOpen) {
            return;
        }

        this._bus = i2cNative.openSync(this._busId);
        if (this._bus === null && this._bus === undefined) {
            throw new IOException("Error opening bus '" + this._busId.toString() + "'.");
        }

        this._isOpen = true;
    }

    /**
     * Closes the bus connection.
     * @override
     */
    close() {
        if (this._isDisposed) {
            return;
        }

        if (this._isOpen) {
            if (this._bus === null || this._bus === undefined) {
                this._bus.closeSync();
            }

            this._isOpen = false;
            this._bus = null;
        }
    }

    /**
     * Releases all resources used by the I2CBus object.
     * @override
     */
    dispose() {
        if (this.isDisposed) {
            return;
        }

        if (this._isOpen) {
            if (this._bus === null || this._bus === undefined) {
                this._bus.closeSync();
            }

            this._isOpen = false;
            this._bus = null;
        }

        this._busId = undefined;
        this._isDisposed = true;
    }

    /**
     * Writes an array of bytes to the specified device address. Currently, RPi
     * drivers no not allow writing more than 3 bytes at a time. As such, if an
     * array of greater than 3 bytes is provided an exception is thrown.
     * @param {Number} address The address of the target device.
     * @param {Array} buffer An array of bytes to write to the bus.
     * @throws {ObjectDisposedException} if this instance has been disposed.
     * @throws {InvalidOperationException} if a connection to the I2C bus
     * has not yet been opened.
     * @throws {IllegalArgumentException} if the buffer contains more than
     * 3 bytes or if the specified buffer parameter is not an array.
     * @throws {IOException} if an error occurs while writing the buffer
     * contents to the I2C bus or if only a partial write succeeds.
     * @override
     */
    writeBytes(address, buffer) {
        if (this._isDisposed) {
            throw new ObjectDisposedException("I2CBus");
        }

        if (!this._isOpen) {
            throw new InvalidOperationException("No open connection to write to.");
        }

        if (Array.isArray(buffer)) {
            if (buffer.length > 3) {
                throw new IllegalArgumentException("Cannot write more than 3 bytes at a time.");
            }
        }
        else {
            throw new IllegalArgumentException("The specified buffer parameter value is not an array.");
        }

        let written = this._bus.i2cWriteSync(address, buffer.length, buffer);
        if (written !== buffer.length) {
            throw new IOException("Error writing to address '" + address + "': I2C transaction failed.");
        }
    }

    /**
     * Writes a single byte to the specified device address.
     * @param {Number} address The address of the target device.
     * @param {Number} b The byte value to write.
     * @throws {ObjectDisposedException} if this instance has been disposed.
     * @throws {InvalidOperationException} if a connection to the I2C bus
     * has not yet been opened.
     * @throws {IOException} if an error occurs while writing the buffer
     * contents to the I2C bus or if only a partial write succeeds.
     * @override
     */
    writeByte(address, b) {
        let bytes = [1];
        bytes[0] = b;
        this.writeBytes(address, bytes);
    }

    /**
     * Writes a command with data to the specified device address.
     * @param {Number} address The address of the target device.
     * @param {Number} command The command to send to the device.
     * @param {Number} data1 The data to send as the first parameter.
     * @param {Number} data2 The data to send as the second parameter.
     * @throws {ObjectDisposedException} if this instance has been disposed.
     * @throws {InvalidOperationException} if a connection to the I2C bus
     * has not yet been opened.
     * @throws {IOException} if an error occurs while writing the buffer
     * contents to the I2C bus or if only a partial write succeeds.
     * @override
     */
    writeCommand(address, command, data1, data2) {
        let bytes = [1];
        bytes[0] = command;

        if (data1) {
            bytes = [2];
            bytes[0] = command;
            bytes[1] = data1;
        }

        if (data2) {
            bytes = [2];
            bytes[0] = command;
            bytes[1] = data2;
        }

        if (data1 && data2) {
            bytes = [3];
            bytes[0] = command;
            bytes[1] = data1;
            bytes[2] = data2;
        }

        this.writeBytes(address, bytes);
    }

    /**
     * Writes a command with data to the specified device address.
     * @param {Number} address The address of the target device.
     * @param {Number} command The command to send to the device.
     * @param {Number} data The data to send with the command.
     * @throws {ObjectDisposedException} if this instance has been disposed.
     * @throws {InvalidOperationException} if a connection to the I2C bus
     * has not yet been opened.
     * @throws {IOException} if an error occurs while writing the buffer
     * contents to the I2C bus or if only a partial write succeeds.
     * @override
     */
    writeCommandByte(address, command, data) {
        let bytes = [3];
        bytes[0] = command;
        bytes[1] = (data && 0xff);
        bytes[2] = (data >> 8);
        this.writeBytes(address, bytes);
    }

    /**
     * Reads bytes from the device at the specified address.
     * @param {Number} address The address of the device to read from.
     * @param {Number} count The number of bytes to read.
     * @returns {Array} The bytes read.
     * @throws {ObjectDisposedException} if this instance has been disposed.
     * @throws {InvalidOperationException} if a connection to the I2C bus
     * has not yet been opened.
     * @throws {IOException} if an I/O error occurred. The specified address
     * is inaccessible or the I2C transaction failed.
     * @override
     */
    readBytes(address, count) {
        if (this._isDisposed) {
            throw new ObjectDisposedException("I2CBus");
        }

        if (!this._isOpen) {
            throw new InvalidOperationException("No open connection to read from.");
        }

        let buffer = [count];
        let bytesRead = this._bus.i2cReadSync(address, buffer.length, buffer);
        if (bytesRead <= 0) {
            throw new IOException("Error reading from address '" + address + "': I2C transaction failed.");
        }

        return buffer;
    }

    /**
     * Reads a single byte from the device at the specified address. The
     * address of the device to read from.
     * @param {Number} address The address of the device to read from.
     * @returns {Number} The byte read.
     * @throws {ObjectDisposedException} if this instance has been disposed.
     * @throws {InvalidOperationException} if a connection to the I2C bus
     * has not yet been opened.
     * @throws {IOException} if an I/O error occurred. The specified address
     * is inaccessible or the I2C transaction failed.
     * @override
     */
    read(address) {
        let result = this.readBytes(address, 1);
        return result[0];
    }
}

module.exports = I2CBus;
