"use strict";
//
//  RCSwitch.js
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


/**
 * @fileOverview Contains enums, classes, and interfaces for working with
 * remote-controlled switching devices.
 *
 * @module RCSwtich
 * @namespace jsrpi.Devices.RCSwitch
 */

module.exports = {
  AddressCode : require('./AddressCode.js'),
  ChannelCode : require('./ChannelCode.js'),
  RCProtocol : require('./RCProtocol.js'),
  RCSwitchDevNum : require('./RCSwitchDevNum.js'),
  RCSwitchInterface : require('./RCSwitchInterface.js'),
  RCSwitchDevice : require('./RCSwitchDevice.js')
};
