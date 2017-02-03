"use strict";

//
//  PiFaceGpioDigital.js
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
const PiFaceGPIO = require('./PiFaceGPIO.js');
const PiFaceGpioBase = require('./PiFaceGpioBase.js');
const SPI = require('pi-spi');
const Buffer = require('buffer');
const IOException = require('./IOException.js');
const PinState = require('./PinState.js');
const PinMode = require('./PinMode.js');
const PinStateChangeEvent = require('./PinStateChangeEvent.js');
const PinPullResistance = require('./PinPullResistance.js');
const ObjectDisposedException = require('../ObjectDisposedException.js');

const ADDR_0 = 0x01000000; // 0x40 [0100 0000]
const ADDR_1 = 0x01000010; // 0x42 [0100 0010]
const ADDR_2 = 0x01000100; // 0x44 [0100 0100]
const ADDR_3 = 0x01000110; // 0x46 [0100 0110]
const DEF_ADDR = ADDR_0;

const REGISTER_IODIR_A = 0x00;
const REGISTER_IODIR_B = 0x01;
const REGISTER_GPINTEN_A = 0x04;
const REGISTER_GPINTEN_B = 0x05;
const REGISTER_DEFVAL_A = 0x06;
const REGISTER_DEFVAL_B = 0x07;
const REGISTER_INTCON_A = 0x08;
const REGISTER_INTCON_B = 0x09;
const REGISTER_IOCON_A = 0x0A;
const REGISTER_IOCON_B = 0x0B;
const REGISTER_GPPU_A = 0x0C;
const REGISTER_GPPU_B = 0x0D;
const REGISTER_INTF_A = 0x0E;
const REGISTER_INTF_B = 0x0F;
const REGISTER_INTCAP_A = 0x10;
const REGISTER_INTCAP_B = 0x11;
const REGISTER_GPIO_A = 0x12;
const REGISTER_GPIO_B = 0x13;

const GPIO_A_OFFSET = 0;
const GPIO_B_OFFSET = 1000;

const IOCON_UNUSED = 0x01;
const IOCON_INTPOL = 0x02;
const IOCON_ODR = 0x04;
const IOCON_HAEN = 0x08;
const IOCON_DISSLW = 0x10;
const IOCON_SEQOP = 0x20;
const IOCON_MIRROR = 0x40;
const IOCON_BANK_MODE = 0x80;

const BUS_SPEED = 1000000;
const WRT_FLAG = 0x00;
const RD_FLAG = 0x01;

/**
 * @classdesc PiFace GPIO pin implementing SPI.
 * @extends {PiFaceGpioBase}
 */
class PiFaceGpioDigital extends PiFaceGpioBase {
  /**
   * Initializes a new instance of the jsrpi.IO.PiFaceGpioDigital class with
   * the pin to control, initial pin state, SPI address, and SPI speed.
   * @param {PiFacePins} pin          The PiFace pin to control.
   * @param {PinState} initialValue   The initial value (state) to set the pin to.
   * Default is PinState.Low.
   * @param {Number} spiAddress   The SPI address to use. (Should be ADDRESS_0,
   * ADDRESS_1, ADDRESS_2, or ADDRESS_3).
   * @param {Number} spiSpeed     The clock speed to set the bus to. Can be powers
   * of 2 (500KHz minimum up to 32MHz maximum). If not specified, the default of
   * SPI_SPEED (1MHz) will be used.
   * @throws {IOException} if unable to read or write to the SPI bus.
   * @constructor
   */
  constructor(pin, initialValue, spiAddress, spiSpeed) {
    super(pin, initialValue);

    // TODO refactor to use an enum for channels 0.0 and 0.1 (maybe more?).
    // var _base = new PiFaceGpioBase(pin, initialValue);
    this._speed = spiSpeed || BUS_SPEED;
  	this._spi = SPI.initialize("/dev/spidev0.0");
  	this._spi.clockSpeed(this._speed);
  	this._address = spiAddress || DEF_ADDR;
  	this._currentStatesA = 0x00000000;
  	this._currentStatesB = 0x11111111;
  	this._currentDirectionA = 0x00000000;
  	this._currentDirectionB = 0x11111111;
  	this._currentPullupA = 0x00000000;
  	this._currentPullupB = 0x11111111;
  	this._oldState = PinState.Low;
  	this._pollTimer = null;
  	this._shuttingDown = false;
    this._pullResistance = PinPullResistance.OFF;
    this._initialValue = initialValue;
    if (util.isNullOrUndefined(this._initialValue)) {
      this._initialValue = PinState.Low;
    }

    // IOCON – I/O EXPANDER CONFIGURATION REGISTER
  	//
  	// bit 7 BANK: Controls how the registers are addressed
  	//     1 = The registers associated with each port are separated into different banks
  	//     0 = The registers are in the same bank (addresses are sequential)
  	// bit 6 MIRROR: INT Pins Mirror bit
  	//     1 = The INT pins are internally connected
  	//     0 = The INT pins are not connected. INTA is associated with PortA and INTB is associated with PortB
  	// bit 5 SEQOP: Sequential Operation mode bit.
  	//     1 = Sequential operation disabled, address pointer does not increment.
  	//     0 = Sequential operation enabled, address pointer increments.
  	// bit 4 DISSLW: Slew Rate control bit for SDA output.
  	//     1 = Slew rate disabled.
  	//     0 = Slew rate enabled.
  	// bit 3 HAEN: Hardware Address Enable bit (MCP23S17 only).
  	//     Address pins are always enabled on MCP23017.
  	//     1 = Enables the MCP23S17 address pins.
  	//     0 = Disables the MCP23S17 address pins.
  	// bit 2 ODR: This bit configures the INT pin as an open-drain output.
  	//     1 = Open-drain output (overrides the INTPOL bit).
  	//     0 = Active driver output (INTPOL bit sets the polarity).
  	// bit 1 INTPOL: This bit sets the polarity of the INT output pin.
  	//     1 = Active-high.
  	//     0 = Active-low.
  	// bit 0 Unimplemented: Read as ‘0’.
  	//

  	// write IO configuration
  	this._write(REGISTER_IOCON_A, (IOCON_SEQOP | IOCON_HAEN));  // enable hardware address
  	this._write(REGISTER_IOCON_B, (IOCON_SEQOP | IOCON_HAEN));  // enable hardware address

  	// read initial GPIO pin states
  	this._currentStatesA = this._read(REGISTER_GPIO_A);
  	this._currentStatesB = this._read(REGISTER_GPIO_B);

  	// set all default pin pull up resistors
  	// (1 = Pull-up enabled.)
  	// (0 = Pull-up disabled.)
  	this._write(REGISTER_IODIR_A, this._currentDirectionA);
  	this._write(REGISTER_IODIR_B, this._currentDirectionB);

  	// set all default pin states
  	this._write(REGISTER_GPIO_A, this._currentStatesA);
  	this._write(REGISTER_GPIO_B, this._currentStatesB);

  	// set all default pin pull up resistors
  	// (1 = Pull-up enabled.)
  	// (0 = Pull-up disabled.)
  	this._write(REGISTER_GPPU_A, this._currentPullupA);
  	this._write(REGISTER_GPPU_B, this._currentPullupB);

  	// set all default pin interrupts
  	// (if pin direction is input (1), then enable interrupt for pin)
  	// (1 = Enable GPIO input pin for interrupt-on-change event.)
  	// (0 = Disable GPIO input pin for interrupt-on-change event.)
  	this._write(REGISTER_GPINTEN_A, this._currentDirectionA);
  	this._write(REGISTER_GPINTEN_B, this._currentDirectionB);

  	// set all default pin interrupt default values
  	// (comparison value registers are not used in this implementation)
  	this._write(REGISTER_DEFVAL_A, 0x00);
  	this._write(REGISTER_DEFVAL_B, 0x00);

  	// set all default pin interrupt comparison behaviors
  	// (1 = Controls how the associated pin value is compared for interrupt-on-change.)
  	// (0 = Pin value is compared against the previous pin value.)
  	this._write(REGISTER_INTCON_A, 0x00);
  	this._write(REGISTER_INTCON_B, 0x00);

  	// reset/clear interrupt flags
  	if (this._currentDirectionA > 0) {
    	this._read(REGISTER_INTCAP_A);
  	}

  	if (this._currentDirectionB > 0) {
    	this._read(REGISTER_INTCAP_B);
  	}
  }

	/**
  * Writes the specified byte to the specified register.
  * @param  {Number} register The register to write to. This should be one of
  * the register constants.
  * @param  {Number} data     A single byte to write to the register.
  * @throws {IOException} if unable to write to the SPI bus.
  * @private
  */
  _write(register, data) {
    // create packet in data buffer.
    let packet = new Array(3);
    packet[0] = (this._address | WRT_FLAG);  // address byte
    packet[1] = register;                    // register byte
    packet[2] = data;                        // data byte

    // send data packet
    this._spi.write(new Buffer(packet), function(err, response) {
      if (err) {
        throw new IOException("Failed to write to SPI bus device at" +
                            " address " + this._address.toString() + " on " +
                            "channel /dev/spidev0.0 Error: " + err);
      }
    });
  }

  /**
  * Reads a single byte from the specified register.
  * @param  {Number} register [description] The register to write to. This
  * should be one of the register constants.
  * @return {Number} The byte read.
  * @throws {IOException} if unable to read from the SPI bus.
  * @private
  */
  _read(register) {
    // create packet in data buffer.
    let packet = new Array(3);
    packet[0] = (this._address | RD_FLAG);  // address byte
    packet[1] = register;              // register byte
    packet[2] = 0x00000000;            // data byte

    let result = 0;
    this._spi.transfer(new Buffer(packet), packet.length, function(err, buf) {
      if (err) {
        throw new IOException("Failed to read from SPI bus device at" +
        " address " + this._address.toString() + " on " +
        "channel /dev/spidev0.0. Error: " + err);
      }

      // (include the '& 0xFF' to ensure the bits in the unsigned byte are cast
      // properly)
      result = buf[2] & 0xFF;
    });
    return result;
  }

  /**
  * Sets the state of this pin if on Port A (outputs).
  * @param  {PinState} state The state to set.
  * @throws {IOException} if unable to write to the SPI port.
  * @private
  */
  _setStateA(state) {
    // determine pin address.
    let pinAddress = super.innerPin.value - GPIO_A_OFFSET;

    // determine state value for pin bit
    if (state === PinState.High) {
      this._currentStatesA |= pinAddress;
    }
    else {
      this._currentStatesA &= ~pinAddress;
    }

    // update state value.
    this._write(REGISTER_GPIO_A, this._currentStatesA);
  }

  /**
  * Sets the state of this pin if on Port B (inputs).
  * @param  {PinState} state The state to set.
  * @throws {IOException} if unable to write to the SPI port.
  * @private
  */
  _setStateB(state) {
    // determine pin address
    let pinAddress = super.innerPin.value - GPIO_B_OFFSET;

    // determine state value for pin bit
    if (state === PinState.High) {
      this._currentStatesB |= pinAddress;
    }
    else {
      this._currentStatesB &= ~pinAddress;
    }

    // update state value.
    this._write(REGISTER_GPIO_B, this._currentStatesB);
  }

  /**
  * Sets the state of this pin.
  * @param  {PinState} state The state to set.
  * @throws {IOException} if unable to write to the SPI port.
  * @private
  */
  _setState(state) {
    if (super.state === state) {
      return;
    }

    this._oldState = super.state;
    super.write(state);

    // determine A or B port based on pin address.
    if (super.innerPin.value < GPIO_B_OFFSET) {
      this._setStateA(state);
    }
    else {
      this._setStateB(state);
    }
  }

  /**
  * Writes the specified state to the pin (set state).
  * @param  {PinState} state The state to set.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @throws {IOException} if unable to write to the SPI port.
  * @override
  */
  write(state) {
    if (this.isDisposed) {
      throw new ObjectDisposedException("PiFaceGpioDigital");
    }
    super.write(state);
    this._setState(state);
  }

  /**
  * Evaluates this pin to see if on Port A, and if so, if it has changed state
  * in comparison to the specified state, then emits the Gpio.EVENT_STATE_CHANGED
  * event if the state has in fact changed.
  * @param  {PinState} state The state to check against.
  * @private
  */
  _evaluatePinForChangeA(state) {
    if (super.innerPin in super.exportedPins) {
      // determine pin address.
      let pinAddress = super.innerPin.value - GPIO_A_OFFSET;

      // determine if state changed.
      if ((state & pinAddress) !== (this._currentStatesA & pinAddress)) {
        // Determine new state value for pin bit.
        let newState = (state & pinAddress) === pinAddress ? PinState.High : PinState.Low;
        if (newState === PinState.High) {
          this._currentStatesA |= pinAddress;
        }
        else {
          this._currentStatesA &= ~pinAddress;
        }

        // change detected for pin.
        let evt = new PinStateChangeEvent(this._oldState, newState, pinAddress);
        this.onPinStateChange(evt);
      }
    }
  }

  /**
  * Evaluates this pin to see if on Port B, and if so, if it has changed state
  * in comparison to the specified state, then emits the Gpio.EVENT_STATE_CHANGED
  * event if the state has in fact changed.
  * @param  {PinState} state The state to check against.
  * @private
  */
  _evaluatePinForChangeB(state) {
    if (super.innerPin in super.exportedPins) {
      // determine pin address.
      let pinAddress = super.innerPin.value - GPIO_B_OFFSET;

      // determine if state changed.
      if ((state & pinAddress) !== (this._currentStatesB & pinAddress)) {
        // Determine new state value for pin bit.
        let newState = (state & pinAddress) === pinAddress ? PinState.High : PinState.Low;
        if (newState === PinState.High) {
          this._currentStatesB |= pinAddress;
        }
        else {
          this._currentStatesB &= ~pinAddress;
        }

        // change detected for pin.
        let evt = new PinStateChangeEvent(this._oldState, newState, pinAddress);
        this.onPinStateChange(evt);
      }
    }
  }

  /**
  * Sets the mode of this pin on port A.
  * @param  {PinMode} mode The pin mode to set.
  * @throws {IOException} if unable to write to the SPI port.
  * @private
  */
  _setModeA(mode) {
    let pinAddress = super.innerPin.value - GPIO_A_OFFSET;

    if (mode === PinMode.IN) {
      this._currentDirectionA |= pinAddress;
    }
    else if (mode === PinMode.OUT) {
      this._currentDirectionA &= ~pinAddress;
    }

    this._write(REGISTER_IODIR_A, this._currentDirectionA);

    this._write(REGISTER_GPINTEN_A, this._currentDirectionA);
  }

  /**
  * Sets the mode of this pin on port B.
  * @param  {PinMode} mode The pin mode to set.
  * @throws {IOException} if unable to write to the SPI port.
  * @private
  */
  _setModeB(mode) {
    let pinAddress = super.innerPin.value - GPIO_B_OFFSET;

    if (mode === PinMode.IN) {
      this._currentDirectionB |= pinAddress;
    }
    else if (mode === PinMode.OUT) {
      this._currentDirectionB &= ~pinAddress;
    }

    this._write(REGISTER_IODIR_B, this._currentDirectionB);

    this._write(REGISTER_GPINTEN_B, this._currentDirectionB);
  }

  /**
   * Gets or sets the pin mode.
   * @property {PinMode} mode - The pin mode.
   * @throws {IOException} if unable to write to the SPI port.
   * @throws {ObjectDisposedException} if this instance has been disposed.
   * @override
   */
  get mode() {
    return super.mode;
  }

  set mode(m) {
    if (this.isDisposed) {
      throw new ObjectDisposedException("PiFaceGpioDigital");
    }

    super.mode = m;

    // determine A or B port based on pin address
    if (this.innerPin.value < GPIO_B_OFFSET) {
      this._setModeA(m);
    }
    else {
      this._setModeB(m);
    }

    // if any pins are configured as input pins, then we need to start the
    // interrupt monitoring poll timer.
    if ((this._currentDirectionA > 0) || (this._currentDirectionB > 0)) {
      this.poll();
    }
    else {
      this.cancelPoll();
    }
  }

  /**
  * Provisions the I/O pin.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @override
  */
  provision() {
    this.write(this._initialValue);
  }

  /**
  * Cancels an input poll cycle (if running) started by poll() or setMode().
  */
  cancelPoll() {
    if (this._shuttingDown) {
      return;
    }

    this._shuttingDown = true;
    if (!util.isNullOrUndefined(this._pollTimer)) {
      clearInterval(this._pollTimer);
      this._pollTimer = null;
    }
  }

  /**
  * The background (asynchronous) poll cycle routine. This is the callback
  * executed by the timer started by poll().
  * @throws {IOException}
  * @private
  */
  _backgroundPoll() {
    if (this._shuttingDown) {
      return;
    }

    // only process for interrupts if a pin on port A is configured as an input pin.
    let pin = null;
    let pinInterruptState = -1;
    if (this._currentDirectionA > 0) {
      // process interrupts for port A.
      let pinInterruptA = this._read(REGISTER_INTF_A);

      // validate that there is at least one interrupt active on port A.
      if (pinInterruptA > 0) {
        // read the current pin states on port A.
        pinInterruptState = this._read(REGISTER_GPIO_A);

        // loop over the available pins on port B.
        let pinAddressA = -1;
        for (let i = 0; i < PiFaceGPIO.OUTPUTS.length; i++) {
          pin = PiFaceGPIO.OUTPUTS[i];
          pinAddressA = pin.value - GPIO_A_OFFSET;

          // is there an interrupt flag on this pin?
          this._evaluatePinForChangeA(pin, pinInterruptState);
        }
      }
    }

    // only process for interrupts if a pin on port B is configured as an input pin.
    if (this._currentDirectionB > 0) {
      // process interrupts for port B.
      let pinInterruptB = this._read(REGISTER_INTF_B);

      // validate that there is at least one interrupt active on port B.
      if (pinInterruptB > 0) {
        // read the current pin states on port B.
        pinInterruptState = this._read(REGISTER_GPIO_B);

        // loop over the available pins on port B
        let pinAddressB = -1;
        for (let j = 0; j < PiFaceGPIO.INPUTS.length; j++) {
          pin = PiFaceGPIO.INPUTS[j];
          pinAddressB = pin.value - GPIO_B_OFFSET;

          // is there an interrupt flag on this pin?
          this._evaluatePinForChangeB(pin, pinInterruptState);
        }
      }
    }
  }

  /**
  * Starts a pin poll cycle. This will monitor the pin and check for state
  * changes. If a state change is detected, the Gpio.EVENT_STATE_CHANGED event
  * will be emitted. The poll cycle runs asynchronously until stopped by the
  * cancelPoll() method or when this object instance is disposed.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  */
  poll() {
    if (super.isDisposed) {
      throw new ObjectDisposedException("PiFaceGpioDigital");
    }
    this._shuttingDown = false;
    this._pollTimer = setInterval(() => { this._backgroundPoll(); }, 50);
  }

  /**
  * Sets the pin pull-up/down resistance for Port A.
  * @param  {PinPullResistance} resistance The pin pull resistance flag to set.
  * Can enable the internal pull-up or pull-down resistor, or disable it.
  * @throws {IOException} if unable to write to the SPI port.
  * @private
  */
  _setPullResistanceA(resistance) {
    let pinAddress = super.innerPin.value - GPIO_A_OFFSET;

    if (resistance.value === PinPullResistance.PULL_UP.value) {
      this._currentPullupA |= pinAddress;
    }
    else {
      this._currentPullupA &= ~pinAddress;
    }

    this._write(REGISTER_GPPU_A, this._currentPullupA);
  }

  /**
  * Sets the pin pull-up/down resistance for Port B.
  * @param {PinPullResistance} resistance The pin pull resistance flag to set.
  * Can enable the internal pull-up or pull-down resistor, or disable it.
  * @throws {IOException} if unable to write to the SPI port.
  * @private
  */
  _setPullResistanceB(resistance) {
    let pinAddress = super.innerPin.value - GPIO_B_OFFSET;

    if (resistance.value === PinPullResistance.PULL_UP.value) {
      this._currentPullupB |= pinAddress;
    }
    else {
      this._currentPullupB &= ~pinAddress;
    }

    this._write(REGISTER_GPPU_B, this._currentPullupB);
  }

  /**
  * Gets or sets the pin pull-up/down resistance.
  * @property {PinPullResistance} pullResistance - The pin pull resistance.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @throws {IOException} if unable to write to the SPI port.
  */
  get pullResistance() {
    return this._pullResistance;
  }

  set pullResistance(resistance) {
    if (this._pullResistance.value === resistance.value) {
      return;
    }

    if (this.isDisposed) {
      throw new ObjectDisposedException("PiFaceGpioDigital");
    }

    this._pullResistance = resistance;
    if (this.innerPin.value < GPIO_B_OFFSET) {
      this._setPullResistanceA(resistance);
    }
    else {
      this._setPullResistanceB(resistance);
    }
  }

  /**
  * Reads a value from the pin.
  * @return {Number} A single byte read from the pin.
  * @throws {IOException} if unable to read from the SPI port.
  * @override
  */
  read() {
    if (this.innerPin.value < GPIO_B_OFFSET) {
      return this._read(REGISTER_GPIO_A);
    }
    return this._read(REGISTER_GPIO_B);
  }

  /**
  * Gets the state of the pin if on Port A.
  * @return {PinState} The state of the pin.
  * @throws {IOException} if unable to read from the SPI port.
  * @private
  */
  _getStateA() {
    let pinAddress = this.innerPin.value - GPIO_A_OFFSET;
    let state = (this._currentStatesA & pinAddress) === pinAddress ? PinState.High : PinState.Low;
    super.write(state);
    return state;
  }

  /**
  * Gets the state of the pin if on Port B.
  * @return {PinState} The state of the pin.
  * @throws {IOException} if unable to read from the SPI port.
  * @private
  */
  _getStateB() {
    let pinAddress = this.innerPin.value - GPIO_B_OFFSET;
    let state = (this._currentStatesB & pinAddress) === pinAddress ? PinState.High : PinState.Low;
    super.write(state);
    return state;
  }

  /**
  * Gets the state of the pin.
  * @property {PinState} state - The pin state.
  * @throws {ObjectDisposedException} if this instance has been disposed.
  * @throws {IOException} if unable to read from the SPI port.
  * @override
  */
  get state() {
    if (this.isDisposed) {
      throw new ObjectDisposedException("PiFaceGpioDigital");
    }

    let result = super.state;
    if (this.innerPin.value < GPIO_B_OFFSET) {
      result = this._getStateA();
    }
    else {
      result = this._getStateB();
    }

    return result;
  }

  /**
  * Releases all resources used by the PiFaceGpioDigital object.
  * @override
  */
  dispose() {
    if (this.isDisposed) {
      return;
    }

    this.cancelPoll();
    this._spi = undefined;
    super.dispose();
  }

  /**
   * Bus address 0.
   * @type {Number}
   * @const
   */
  static get ADDRESS_0() { return ADDR_0; }

  /**
   * Bus address 1.
   * @type {Number}
   * @const
   */
  static get ADDRESS_1() { return ADDR_1; }

  /**
   * Bus address 2.
   * @type {Number}
   * @const
   */
  static get ADDRESS_2() { return ADDR_2; }

  /**
   * Bus address 3.
   * @type {Number}
   * @const
   */
  static get ADDRESS_3() { return ADDR_3; }

  /**
   * Default bus address (ADDRESS_0).
   * @type {Number}
   * @const
   */
  static get DEFAULT_ADDRESS() { return DEF_ADDR; }

  /**
   * The clock speed to transfer at (1MHz).
   * @type {Number}
   * @const
   */
  static get SPI_SPEED() { return BUS_SPEED; }

  /**
   * The write operation flag.
   * @type {Number}
   * @const
   */
  static get WRITE_FLAG() { return WRT_FLAG; }

  /**
   * The read operation flag.
   * @type {Number}
   * @const
   */
  static get READ_FLAG() { return RD_FLAG; }
}

module.exports = PiFaceGpioDigital;
