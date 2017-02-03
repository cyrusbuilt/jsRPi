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

const util = require('util');
const DeviceBase = require('../DeviceBase.js');
const RCSwitchInterface = require('./RCSwitchInterface.js');
const RCProtocol = require('./RCProtocol.js');
const RCSwitchDevNum = require('./RCSwitchDevNum.js');
const CoreUtils = require('../../PiSystem/CoreUtils.js');
const BitSet = require('../../BitSet.js');
const PinMode = require('../../IO/PinMode.js');
const PinState = require('../../IO/PinState.js');
const ArgumentNullException = require('../../ArgumentNullException.js');
const IllegalArgumentException = require('../../IllegalArgumentException.js');
const ObjectDisposedException = require('../../ObjectDisposedException.js');


// TODO Need unit tests for this class.

const DEF_PROT1_PULSE_LEN = 350;
const DEF_PROT2_PULSE_LEN = 650;
const PROTOCOL1_SYNC_LOW_PULSES = 31;
const PROTOCOL2_SYNC_LOW_PULSES = 10;

/**
* Converts a decimal value into its binary representation.
* @param  {Number} dec       The decimal value to convert.
* @param  {Number} bitLength The length in bits to fill with zeros.
* @return {Array}           The binary representation of the specified decimal.
* @private
*/
const dec2BinWzeroFill = function(dec, bitLength) {
  let bin = new Array(64);
  let i = 0;

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
* @classdesc A device abstraction for an RC (remote control) switched power
* outlets.
* @implements {RCSwitchInterface}
* @extends {DeviceBase}
*/
class RCSwitchDevice extends RCSwitchInterface {
    /**
     * Initializes a new instance of the jsrpi.Devices.RCSwitch.RCSwitchDevice
     * class with the pin to transmit on.
     * @param {RaspiGpio} transmitPin The native pin to use to transmit codes.
     * @throws {ArgumentNullException} if transmitPin is null or undefined.
     * @throws {IllegalArgumentException} if transmitPin is not configured as an
     * output.
     * @constructor
     */
    constructor(transmitPin) {
        super();
        
        if (util.isNullOrUndefined(transmitPin)) {
          throw new ArgumentNullException("'transmitPin' param cannot be null or undefined.");
        }

        if (transmitPin.mode !== PinMode.OUT) {
          throw new IllegalArgumentException("The specified pin is not an output.");
        }

        this._base = new DeviceBase();
        this._txPin = transmitPin;
        this._txPin.write(PinState.Low);
        this._protocol = RCProtocol.P1;
        this._pulseLength = DEF_PROT1_PULSE_LEN;
        this._repeatTransmit = 0;
    }

    /**
     * Gets or sets the length of the pulse.
     * @property {Number} pulseLength - The length of pulse.
     * @override
     */
    get pulseLength() {
        return this._pulseLength;
    }

    set pulseLength(length) {
        this._pulseLength = length;
    }

    /**
     * Gets or sets the transmit repitions.
     * @property {Number} repeatTransmit - The number of transmit repetitions.
     * @override
     */
    get repeatTransmit() {
        return this._repeatTransmit;
    }

    set repeatTransmit(reps) {
        this._repeatTransmit = reps || 0;
    }

    /**
    * Gets or sets the device name.
    * @property {String} deviceName - The device name.
    * @override
    */
    get deviceName() {
        return this._base.deviceName;
    }

    set deviceName(name) {
        this._base.deviceName = name;
    }

    /**
    * Gets or sets the object to tag this device with.
    * @property {Object} tag - The tag.
    */
    get tag() {
        return this._base.tag;
    }

    set tag(t) {
        this._base.tag = t;
    }

    /**
    * Determines whether or not the current instance has been disposed.
    * @property {Boolean} isDisposed - true if disposed; Otherwise, false.
    * @override
    */
    get isDisposed() {
        return this._base.isDisposed;
    }

    /**
    * Gets the custom property collection.
    * @property {Array} propertyCollection - The property collection.
    * @readonly
    * @override
    */
    get propertyCollection() {
      return this._base.getPropertyCollection;
    }

    /**
    * Checks to see if the property collection contains the specified key.
    * @param  {String}  key The key name of the property to check for.
    * @return {Boolean} true if the property collection contains the key;
    * Otherwise, false.
    * @override
    */
    hasProperty(key) {
        if (this._base.isDisposed) {
            return false;
        }
        return this._base.hasProperty(key);
    }

    /**
    * Sets the value of the specified property. If the property does not already exist
    * in the property collection, it will be added.
    * @param  {String} key   The property name (key).
    * @param  {String} value The value to assign to the property.
    * @throws {ObjectDisposedException} if this instance has been disposed.
    */
    setProperty(key, value) {
        if (this._base.isDisposed) {
            throw new ObjectDisposedException("RCSwitchDevice");
        }
        this._base.setProperty(key, value);
    }

    /**
    * Returns the string representation of this object. In this case, it simply
    * returns the component name.
    * @return {String} The name of this component.
    * @override
    */
    toString() {
        return this.deviceName;
    }

    /**
    * Releases all managed resources used by this instance.
    * @override
    */
    dispose() {
        if (this._base.isDisposed) {
            return;
        }

        if (!util.isNullOrUndefined(this._txPin)) {
            this._txPin.dispose();
            this._txPin = undefined;
        }

        this._base.dispose();
    }

    /**
    * Gets or sets the operating protocol.
    * @property {RCProtocol} protocol - The operating protocol. If the value is
    * set to less than or equal to zero, then the default pulse length value for
    * the specified protocol will be set.
    * @throws {ObjectDisposedException} if this instance has been disposed.
    * @override
    */
    get protocol() {
        return this._protocol;
    }

    set protocol(p) {
        if (this._base.isDisposed) {
            throw new ObjectDisposedException("RCSwitchDevice");
        }

        this._protocol = p;
        if (this.pulseLength <= 0) {
            switch (this._protocol) {
                case RCProtocol.P1:
                    this.pulseLength = DEF_PROT1_PULSE_LEN;
                    break;
                case RCProtocol.P2:
                    this.pulseLength = DEF_PROT2_PULSE_LEN;
                    break;
                default:
                    break;
            }
        }
    }

    /**
    * Trasmits the specified number of high and low pulses.
    * @param  {Number} highPulses The number of high pulses.
    * @param  {Number} lowPulses  The number of low pulses.
    * @private
    */
    _transmit(highPulses, lowPulses) {
        if (!util.isNullOrUndefined(this._txPin)) {
            this._txPin.write(PinState.High);
            CoreUtils.sleepMicroseconds(this.pulseLength * highPulses);
            this._txPin.write(PinState.Low);
            CoreUtils.sleepMicroseconds(this.pulseLength * lowPulses);
        }
    }

    /**
    * Sends a "Sync" bit.
    *                       _
    * Waveform Protocol 1: | |_______________________________
    *                       _
    * Waveform Protocol 2: | |__________
    * @private
    */
    _sendSync() {
        switch (this._protocol) {
            case RCProtocol.P1:
                this._transmit(1, PROTOCOL1_SYNC_LOW_PULSES);
                break;
            case RCProtocol.P2:
                this._transmit(1, PROTOCOL2_SYNC_LOW_PULSES);
                break;
            default:
                break;
        }
    }

    /**
    * Sends a tri-state "0" bit.
    *            _     _
    * Waveform: | |___| |___
    * @private
    */
    _sendT0() {
        this._transmit(1, 3);
        this._transmit(1, 3);
    }

    /**
    * Sends a tri-state "1" bit.<br/><br/>
    *            ___   ___
    * Waveform: |   |_|   |_
    * @private
    */
    _sendT1() {
        this._transmit(3, 1);
        this._transmit(3, 1);
    }

    /**
    * Sends a tri-state "F" bit.
    *            _     ___
    * Waveform: | |___|   |_
    * @private
    */
    _sendTF() {
        this._transmit(1, 3);
        this._transmit(3, 1);
    }

    /**
    * Sends a "0" bit.
    *                       _
    * Waveform Protocol 1: | |___
    *                       _
    * Waveform Protocol 2: | |__
    * @private
    */
    _send0() {
        switch (this._protocol) {
            case RCProtocol.P1:
                this._transmit(1, 3);
                break;
            case RCProtocol.P2:
                this._transmit(1, 2);
                break;
            default:
                break;
        }
    }

    /**
    * Sends a "1" bit.<br/><br/>
    *                       ___
    * Waveform Protocol 1: |   |_
    *                       __
    * Waveform Protocol 2: |  |_
    * @private
    */
    _send1() {
        switch (this._protocol) {
            case RCProtocol.P1:
                this._transmit(3, 1);
                break;
            case RCProtocol.P2:
                this._transmit(2, 1);
                break;
            default:
                break;
        }
    }

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
    * @param  {ChannelCode} chan The channel (switch) to manipulate.
    * @param  {Boolean} status Whether to switch on (true) or off (false).
    * @return {String} If successful, a 13 character array containing
    * the code word; Otherwise, a single-character array containing
    * only a null-character.
    * @private
    */
    _getCodeWordA(groupAddress, chan, status) {
        status = status || false;
        let returnPos = 0;
        let word = new Array(13);
        let code = ["FFFFF", "0FFFF", "F0FFF", "FF0FF", "FFF0F", "FFFF0"];
        if ((chan < 1) || (chan > 5)) {
            return "\0";
        }

        for (let i = 0; i < 5; i++) {
            if (!groupAddress.get(i)) {
                word[returnPos++] = 'F';
            }
            else {
                word[returnPos++] = '0';
            }
        }

        for (let j = 0; j < 5; j++) {
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
    }

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
    * @param  {BitSet}      address The switch group (address).
    * @param  {ChannelCode} chan    The channel (switch) to manipulate.
    * @param  {Boolean}     status  Whether to switch on (true) or off (false).
    * @return {String}      A single-character array containing only a
    * null-character.
    * @private
    */
    _getCodeWordB(address, chan, status) {
        if (util.isNullOrUndefined(status)) {
            status = false;
        }

        let returnPos = 0;
        let word = new Array(13);
        let code = ["FFFF", "0FFF", "F0FF", "FF0F", "FFF0"];
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
    }

    /**
    * Transmits the specified code word to the device.
    * @param  {Array} codeWord A character array that is the code word to transmit.
    * @throws {ObjectDisposedException} if this instance has been disposed.
    */
    send(codeWord) {
        if (super.isDisposed) {
            throw new ObjectDisposedException("RCSwitchDevice");
        }

        let j = 0;
        for (let i = 0; i < this.repeatTransmit; i++) {
            j = 0;
            while (codeWord[j] !== '\0') {
                switch (codeWord[j]) {
                    case '0':
                        this._send0();
                        break;
                    case '1':
                        this._send1();
                        break;
                    default:
                        break;
                }
                j++;
            }
            this._sendSync();
        }
    }

    /**
    * Transmits the specified code word to the device.
    * @param  {Number} code   A long represents the bits of the address.
    * @param  {Number} length The length of bits (count) to send.
    * @throws {ObjectDisposedException} if this instance has been disposed.
    */
    sendCode(code, length) {
        this.send(dec2BinWzeroFill(code, length));
    }

    /**
    * Sends a code word.
    * @param  {Array} codeWord A character array making up the code word to send.
    * @throws {ObjectDisposedException} if this instance has been disposed.
    */
    sendTriState(codeWord) {
        let j = 0;
        for (let i = 0; i < this.repeatTransmit; i++) {
            j = 0;
            while (codeWord[j] !== '\0') {
                switch (codeWord[j]) {
                    case '0':
                        this._sendT0();
                        break;
                    case 'F':
                        this._sendTF();
                        break;
                    case '1':
                        this._sendT1();
                        break;
                    default:
                        break;
                }
                j++;
            }
            this._sendSync();
        }
    }

    /**
    * Switch a remote switch on (Type A with 10 pole DIP switches).
    * @param  {BitSet} switchGroupAddress Code of the switch group (refers to DIP
    * switches 1 - 5, where "1" = on and "0" = off, if all DIP switches are on
    * it's "11111").
    * @param  {RCSwitchDevNum} device The switch device number.
    * @throws {ArgumentNullException} if switchGroupAddress is null or undefined.
    * @throws {IllegalArgumentException} if switchGroupAddress contains more than
    * 5 bits.
    * @throws {ObjectDisposedException} if this instance has been disposed.
    */
    switchOnA(switchGroupAddress, device) {
        if (util.isNullOrUndefined(switchGroupAddress)) {
            throw new ArgumentNullException("'switchGroupAddress' param cannot be null or empty.");
        }

        if (switchGroupAddress.length() > 5) {
            throw new IllegalArgumentException("Cannot accept a switch group address with more than 5 bits.");
        }

        if (device === RCSwitchDevNum.None) {
            return;
        }

        let state = this._getCodeWordA(switchGroupAddress, device, true);
        this.sendTriState(state.split(''));
    }

    /**
    * Switch a remote switch off (Type A with 10 pole DIP switches).
    * @param  {BitSet} switchGroupAddress Code of the switch group (refers to DIP
    * switches 1 - 5, where "1" = on and "0" = off, if all DIP switches are on
    * it's "11111").
    * @param  {RCSwitchDevNum} device The switch device number.
    * @throws {ArgumentNullException} if switchGroupAddress is null or undefined.
    * @throws {IllegalArgumentException} if switchGroupAddress contains more than
    * 5 bits.
    * @throws {ObjectDisposedException} if this instance has been disposed.
    */
    switchOffA(switchGroupAddress, device) {
        if (util.isNullOrUndefined(switchGroupAddress)) {
            throw new ArgumentNullException("'switchGroupAddress' param cannot be null or empty.");
        }

        if (switchGroupAddress.length() > 5) {
            throw new IllegalArgumentException("Cannot accept a switch group address with more than 5 bits.");
        }

        if (device === RCSwitchDevNum.None) {
            return;
        }

        let state = this._getCodeWordA(switchGroupAddress, device, false);
        this.sendTriState(state.split(''));
    }

    /**
    * Switch a remote switch on (Type B with two rotary/sliding switches).
    * @param  {AddressCode} address The address of the switch group.
    * @param  {ChannelCode} channel The channel (switch) itself.
    * @throws {ObjectDisposedException} if this instance has been disposed.
    */
    switchOnB(address, channel) {
        this.sendTriState(this._getCodeWordB(address, channel, true).split(''));
    }

    /**
    * Switch a remote switch off (Type B with two rotary/sliding switches).
    * @param  {AddressCode} address The address of the switch group.
    * @param  {ChannelCode} channel The channel (switch) itself.
    * @throws {ObjectDisposedException} if this instance has been disposed.
    */
    switchOffB(address, channel) {
        this.sendTriState(this._getCodeWordB(address, channel, true).split(''));
    }

    /**
    * The default pulse length for Protocol 1 (350).
    * @const {Number}
    */
    static get DEFAULT_PROTOCOL1_PULSE_LENGTH() { return DEF_PROT1_PULSE_LEN; }

    /**
    * The default pulse length for Protocol 2 (650).
    * @const {Number}
    */
    static get DEFAULT_PROTOCOL2_PULSE_LENGTH() { return DEF_PROT2_PULSE_LEN; }

    /**
    * Convenience method for converting a string like "11011" to a BitSet.
    * @param  {String} addressString The a string containing the address bits in
    * sequence.
    * @return {BitSet} A bitset containing the address that can b
    * used for swithing devices on or off.
    * @throws {ArgumentNullException} if addressString is null or undefined;
    * @throws {IllegalArgumentException} if addressString does not contain exactly
    * 5 bits (characters).
    */
    static getSwitchGroupAddress(addressString) {
        if (util.isNullOrUndefined(addressString)) {
          throw new ArgumentNullException("'addressString' param cannot be null or undefined.");
        }

        if (addressString.length !== 5) {
          throw new IllegalArgumentException("address must consist of exactly 5 bits!");
        }

        let bits = new BitSet(5);
        for (let i = 0; i < 5; i++) {
          bits.set(i, addressString[i] === '1');
        }
        return bits;
    }
}

module.exports = RCSwitchDevice;
