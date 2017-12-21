"use strict";
//
//  Microchip.js
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

/**
 * @fileOverview Provides objects for interfacing with Microchip potentiometers.
 *
 * @module Microchip
 * @namespace jsrpi.Components.Potentiometers.Microchip
 */

module.exports = {
    DeviceControlChannel: require('./DeviceControlChannel.js'),
    DeviceControllerDeviceStatus: require('./DeviceControllerDeviceStatus.js'),
    DeviceControllerTerminalConfiguration: require('./DeviceControllerTerminalConfiguration.js'),
    MCP4431: require('./MCP4431.js'),
    MCP4432: require('./MCP4432.js'),
    MCP4441: require('./MCP4441.js'),
    MCP4442: require('./MCP4442.js'),
    MCP4451: require('./MCP4451.js'),
    MCP4452: require('./MCP4452.js'),
    MCP4461: require('./MCP4461.js'),
    MCP4462: require('./MCP4462.js'),
    MCP4531: require('./MCP4531.js'),
    MCP4532: require('./MCP4532.js'),
    MCP4541: require('./MCP4541.js'),
    MCP4542: require('./MCP4542.js'),
    MCP4551: require('./MCP4551.js'),
    MCP4552: require('./MCP4552.js'),
    MCP4561: require('./MCP4561.js'),
    MCP4562: require('./MCP4562.js'),
    MCP4631: require('./MCP4631.js'),
    MCP4632: require('./MCP4632.js'),
    MCP4641: require('./MCP4641.js'),
    MCP4642: require('./MCP4642.js'),
    MCP4651: require('./MCP4651.js'),
    MCP4652: require('./MCP4652.js'),
    MCP4661: require('./MCP4661.js'),
    MCP4662: require('./MCP4662.js'),
    MCPCommand: require('./MCPCommand.js'),
    MCPTerminalConfiguration: require('./MCPTerminalConfiguration.js'),
    MicrochipPotChannel: require('./MicrochipPotChannel.js'),
    MicrochipPotDeviceController: require('./MicrochipPotDeviceController.js'),
    MicrochipPotDeviceStatus: require('./MicrochipPotDeviceStatus.js'),
    MicrochipPotentiometer: require('./MicrochipPotentiometer.js'),
    MicrochipPotentiometerBase: require('./MicrochipPotentiometerBase.js'),
    MicrochipPotNonVolatileMode: require('./MicrochipPotNonVolatileMode.js'),
    RegisterMemoryAddress: require('./RegisterMemoryAddress.js'),
    StatusBit: require('./StatusBit.js'),
    TerminalControlRegisterBit: require('./TerminalControlRegisterBit.js')
};