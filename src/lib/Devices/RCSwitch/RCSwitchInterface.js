"use strict";
//
//  RCSwitchInterface.js
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

var inherits = require('util').inherits;
var Device = require('../Device.js');
var RCProtocol = require('./RCProtocol.js');

/**
 * An RC switch device abstraction interface. These are remote-controlled
 * power outlets that basically just switches a relay or SSR.
 * @interface
 * @extends {Device}
 */
function RCSwitchInterface() {
  Device.call(this);
}

RCSwitchInterface.prototype.constructor = RCSwitchInterface;
inherits(RCSwitchInterface, Device);

/**
 * In a derived class, gets the operating protocol.
 * @return {RCProtocol} The operating protocol.
 */
RCSwitchInterface.prototype.getProtocol = function() { return RCProtocol.P1; };

/**
 * In a derived class, sets the operating protocol.
 * @param  {RCProtocol} protocol The protocol to set. If the value is set to
 * less than or equal to zero, then the default pulse length value for the
 * specified protocol will be set.
 */
RCSwitchInterface.prototype.setProtocol = function(protocol) {};

/**
 * Gets or sets the length of the pulse.
 * @property {Number}
 */
RCSwitchInterface.prototype.pulseLength = 0;

/**
 * Gets or sets the transmit repitions.
 * @property {Number}
 */
RCSwitchInterface.prototype.repeatTransmit = 0;

/**
 * In a derived class, switches a remote switch on (Type A with 10 pole DIP
 * switches).
 * @param  {BitSet} switchGroupAddress Code of the switch group (refers to DIP
 * switches 1 - 5, where "1" = on and "0" = off, if all DIP switches are on it's
 * "11111").
 * @param  {RCSwitchDevNum} device             The switch device number.
 * @throws {ArgumentNullException} if switchGroupAddress param is null or
 * undefined.
 * @throws {IllegalArgumentException} if switchGroupAddress param has more than
 * 5 bits.
 */
RCSwitchInterface.prototype.switchOnA = function(switchGroupAddress, device) {};

/**
 * In a derived class, switches a remote switch off (Type A with 10 pole DIP
 * switches).
 * @param  {BitSet} switchGroupAddress Code of the switch group (refers to DIP
 * switches 1 - 5, where "1" = on and "0" = off, if all DIP switches are on it's
 * "11111").
 * @param  {RCSwitchDevNum} device             The switch device number.
 * @throws {ArgumentNullException} if switchGroupAddress param is null or
 * undefined.
 * @throws {IllegalArgumentException} if switchGroupAddress param has more than
 * 5 bits.
 */
RCSwitchInterface.prototype.switchOffA = function(switchGroupAddress, device) {};

/**
 * In a derived class, switch a remote switch on (Type B with two rotary/sliding
 * switches).
 * @param  {AddressCode} address The address of the switch group.
 * @param  {ChannelCode} channel The channel (switch) itself.
 */
RCSwitchInterface.prototype.switchOnB = function(address, channel) {};

/**
 * In a derived class, switch a remote switch off (Type B with two
 * rotary/sliding switches).
 * @param  {AddressCode} address The address of the switch group.
 * @param  {ChannelCode} channel The channel (switch) itself.
 */
RCSwitchInterface.prototype.switchOffB = function(address, channel) {};

module.exports = RCSwitchInterface;
