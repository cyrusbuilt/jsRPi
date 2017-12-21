"use strict";
//
//  MicrochipPotDeviceController.js
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

const ArgumentNullException = require('../../../ArgumentNullException.js');
const DeviceControlChannel = require('./DeviceControlChannel.js');
const DeviceControllerDeviceStatus = require('./DeviceControllerDeviceStatus.js');
const DeviceControllerTerminalConfiguration = require('./DeviceControllerTerminalConfiguration.js');
const Disposable = require('../../../Disposable.js');
const I2CInterface = require('../../../IO/I2C/I2CInterface.js');
const IllegalArgumentException = require('../../../IllegalArgumentException.js');
const IOException = require('../../../IO/IOException.js');
const MCPCommand = require('./MCPCommand.js');
const ObjectDisposedException = require('../../../ObjectDisposedException.js');
const StatusBit = require('./StatusBit.js');

const VOL_WIPER = true;
const NON_VOL_WIPER = false;
const MEMADDR_STATUS = 0x05;
const MEMADDR_WRITEPROTECTION = 0x0F;

/**
 * @classdesc An MCP45XX and MCP46XX device controller component. This mostly a port of the
 * <a href="https://github.com/Pi4J/pi4j/blob/master/pi4j-device/src/main/java/com/pi4j/component/potentiometer/microchip">
 * device controller in the Pi4J project
 * </a> (Java port author <a href="http://raspelikan.blogspot.co.at">Raspelikan</a>)
 * which is a port of similar C++ code from <a href="http://blog.stibrany.com/?p=9">Stibro's code blog</a>.
 * @extends {Disposable}
 */
class MicrochipPotDeviceController extends Disposable {
    /**
     * Initializes a new instance of the jsrpi.Components.Potentiometers.Microchip.MicrochipPotDeviceController
     * class with the I2C bus device this instance is connected to and the bus
     * address of that device.
     * @param {I2CInterface} device The I2C bus device this instance is connected to.
     * @param {Number} busAddress The bus address of the device.
     * @throws {ArgumentNullException} if param 'device' is null.
     * @throws {IllegalArgumentException} if param 'device' is not of type I2CInterface.
     * @constructor
     */
    constructor(device, busAddress = -1) {
        super();

        if (!device) {
            throw new ArgumentNullException("device");
        }

        if (!(device instanceof I2CInterface)) {
            throw new IllegalArgumentException("device param must be of type I2CInterface.");
        }

        this._busAddress = busAddress || -1;
        this._isDisposed = false;
        this._device = device;
        if (!this._device.isOpen) {
            this._device.open();
        }
    }

    /**
     * Determines whether or not the current instance has been disposed.
     * @property {Boolean} isDisposed - true if disposed; Otherwise, false.
     * @readonly
     * @override
     */
    get isDisposed() { return this._isDisposed; }

    /**
     * Reads two bytes from the device at the given memory address.
     * @param {Number} memAddr The memory address to read from
     * @returns {Number} the two bytes read.
     * @throws {IOException} if communication failed - or - device returned a
     * malformed result.
     * @private
     */
    _read(memAddr) {
        // Command to ask device for reading data.
        let cmd = ((memAddr << 4) | MCPCommand.READ);
        this._device.writeByte(this._busAddress, cmd);

        // Read 2 bytes.
        let buf = this._device.readBytes(this._busAddress, 2);
        if (buf.length !== 2) {
            throw new IOException("Malformed response. Expected to read two bytes but got: " + buf.length.toString());
        }

        // Transform signed byte to unsigned byte stored as int.
        let first = buf[0] & 0xFF;
        let second = buf[1] & 0xFF;

        // Interpret both bytes as one integer.
        return (first << 8) | second;
    }

    /**
     * Gets the device status.
     * @property {DeviceControllerDeviceStatus} deviceStatus - The device status.
     * @throws {IOException} if status bits 4 to 8 are not set to 1.
     * @readonly
     */
    get deviceStatus() {
        // Get status from device.
        let stat = this._read(MEMADDR_STATUS);

        // Check formal criterias.
        let reservedVal = stat & StatusBit.RESERVED_MASK;
        if (reservedVal !== StatusBit.RESERVED_VALUE) {
            throw new IOException("Status bits 4 to 8 must be 1 according to documentation chapter 4.2.2.1. Got: " + reservedVal.toString());
        }

        // Build the result.
        let eepromWriteActive = ((stat & StatusBit.EEPROM_WRITEACTIVE) > 0);
        let eepromWriteProt = ((stat & StatusBit.EEPROM_WRITEPROTECTION) > 0);
        let wiperLock0 = ((stat & StatusBit.WIPER_LOCK0) > 0);
        let wiperLock1 = ((stat & StatusBit.WIPER_LOCK1) > 0);

        return new DeviceControllerDeviceStatus(eepromWriteActive, eepromWriteProt, wiperLock0, wiperLock1);
    }

    /**
     * Releases all resources used by the MicrochipPotDeviceController object.
     * @override
     */
    dispose() {
        if (this._isDisposed) {
            return;
        }

        if (!this._device) {
            this._device.dispose();
            this._device = undefined;
        }

        this._isDisposed = true;
    }

    /**
     * Writes 9 bits of the given value to the device.
     * @param {Number} memAddr The memory address to write to.
     * @param {Number} val The value to be written.
     * @throws {IOException} if an I/O error occurred. The specified address is
     * inaccessible or the I2C transaction failed.
     * @private
     */
    _write(memAddr, val) {
        // Bit 8 of value.
        let firstBit = ((val >> 0) & 0x000001);

        // Command to ask device for setting a value.
        let cmd = ((memAddr << 4) | MCPCommand.WRITE | firstBit);

        // Now the 7 bits of actual value.
        let data = (val & 0x00FF);

        // Write the sequence of command and data.
        let pkt = [cmd, data];
        this._device.writeBytes(this._busAddress, pkt);
    }

    /**
     * Writes 'n' (steps) bytes to the device holding the wiper's address
     * and the increment or decrement command and value.
     * @param {Number} memAddr The memory address to write to.
     * @param {Boolean} increase Set true to increment the wiper, or false to
     * decrement.
     * @param {Number} steps The number of steps the wiper has to be
     * incremented/decremented.
     * @throws {IOException} if an I/O error occurred. The specified address is
     * inaccessible or the I2C transaction failed.
     * @private
     */
    _increaseOrDecrease(memAddr, increase = false, steps = 0) {
        // 0 steps means 'do nothing'.
        if (steps === 0) {
            return;
        }

        // Negative steps means decrease on 'increase' or increase on 'decrease';
        let actualSteps = steps;
        let actualIncrease = increase;
        if (steps < 0) {
            actualIncrease = !increase;
            actualSteps = Math.abs(steps);
        }

        // Ask device for increase or decrease.
        let cmd = ((memAddr << 4) | (actualIncrease ? MCPCommand.INCREASE : MCPCommand.DECREASE));

        // Build sequence of commands (one for each step).
        let sequence = [actualSteps];
        for (let i = 0; i < sequence.length; i++) {
            sequence[i] = cmd;
        }

        // Write sequence to the device.
        this._device.writeBytes(this._busAddress, sequence);
    }

    /**
     * Sets or clears a bit in the specified memory (Integer).
     * @param {Number} mem The memory to modify.
     * @param {Number} mask The mask which defines the bit to be set/cleared.
     * @param {Boolean} val Whether to set the bit (true) or clear the bit (false).
     * @returns {Number} The modified memory.
     * @private
     */
    _setBit(mem, mask, val = false) {
        let result = 0;
        if (val) {
            result = mem | mask;   // Set bit using OR.
        }
        else {
            result = mem & ~mask;  // Clear bit by using AND with inverted mask.
        }

        return result;
    }

    /**
     * Enables or disables the device's write-protection.
     * @param {Boolean} enabled Set true to enable write protection, or false
     * to disable.
     * @throws {ObjectDisposedException} if this instance has been disposed and
     * can no longer be used.
     * @throws {IOException} if an I/O error occurred. The specified address is
     * inaccessible or the I2C transaction failed.
     */
    setWriteProtection(enabled = false) {
        if (this._isDisposed) {
            throw new ObjectDisposedException("jsrpi.Components.Potentiometers.Microchip.MicrochipPotDeviceController");
        }

        let flag = enabled || false;
        this._increaseOrDecrease(MEMADDR_WRITEPROTECTION, flag, 1);
    }

    /**
     * Enables or disables the wiper's lock.
     * @param {Number} channel The channel of the wiper to set the lock for.
     * @param {Boolean} locked Set true to enable the lock, or false to disable.
     * @throws {ObjectDisposedException} if this instance has been disposed and
     * can no longer be used.
     * @throws {ArgumentNullException} if channel is null.
     */
    setWiperLock(channel = null, locked = false) {
        if (this._isDisposed) {
            throw new ObjectDisposedException("jsrpi.Components.Potentiometers.Microchip.MicrochipPotDeviceController");
        }

        if (!channel) {
            throw new ArgumentNullException("channel param cannot be null or undefined.");
        }

        // Increasing or decreasing on non-volatile wipers
        // enables or disables WiperLock.
        let memAddr = channel.nonVolatileMemoryAddress;
        let flag = locked || false;
        this._increaseOrDecrease(memAddr, flag, 1);
    }

    /**
     * Sets the device's terminal configuration.
     * @param {DeviceControllerTerminalConfiguration} config The configuration
     * to set.
     * @throws {ObjectDisposedException} if this instance has been disposed and
     * can no longer be used.
     * @throws {ArgumentNullException} if the 'config' param is null.
     * @throws {IOException} if an I/O error occurred. The specified address is
     * inaccessible or the I2C transaction failed.
     */
    setTerminalConfiguration(config = null) {
        if (this._isDisposed) {
            throw new ObjectDisposedException("jsrpi.Components.Potentiometers.Microchip.MicrochipPotDeviceController");
        }

        if (!config) {
            throw new ArgumentNullException("config param cannot be null or undefined.");
        }

        if (!(config instanceof DeviceControllerTerminalConfiguration)) {
            throw new IllegalArgumentException("config must be of type DeviceControllerTerminalConfiguration.");
        }

        let chan = config.channel;
        if (!chan) {
            throw new ArgumentNullException("A configuration with a null channel is not permitted.");
        }

        // Read current configuration.
        let memAddr = config.channel.terminalControlAddress;
        let tcon = this._read(memAddr);

        // Modify configuration.
        tcon = this._setBit(tcon, chan.hardwareConfigControlBit, config.channelEnabled);
        tcon = this._setBit(tcon, chan.terminalAConnectionControlBit, config.pinAEnabled);
        tcon = this._setBit(tcon, chan.wiperConnectionControlBit, config.pinWEnabled);
        tcon = this._setBit(tcon, chan.terminalBConnectionControlBit, config.pinBEnabled);

        // Write new config to device.
        this._write(memAddr, tcon);
    }

    /**
     * Gets the terminal configuration for the specified channel.
     * @param {DeviceControlChannel} channel The channel to get the
     * terminal configuration for.
     * @returns {DeviceControllerTerminalConfiguration} The terminal configuration.
     * @throws {ObjectDisposedException} if this instance has been disposed and
     * can no longer be used.
     * @throws {ArgumentNullException} if the 'config' param is null.
     * @throws {IOException} if an I/O error occurred. The specified address is
     * inaccessible or the I2C transaction failed.
     */
    getTerminalConfiguration(channel = null) {
        if (this._isDisposed) {
            throw new ObjectDisposedException("jsrpi.Components.Potentiometers.Microchip.MicrochipPotDeviceController");
        }

        if (!channel) {
            throw new ArgumentNullException("channel param cannot be null or undefined.");
        }

        if (!(channel instanceof DeviceControlChannel)) {
            throw new IllegalArgumentException("channel must be of type DeviceControlChannel.");
        }

        // Read the current config.
        let tcon = this._read(channel.terminalControlAddress);

        // Build result;
        let chanEnabled = ((tcon & channel.hardwareConfigControlBit) > 0);
        let pinAEnabled = ((tcon & channel.terminalAConnectionControlBit) > 0);
        let pinWEnabled = ((tcon & channel.wiperConnectionControlBit) > 0);
        let pinBEnabled = ((tcon & channel.terminalBConnectionControlBit) > 0);

        return new DeviceControllerTerminalConfiguration(channel, chanEnabled, pinAEnabled, pinWEnabled, pinBEnabled);
    }

    /**
     * Sets the wiper's value in the device.
     * @param {DeviceControlChannel} channel The device channel the wiper is on.
     * @param {Number} value The wiper's value.
     * @param {Boolean} nonVolatile Set true to write to non-volatile memory,
     * or false to write to volatile memory.
     * @throws {ObjectDisposedException} if this instance has been disposed and
     * can no longer be used.
     * @throws {ArgumentNullException} if the 'config' param is null.
     * @throws {IllegalArgumentException} if 'channel' is not of type
     * DeviceControlChannel - or - if 'value' param is a negative number.
     * @throws {IOException} if an I/O error occurred. The specified address is
     * inaccessible or the I2C transaction failed.
     */
    setValue(channel = null, value = 0, nonVolatile = false) {
        if (this._isDisposed) {
            throw new ObjectDisposedException("jsrpi.Components.Potentiometers.Microchip.MicrochipPotDeviceController");
        }

        if (!channel) {
            throw new ArgumentNullException("channel param cannot be null or undefined.");
        }

        if (!(channel instanceof DeviceControlChannel)) {
            throw new IllegalArgumentException("channel must be of type DeviceControlChannel.");
        }

        if (value < 0) {
            throw new IllegalArgumentException("Only positive integer values are permitted. Got value '" +
                                                value.toString() + "' for writing to channel '" +
                                                channel.name + "'.");
        }

        // Choose proper mem address.
        nonVolatile = nonVolatile || false;
        let memAddr = nonVolatile ? channel.nonVolatileMemoryAddress : channel.volatileMemoryAddress;

        // Write value to device.
        this._write(memAddr, value);
    }

    /**
     * Receives the current wiper's value from the device.
     * @param {DeviceControlChannel} channel The device channel the wiper is on.
     * @param {Boolean} nonVolatile Set true to read from non-volatile memory,
     * false to read from volatile memory.
     * @returns {Number} The wiper's value.
     * @throws {ObjectDisposedException} if this instance has been disposed and
     * can no longer be used.
     * @throws {ArgumentNullException} if the 'config' param is null.
     * @throws {IllegalArgumentException} if 'channel' is not of type
     * DeviceControlChannel.
     * @throws {IOException} if an I/O error occurred. The specified address is
     * inaccessible or the I2C transaction failed.
     */
    getValue(channel = null, nonVolatile = false) {
        if (this._isDisposed) {
            throw new ObjectDisposedException("jsrpi.Components.Potentiometers.Microchip.MicrochipPotDeviceController");
        }

        if (!channel) {
            throw new ArgumentNullException("channel param cannot be null or undefined.");
        }

        if (!(channel instanceof DeviceControlChannel)) {
            throw new IllegalArgumentException("channel must be of type DeviceControlChannel.");
        }

        // Select proper memory address, then read the value at that address.
        nonVolatile = nonVolatile || false;
        let memAddr = nonVolatile ? channel.nonVolatileMemoryAddress : channel.volatileMemoryAddress;
        return this._read(memAddr);
    }

    /**
     * Decrements the volatile wiper for the given number of steps.
     * @param {DeviceControlChannel} channel The device channel the wiper is on.
     * @param {Number} steps The number of steps.
     * @throws {ObjectDisposedException} if this instance has been disposed and
     * can no longer be used.
     * @throws {ArgumentNullException} if the 'config' param is null.
     * @throws {IllegalArgumentException} if 'channel' is not of type
     * DeviceControlChannel.
     * @throws {IOException} if an I/O error occurred. The specified address is
     * inaccessible or the I2C transaction failed.
     */
    decrease(channel = null, steps = 0) {
        if (this._isDisposed) {
            throw new ObjectDisposedException("jsrpi.Components.Potentiometers.Microchip.MicrochipPotDeviceController");
        }

        if (!channel) {
            throw new ArgumentNullException("channel param cannot be null or undefined.");
        }

        if (!(channel instanceof DeviceControlChannel)) {
            throw new IllegalArgumentException("channel must be of type DeviceControlChannel.");
        }

        // Decrease only works on volatile-wiper.
        steps = steps || 0;
        let memAddr = channel.volatileMemoryAddress;
        this._increaseOrDecrease(memAddr, false, steps);
    }

    /**
     * Increments the volatile wiper for the given number of steps.
     * @param {DeviceControlChannel} channel The device channel the wiper is on.
     * @param {Number} steps The number of steps.
     * @throws {ObjectDisposedException} if this instance has been disposed and
     * can no longer be used.
     * @throws {ArgumentNullException} if the 'config' param is null.
     * @throws {IllegalArgumentException} if 'channel' is not of type
     * DeviceControlChannel.
     * @throws {IOException} if an I/O error occurred. The specified address is
     * inaccessible or the I2C transaction failed.
     */
    increase(channel = null, steps = 0) {
        if (this._isDisposed) {
            throw new ObjectDisposedException("jsrpi.Components.Potentiometers.Microchip.MicrochipPotDeviceController");
        }

        if (!channel) {
            throw new ArgumentNullException("channel param cannot be null or undefined.");
        }

        if (!(channel instanceof DeviceControlChannel)) {
            throw new IllegalArgumentException("channel must be of type DeviceControlChannel.");
        }

        // Decrease only works on volatile-wiper.
        let memAddr = channel.volatileMemoryAddress;
        this._increaseOrDecrease(memAddr, true, steps);
    }

    /**
     * Flag to use when indicating a volatile wiper.
     * @returns {boolean} always true.
     * @constructor
     */
    static get VOLATILE_WIPER() { return VOL_WIPER; }

    /**
     * Flag to use when indicating a non-volatile wiper.
     * @returns {boolean} always false.
     * @constructor
     */
    static get NONVOLATILE_WIPER() { return NON_VOL_WIPER; }
}

module.exports = MicrochipPotDeviceController;