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

var util = require('util');
var inherits = require('util').inherits;
var extend = require('extend');
var DeviceBase = require('../DeviceBase.js');
var RCSwitchInterface = require('./RCSwitchInterface.js');
var RCProtocol = require('./RCProtocol.js');
var RCSwitchDevNum = require('./RCSwitchDevNum.js');
var CoreUtils = require('../../PiSystem/CoreUtils.js');
var BitSet = require('../../BitSet.js');
var PinMode = require('../../IO/PinMode.js');
var PinState = require('../../IO/PinState.js');
var ArgumentNullException = require('../../ArgumentNullException.js');
var IllegalArgumentException = require('../../IllegalArgumentException.js');

var DEF_PROT1_PULSE_LEN = 350;
var DEF_PROT2_PULSE_LEN = 650;
var PROTOCOL1_SYNC_LOW_PULSES = 31;
var PROTOCOL2_SYNC_LOW_PULSES = 10;

/**
 * Converts a decimal value into its binary representation.
 * @param  {Number} dec       The decimal value to convert.
 * @param  {Number} bitLength The length in bits to fill with zeros.
 * @return {Array}           The binary representation of the specified decimal.
 * @private
 */
var dec2BinWzeroFill = function(dec, bitLength) {
  var bin = new Array(64);
  var i = 0;

  while (dec > 0) {
    bin[32 + i++] = ((dec & 1) > 0) ? '1' : '0';
    dec = dec >> 1;
  }

  for (var j = 0; j < bitLength; j++) {
    if (j >= bitLength - i) {
      bin[j] = bin[31 + i - (j - (bitLength - i))];
    }
    else {
      bin[j] = '\0';
    }
  }

  bin[bitLength] = '\0';
  return bin;
};

/**
 * Convenience method for converting a string like "11011" to a BitSet.
 * @param  {String} addressString The a string containing the address bits in
 * sequence.
 * @return {BitSet}               A bitset containing the address that can b
 * used for swithing devices on or off.
 * @throws {ArgumentNullException} if addressString is null or undefined;
 * @throws {IllegalArgumentException} if addressString does not contain exactly
 * 5 bits (characters).
 */
var getSwitchGroupAddress = function(addressString) {
  if (util.isNullOrUndefined(addressString)) {
    throw new ArgumentNullException("'addressString' param cannot be null or undefined.");
  }

  if (addressString.length !== 5) {
    throw new IllegalArgumentException("address must consist of exactly 5 bits!");
  }

  var bits = new BitSet(5);
  for (var i = 0; i < 5; i++) {
    bits.set(i, addressString[i] === '1');
  }
  return bits;
};

/**
 * @classdesc A device abstraction for an RC (remote control) switched power
 * outlets.
 * @param {RaspiGpio} transmitPin The native pin to use to transmit codes.
 * @throws {ArgumentNullException} if transmitPin is null or undefined.
 * @throws {IllegalArgumentException} if transmitPin is not configured as an
 * output.
 * @constructor
 * @implements {RCSwitchInterface}
 * @extends {DeviceBase}
 */
function RCSwitchDevice(transmitPin) {
  RCSwitchInterface.call(this);
  DeviceBase.call(this);

  if (util.isNullOrUndefined(transmitPin)) {
    throw new ArgumentNullException("'transmitPin' param cannot be null or undefined.");
  }

  if (transmitPin.mode() !== PinMode.OUT) {
    throw new IllegalArgumentException("The specified pin is not an output.");
  }

  var self = this;
  var _txPin = transmitPin;
  _txPin.write(PinState.Low);
  var _protocol = RCProtocol.P1;
  this.pulseLength = DEF_PROT1_PULSE_LEN;
  this.repeatTransmit = 0;

  /**
   * Releases all managed resources used by this instance.
   * @override
   */
  this.dispose = function() {
    if (DeviceBase.prototype.isDisposed.call(this)) {
      return;
    }

    if (!util.isNullOrUndefined(_txPin)) {
      _txPin.dispose();
      _txPin = undefined;
    }

    DeviceBase.prototype.dispose.call(this);
  };

  /**
   * Gets the operating protocol.
   * @return {RCProtocol} The operating protocol.
   * @override
   */
  this.getProtocol = function() {
    return _protocol;
  };

  /**
   * Sets the operating protocol.
   * @param  {RCProtocol} protocol The protocol to set. If the value is set to
   * less than or equal to zero, then the default pulse length value for the
   * specified protocol will be set.
   * @override
   */
  this.setProtocol = function(protocol) {
    _protocol = protocol;
    if (self.pulseLength <= 0) {
      switch (_protocol) {
        case RCProtocol.P1:
          self.pulseLength = DEF_PROT1_PULSE_LEN;
          break;
        case RCProtocol.P2:
          self.pulseLength = DEF_PROT2_PULSE_LEN;
          break;
        default:
          break;
      }
    }
  };

  /**
   * Trasmits the specified number of high and low pulses.
   * @param  {Number} highPulses The number of high pulses.
   * @param  {Number} lowPulses  The number of low pulses.
   * @private
   */
  var transmit = function(highPulses, lowPulses) {
    if (!util.isNullOrUndefined(_txPin)) {
      _txPin.write(PinState.High);
      CoreUtils.sleepMicroseconds(self.pulseLength * highPulses);
      _txPin.write(PinState.Low);
      CoreUtils.sleepMicroseconds(self.pulseLength * lowPulses);
    }
  };

  /**
   * Sends a "Sync" bit.
	 *                       _
	 * Waveform Protocol 1: | |_______________________________
	 *                       _
	 * Waveform Protocol 2: | |__________
	 * @private
   */
  var sendSync = function() {
    switch (_protocol) {
      case RCProtocol.P1:
        transmit(1, PROTOCOL1_SYNC_LOW_PULSES);
        break;
      case RCProtocol.P2:
        transmit(1, PROTOCOL2_SYNC_LOW_PULSES);
        break;
      default:
        break;
    }
  };

  /**
   * Sends a tri-state "0" bit.
	 *            _     _
	 * Waveform: | |___| |___
   * @private
   */
  var sendT0 = function() {
    transmit(1, 3);
    transmit(1, 3);
  };

  /**
   * Sends a tri-state "1" bit.<br/><br/>
	 *            ___   ___
	 * Waveform: |   |_|   |_
   * @private
   */
  var sendT1 = function() {
    transmit(3, 1);
    transmit(3, 1);
  };

  /**
   * Sends a tri-state "F" bit.
	 *            _     ___
	 * Waveform: | |___|   |_
   * @private
   */
  var sendTF = function() {
    transmit(1, 3);
    transmit(3, 1);
  };

  /**
   * Sends a "0" bit.
	 *                       _
	 * Waveform Protocol 1: | |___
	 *                       _
	 * Waveform Protocol 2: | |__
   * @private
   */
  var send0 = function() {
    switch (_protocol) {
      case RCProtocol.P1:
        transmit(1, 3);
        break;
      case RCProtocol.P2:
        transmit(1, 2);
        break;
      default:
        break;
    }
  };

  /**
   * Sends a "1" bit.<br/><br/>
	 *                       ___
	 * Waveform Protocol 1: |   |_
	 *                       __
	 * Waveform Protocol 2: |  |_
   * @private
   */
  var send1 = function() {
    switch (_protocol) {
      case RCProtocol.P1:
        transmit(3, 1);
        break;
      case RCProtocol.P2:
        transmit(2, 1);
        break;
      default:
        break;
    }
  };

  /**
   * Returns a 13 character array, representing the code word to be sent.
	 * A code word consists of 9 address bits, 3 data bits, and on sync bit
	 * but in our case, only the first 8 address bits and the last 2 data
	 * bits are used. A code bit can have 4 different states: "F" (floating),
	 * "1" (high), "0" (low), and "S" (synchronous bit).
	 * +-------------------------------+--------------------------------+-----------------------------------------+-----------------------------------------+----------------------+------------+
	 * | 4 bits address (switch group) | 4 bits address (switch number) | 1 bit address (not used, so never mind) | 1 bit address (not used, so never mind) | 2 data bits (on|off) | 1 sync bit |
	 * | 1=0FFF 2=F0FF 3=FF0F 4=FFF0   | 1=0FFF 2=F0FF 3=FF0F 4=FFF0    | F | F | on=FF off=F0 | S |
	 * +-------------------------------+--------------------------------+-----------------------------------------+-----------------------------------------+----------------------+------------+
   * @param  {BitSet} groupAddress A bitset containing 5 bits that represent the
   * switch group address.
   * @param  {ChannelCode} chan     The channel (switch) to manipulate.
   * @param  {Boolean} status       Whether to switch on (true) or off (false).
   * @return {String}               If successful, a 13 character array
   * containing the code word; Otherwise, a single-character array containing
   * only a null-character.
   */
  var getCodeWordA = function(groupAddress, chan, status) {
    status = status || false;
    var returnPos = 0;
    var word = new Array(13);
    var code = ["FFFFF", "0FFFF", "F0FFF", "FF0FF", "FFF0F", "FFFF0"];
    if ((chan < 1) || (chan > 5)) {
      return "\0";
    }

    for (var i = 0; i < 5; i++) {
      if (!groupAddress.get(i)) {
        word[returnPos++] = 'F';
      }
      else {
        word[returnPos++] = '0';
      }
    }

    for (var j = 0; j < 5; j++) {
      word[returnPos++] = code[chan][j];
    }

    if (status) {
      word[returnPos++] = '0';
      word[returnPos++] = 'F';
    }
    else {
      word[returnPos++] = 'F';
      word[returnPos++] = '0';
    }

    word[returnPos] = '\0';
    return word.join("");
  };

  /**
   * Returns a 13 character array, representing the code word to be sent.
	 * A code word consists of 9 address bits, 3 data bits, and on sync bit
	 * but in our case, only the first 8 address bits and the last 2 data
	 * bits are used. A code bit can have 4 different states: "F" (floating),
	 * "1" (high), "0" (low), and "S" (synchronous bit).
	 * +-------------------------------+--------------------------------+-----------------------------------------+-----------------------------------------+----------------------+------------+
	 * | 4 bits address (switch group) | 4 bits address (switch number) | 1 bit address (not used, so never mind) | 1 bit address (not used, so never mind) | 2 data bits (on|off) | 1 sync bit |
	 * | 1=0FFF 2=F0FF 3=FF0F 4=FFF0   | 1=0FFF 2=F0FF 3=FF0F 4=FFF0    | F | F | on=FF off=F0 | S |
	 * +-------------------------------+--------------------------------+-----------------------------------------+-----------------------------------------+----------------------+------------+
   * @param  {BitSet} address The switch group (address).
   * @param  {ChannelCode} chan    The channel (switch) to manipulate.
   * @param  {Boolean} status  Whether to switch on (true) or off (false).
   * @return {String}          A single-character array containing only a
   * null-character.
   */
  var getCodeWordB = function(address, chan, status) {
    status = status || false;
    var returnPos = 0;
    var word = new Array(13);
    var code = ["FFFF", "0FFF", "F0FF", "FF0F", "FFF0"];
    if ((address < 1) || (address > 4) || (chan < 1) || (chan > 4)) {
      return "\0";
    }

    for (var i = 0; i < 4; i++) {
      word[returnPos++] = code[address][i];
    }

    for (var j = 0; j < 4; j++) {
      word[returnPos++] = code[chan][j];
    }

    word[returnPos++] = 'F';
    word[returnPos++] = 'F';
    word[returnPos++] = 'F';
    if (status) {
      word[returnPos++] = 'F';
    }
    else {
      word[returnPos++] = '0';
    }

    word[returnPos] = '\0';
    return word.join("");
  };

  /**
   * Transmits the specified code word to the device.
   * @param  {Array} codeWord A character array that is the code word to transmit.
   */
  this.send = function(codeWord) {
    var j = 0;
    for (var i = 0; i < self.repeatTransmit; i++) {
      j = 0;
      while (codeWord[j] !== '\0') {
        switch (codeWord[j]) {
          case '0':
            send0();
            break;
          case '1':
            send1();
            break;
          default:
            break;
        }
        j++;
      }
      sendSync();
    }
  };

  /**
   * Transmits the specified code word to the device.
   * @param  {Number} code   A long represents the bits of the address.
   * @param  {Number} length The length of bits (count) to send.
   */
  this.sendCode = function(code, length) {
    self.send(dec2BinWzeroFill(code, length));
  };

  /**
   * Sends a code word.
   * @param  {Array} codeWord A character array making up the code word to send.
   */
  this.sendTriState = function(codeWord) {
    var j = 0;
    for (var i = 0; i < self.repeatTransmit; i++) {
      j = 0;
      while (codeWord[j] !== '\0') {
        switch (codeWord[j]) {
          case '0':
            sendT0();
            break;
          case 'F':
            sendTF();
            break;
          case '1':
            sendT1();
            break;
          default:
            break;
        }
        j++;
      }
      sendSync();
    }
  };

  /**
   * Switch a remote switch on (Type A with 10 pole DIP switches).
   * @param  {BitSet} switchGroupAddress Code of the switch group (refers to DIP
   * switches 1 - 5, where "1" = on and "0" = off, if all DIP switches are on
   * it's "11111").
   * @param  {RCSwitchDevNum} device             The switch device number.
   * @throws {ArgumentNullException} if switchGroupAddress is null or undefined.
   * @throws {IllegalArgumentException} if switchGroupAddress contains more than
   * 5 bits.
   */
  this.switchOnA = function(switchGroupAddress, device) {
    if (util.isNullOrUndefined(switchGroupAddress)) {
      throw new ArgumentNullException("'switchGroupAddress' param cannot be null or empty.");
    }

    if (switchGroupAddress.length() > 5) {
      throw new IllegalArgumentException("Cannot accept a switch group address with more than 5 bits.");
    }

    if (device === RCSwitchDevNum.None) {
      return;
    }

    var state = getCodeWordA(switchGroupAddress, device, true);
    self.sendTriState(state.split(''));
  };

  /**
   * Switch a remote switch off (Type A with 10 pole DIP switches).
   * @param  {BitSet} switchGroupAddress Code of the switch group (refers to DIP
   * switches 1 - 5, where "1" = on and "0" = off, if all DIP switches are on
   * it's "11111").
   * @param  {RCSwitchDevNum} device             The switch device number.
   * @throws {ArgumentNullException} if switchGroupAddress is null or undefined.
   * @throws {IllegalArgumentException} if switchGroupAddress contains more than
   * 5 bits.
   */
  this.switchOffA = function(switchGroupAddress, device) {
    if (util.isNullOrUndefined(switchGroupAddress)) {
      throw new ArgumentNullException("'switchGroupAddress' param cannot be null or empty.");
    }

    if (switchGroupAddress.length() > 5) {
      throw new IllegalArgumentException("Cannot accept a switch group address with more than 5 bits.");
    }

    if (device === RCSwitchDevNum.None) {
      return;
    }

    var state = getCodeWordA(switchGroupAddress, device, false);
    self.sendTriState(state.split(''));
  };

  /**
   * Switch a remote switch on (Type B with two rotary/sliding switches).
   * @param  {AddressCode} address The address of the switch group.
   * @param  {ChannelCode} channel The channel (switch) itself.
   */
  this.switchOnB = function(address, channel) {
    self.sendTriState(getCodeWordB(address, channel, true).split(''));
  };

  /**
   * Switch a remote switch off (Type B with two rotary/sliding switches).
   * @param  {AddressCode} address The address of the switch group.
   * @param  {ChannelCode} channel The channel (switch) itself.
   */
  this.switchOffB = function(address, channel) {
    self.sendTriState(getCodeWordB(address, channel, true).split(''));
  };
}

RCSwitchDevice.prototype.constructor = RCSwitchDevice;
inherits(RCSwitchDevice, RCSwitchInterface);

/**
 * The default pulse length for Protocol 1 (350).
 * @const {Number}
 */
RCSwitchDevice.DEFAULT_PROTOCOL1_PULSE_LENGTH = DEF_PROT1_PULSE_LEN;

/**
 * The default pulse length for Protocol 2 (650).
 * @const {Number}
 */
RCSwitchDevice.DEFAULT_PROTOCOL2_PULSE_LENGTH = DEF_PROT2_PULSE_LEN;

/**
 * Convenience method for converting a string like "11011" to a BitSet.
 * @param  {String} addressString The a string containing the address bits in
 * sequence.
 * @return {BitSet}               A bitset containing the address that can b
 * used for swithing devices on or off.
 * @throws {ArgumentNullException} if addressString is null or undefined;
 * @throws {IllegalArgumentException} if addressString does not contain exactly
 * 5 bits (characters).
 */
RCSwitchDevice.getSwitchGroupAddress = getSwitchGroupAddress;

module.exports = extend(true, RCSwitchDevice, DeviceBase);
