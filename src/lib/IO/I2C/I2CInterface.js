"use strict";
//
//  I2CInterface.js
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

const Disposable = require('../../Disposable.js');

/**
 * Implemented by classes that represent an I2C bus.
 *
 * @interface
 * @extends {Disposable}
 */
class I2CInterface extends Disposable {
    /**
     * Initializes a new instance of the jsrpi.IO.I2C.I2CInterface object.
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * In a derived class, gets a value indicating whether the connection is open.
     * @property {Boolean} isOpen - true if open; Otherwise, false.
     * @readonly
     */
    get isOpen() { return false; }

    /**
     * In a derived class, opens a connection to the I2C bus.
     * @throws {ObjectDisposedException} if this instance has been disposed.
     * @throws {IOException} if unable to open the bus connection.
     */
    open() {}

    /**
     * In a derived class, closes the connection.
     */
    close() {}

    /**
     * In a derived class, writes a single byte to the specified device address.
     * @param {Number} address The address of the target device.
     * @param {Number} b The byte value to write.
     * @throws {ObjectDisposedException} if this instance has been disposed.
     * @throws {InvalidOperationException} if a connection to the I2C bus
     * has not yet been opened.
     * @throws {IOException} if an error occurs while writing the buffer
     * contents to the I2C bus or if only a partial write succeeds.
     */
    writeByte(address, b) {}

    /**
     * In a derived class, writes an array of bytes to the specified device
     * address. Currently, RPi drivers no not allow writing more than 3 bytes
     * at a time. As such, if an array of greater than 3 bytes is provided,
     * an exception is thrown.
     * @param {Number} address The address of the target device.
     * @param {Array} buffer An array of bytes to write to the bus.
     * @throws {ObjectDisposedException} if this instance has been disposed.
     * @throws {InvalidOperationException} if a connection to the I2C bus
     * has not yet been opened.
     * @throws {IllegalArgumentException} if the buffer contains more than
     * 3 bytes or if the specified buffer parameter is not an array.
     * @throws {IOException} if an error occurs while writing the buffer
     * contents to the I2C bus or if only a partial write succeeds.
     */
    writeBytes(address, buffer) {}

    /**
     * In a derived class, writes a command with data to the specified device
     * address.
     * @param {Number} address The address of the target device.
     * @param {Number} command The command to send to the device.
     * @param {Number} data1 The data to send as the first parameter. (Optional)
     * @param {Number} data2 The data to send as the second parameter. (Optional)
     * @throws {ObjectDisposedException} if this instance has been disposed.
     * @throws {InvalidOperationException} if a connection to the I2C bus
     * has not yet been opened.
     * @throws {IOException} if an error occurs while writing the buffer
     * contents to the I2C bus or if only a partial write succeeds.
     */
    writeCommand(address, command, data1, data2) {}

    /**
     * In a derived class, writes a command with data to the specified device
     * address.
     * @param {Number} address The address of the target device.
     * @param {Number} command The command to send to the device.
     * @param {Number} data The data to send with the command.
     * @throws {ObjectDisposedException} if this instance has been disposed.
     * @throws {InvalidOperationException} if a connection to the I2C bus
     * has not yet been opened.
     * @throws {IOException} if an error occurs while writing the buffer
     * contents to the I2C bus or if only a partial write succeeds.
     */
    writeCommandByte(address, command, data) {}

    /**
     * In a derived class, reads bytes from the device at the specified address.
     * @param {Number} address The address of the device to read from.
     * @param {Number} count The number of bytes to read.
     * @returns {Array} The bytes read.
     * @throws {ObjectDisposedException} if this instance has been disposed.
     * @throws {InvalidOperationException} if a connection to the I2C bus
     * has not yet been opened.
     * @throws {IOException} if an I/O error occurred. The specified address
     * is inaccessible or the I2C transaction failed.
     */
    readBytes(address, count) {}

    /**
     * In a derived class, reads a single byte from the device at the specified
     * address. The address of the device to read from.
     * @param {Number} address The address of the device to read from.
     * @returns {Number} The byte read.
     * @throws {ObjectDisposedException} if this instance has been disposed.
     * @throws {InvalidOperationException} if a connection to the I2C bus
     * has not yet been opened.
     * @throws {IOException} if an I/O error occurred. The specified address
     * is inaccessible or the I2C transaction failed.
     */
    read(address) {}
}

module.exports = I2CInterface;