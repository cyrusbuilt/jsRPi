"use strict";
//
//  DeviceControlChannel.js
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

const MicrochipPotChannel = require('./MicrochipPotChannel.js');
const RegisterMemoryAddress = require('./RegisterMemoryAddress.js');
const TerminalControlRegisterBit = require('./TerminalControlRegisterBit.js');

/**
 * @classdesc This class represents the wiper. It is used for devices knowing
 * more than one wiper.
 */
class DeviceControlChannel {
    /**
     * Initializes a new instance of the jsrpi.Components.Potentiometers.Microchip.DeviceControlChannel
     * class with the volatile memory address, non-volatile memory address,
     * terminal control address, hardware-config control bit, terminal A
     * connection control bit, terminal B connection control bit, wiper
     * connection control bit, and MCP potentiometer channel.
     * @param {RegisterMemoryAddress|Number} volatileMemAddr The volatile
     * memory address.
     * @param {RegisterMemoryAddress|Number} nonVolatileMemAddr The
     * non-volatile memory address.
     * @param {RegisterMemoryAddress|Number} termConAddr The terminal control
     * address.
     * @param {TerminalControlRegisterBit|Number} hwConfigCtrlBit The hardware
     * config control bit.
     * @param {TerminalControlRegisterBit|Number} termAConnCtrlBit The terminal
     * A connection control bit.
     * @param {TerminalControlRegisterBit|Number} termBConnCtrlBit The terminal
     * B connection control bit.
     * @param {TerminalControlRegisterBit|Number} wiperConnCtrlBit The wiper
     * connection control bit.
     * @param {MicrochipPotChannel|Number} chan The MCP potentiometer channel.
     * @constructor
     */
    constructor(volatileMemAddr, nonVolatileMemAddr, termConAddr, hwConfigCtrlBit,
                termAConnCtrlBit, termBConnCtrlBit, wiperConnCtrlBit, chan) {
        this._volatileMemAddr = volatileMemAddr || RegisterMemoryAddress.None;
        this._nonVolatileMemAddr = nonVolatileMemAddr || RegisterMemoryAddress.None;
        this._termConAddr = termConAddr || RegisterMemoryAddress.None;
        this._hwConfigCtrlBit = hwConfigCtrlBit || TerminalControlRegisterBit.None;
        this._termAConnCtrlBit = termAConnCtrlBit || TerminalControlRegisterBit.None;
        this._termBConnCtrlBit = termBConnCtrlBit || TerminalControlRegisterBit.None;
        this._wiperConnCtrlBit = wiperConnCtrlBit || TerminalControlRegisterBit.None;
        this._chan = chan || MicrochipPotChannel.None;
    }

    /**
     * Gets the volatile memory address.
     * @property {RegisterMemoryAddress|Number} volatileMemoryAddress - The
     * volatile memory address.
     * @readonly
     */
    get volatileMemoryAddress() { return this._volatileMemAddr; }

    /**
     * Gets the non-volatile memory address.
     * @property {RegisterMemoryAddress|Number} nonVolatileMemoryAddress - The
     * non-volatile memory address.
     * @readonly
     */
    get nonVolatileMemoryAddress() { return this._nonVolatileMemAddr; }

    /**
     * Gets the terminal control address.
     * @property {RegisterMemoryAddress|Number} terminalControlAddress - The
     * terminal control address.
     * @readonly
     */
    get terminalControlAddress() { return this._termConAddr; }

    /**
     * Gets the hardware config control bit.
     * @property {TerminalControlRegisterBit|Number} hardwareConfigControlBit - The
     * hardware config control bit.
     * @readonly
     */
    get hardwareConfigControlBit() { return this._hwConfigCtrlBit; }

    /**
     * Gets the terminal A connection control bit.
     * @property {TerminalControlRegisterBit|Number} terminalAConnectionControlBit -
     * The terminal A connection control bit.
     * @readonly
     */
    get terminalAConnectionControlBit() { return this._termAConnCtrlBit; }

    /**
     * Gets the terminal B connection control bit.
     * @property {TerminalControlRegisterBit|Number} terminalBConnectionControlBit -
     * The terminal B connection control bit.
     * @readonly
     */
    get terminalBConnectionControlBit() { return this._termBConnCtrlBit; }

    /**
     * Gets the wiper connection control bit.
     * @property {TerminalControlRegisterBit|Number} wiperConnectionControlBit -
     * The wiper connection control bit.
     * @readonly
     */
    get wiperConnectionControlBit() { return this._wiperConnCtrlBit; }

    /**
     * Gets the channel.
     * @property {MicrochipPotChannel|Number} channel - The channel.
     * @readonly
     */
    get channel() { return this._chan; }

    /**
     * Gets the name.
     * @property {string} name - The name. If no channel was specified, then
     * returns an empty string.
     * @readonly
     */
    get name() {
        if ((!this._chan) || (this._chan === MicrochipPotChannel.None)) {
            return "";
        }

        let name = "";
        for (let key in MicrochipPotChannel) {
            if (MicrochipPotChannel[key] === this._chan) {
                name = key;
                break;
            }
        }

        return name;
    }

    /**
     * Gets device control channel A.
     * @property {DeviceControlChannel} A - Device channel A.
     * @static
     * @readonly
     */
    static get A() {
        return new DeviceControlChannel(RegisterMemoryAddress.WIPER0, RegisterMemoryAddress.WIPER0_NV,
                                        RegisterMemoryAddress.TCON01, TerminalControlRegisterBit.TCON_RH02HW,
                                        TerminalControlRegisterBit.TCON_RH02A, TerminalControlRegisterBit.TCON_RH02B,
                                        TerminalControlRegisterBit.TCON_RH02W, MicrochipPotChannel.A);
    }

    /**
     * Gets device control channel B.
     * @property {DeviceControlChannel} B - Device channel B.
     * @static
     * @readonly
     */
    static get B() {
        return new DeviceControlChannel(RegisterMemoryAddress.WIPER1, RegisterMemoryAddress.WIPER1_NV,
                                        RegisterMemoryAddress.TCON01, TerminalControlRegisterBit.TCON_RH13HW,
                                        TerminalControlRegisterBit.TCON_RH13A, TerminalControlRegisterBit.TCON_RH13B,
                                        TerminalControlRegisterBit.TCON_RH13W, MicrochipPotChannel.B);
    }

    /**
     * Gets device control channel C.
     * @property {DeviceControlChannel} C - Device channel C.
     * @static
     * @readonly
     */
    static get C() {
        return new DeviceControlChannel(RegisterMemoryAddress.WIPER2, RegisterMemoryAddress.WIPER2_NV,
                                        RegisterMemoryAddress.TCON23, TerminalControlRegisterBit.TCON_RH02W,
                                        TerminalControlRegisterBit.TCON_RH02A, TerminalControlRegisterBit.TCON_RH02B,
                                        TerminalControlRegisterBit.TCON_RH02W, MicrochipPotChannel.C);
    }

    /**
     * Gets device control channel D.
     * @property {DeviceControlChannel} D - Device channel D.
     * @static
     * @readonly
     */
    static get D() {
        return new DeviceControlChannel(RegisterMemoryAddress.WIPER3, RegisterMemoryAddress.WIPER3_NV,
                                        RegisterMemoryAddress.TCON23, TerminalControlRegisterBit.TCON_RH13HW,
                                        TerminalControlRegisterBit.TCON_RH13A, TerminalControlRegisterBit.TCON_RH13B,
                                        TerminalControlRegisterBit.TCON_RH13W, MicrochipPotChannel.D);
    }

    /**
     * Gets all device control channels.
     * @property {Array} ALL - An array of DeviceControlChannel objects
     * representing all possible device control channels.
     * @static
     * @readonly
     */
    static get ALL() {
        return [
          DeviceControlChannel.A,
          DeviceControlChannel.B,
          DeviceControlChannel.C,
          DeviceControlChannel.D
        ];
    }

    /**
     * Factory method for creating a device control channel based on the
     * given potentiometer channel.
     * @param {MicrochipPotChannel|Number} channel The MCP potentiometer channel.
     * @returns {DeviceControlChannel|null} A new instance of jsrpi.Components.Potentiometers.Microchip.DeviceControlChannel.
     * If no potentiometer channel was specified or is invalid, then returns null.
     */
    static valueOf(channel) {
        if ((!channel) || (isNaN(channel)) || (channel === MicrochipPotChannel.None)) {
            return null;
        }

        let chanName = "";
        for (let key in MicrochipPotChannel) {
            if (MicrochipPotChannel[key] === channel) {
                chanName = key;
                break;
            }
        }

        let result = null;
        for (let dc in DeviceControlChannel.ALL) {
            if (dc.name === chanName) {
                result = dc;
                break;
            }
        }

        return result;
    }
}

module.exports = DeviceControlChannel;