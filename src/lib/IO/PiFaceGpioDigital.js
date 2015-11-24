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

var util = require('util');
var inherits = require('util').inherits;
var PiFaceGPIO = require('./PiFaceGPIO.js');
var PiFaceGpioBase = require('./PiFaceGpioBase.js');
var SPI = require('pi-spi');
var Buffer = require('buffer');
var IOException = require('./IOException.js');
var PinState = require('./PinState.js');
var PinMode = require('./PinMode.js');
var PinStateChangeEvent = require('./PinStateChangeEvent.js');
var PinPullResistance = require('./PinPullResistance.js');
var ObjectDisposedException = require('../ObjectDisposedException.js');

var ADDR_0 = 0x01000000; // 0x40 [0100 0000]
var ADDR_1 = 0x01000010; // 0x42 [0100 0010]
var ADDR_2 = 0x01000100; // 0x44 [0100 0100]
var ADDR_3 = 0x01000110; // 0x46 [0100 0110]
var DEF_ADDR = ADDR_0;

var REGISTER_IODIR_A = 0x00;
var REGISTER_IODIR_B = 0x01;
var REGISTER_GPINTEN_A = 0x04;
var REGISTER_GPINTEN_B = 0x05;
var REGISTER_DEFVAL_A = 0x06;
var REGISTER_DEFVAL_B = 0x07;
var REGISTER_INTCON_A = 0x08;
var REGISTER_INTCON_B = 0x09;
var REGISTER_IOCON_A = 0x0A;
var REGISTER_IOCON_B = 0x0B;
var REGISTER_GPPU_A = 0x0C;
var REGISTER_GPPU_B = 0x0D;
var REGISTER_INTF_A = 0x0E;
var REGISTER_INTF_B = 0x0F;
var REGISTER_INTCAP_A = 0x10;
var REGISTER_INTCAP_B = 0x11;
var REGISTER_GPIO_A = 0x12;
var REGISTER_GPIO_B = 0x13;

var GPIO_A_OFFSET = 0;
var GPIO_B_OFFSET = 1000;

var IOCON_UNUSED = 0x01;
var IOCON_INTPOL = 0x02;
var IOCON_ODR = 0x04;
var IOCON_HAEN = 0x08;
var IOCON_DISSLW = 0x10;
var IOCON_SEQOP = 0x20;
var IOCON_MIRROR = 0x40;
var IOCON_BANK_MODE = 0x80;

var BUS_SPEED = 1000000;
var WRT_FLAG = 0x00;
var RD_FLAG = 0x01;

/**
 * @classdesc PiFace GPIO pin implementing SPI.
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
 * @extends {PiFaceGpioBase}
 */
function PiFaceGpioDigital(pin, initialValue, spiAddress, spiSpeed) {
  	PiFaceGpioBase.call(this, pin, initialValue);

  	// TODO refactor to use an enum for channels 0.0 and 0.1 (maybe more?).

  	var self = this;
	var _base = new PiFaceGpioBase(pin, initialValue);
  	var _speed = spiSpeed || BUS_SPEED;
  	var _spi = SPI.initialize("/dev/spidev0.0");
  	_spi.clockSpeed(_speed);
  	var _address = spiAddress || DEF_ADDR;
  	var _currentStatesA = 0x00000000;
  	var _currentStatesB = 0x11111111;
  	var _currentDirectionA = 0x00000000;
  	var _currentDirectionB = 0x11111111;
  	var _currentPullupA = 0x00000000;
  	var _currentPullupB = 0x11111111;
  	var _oldState = PinState.Low;
  	var _pollTimer = null;
  	var _shuttingDown = false;
  	var _pullResistance = PinPullResistance.OFF;
  	var _initialValue = initialValue;
  	if (util.isNullOrUndefined(_initialValue)) {
    	_initialValue = PinState.Low;
  	}
	
  	/**
    * Writes the specified byte to the specified register.
    * @param  {Number} register The register to write to. This should be one of
    * the register constants.
    * @param  {Number} data     A single byte to write to the register.
    * @throws {IOException} if unable to write to the SPI bus.
    */
  	this._write = function(register, data) {
    	// create packet in data buffer.
    	var packet = new Array(3);
    	packet[0] = (_address | WRT_FLAG);  // address byte
    	packet[1] = register;               // register byte
    	packet[2] = data;                   // data byte

    	// send data packet
    	_spi.write(new Buffer(packet), function(err, response) {
      	if (err) {
        		throw new IOException("Failed to write to SPI bus device at" +
                              " address " + _address.toString() + " on " +
                              "channel /dev/spidev0.0 Error: " + err);
      	}
    	});
  	};

  	/**
    * Reads a single byte from the specified register.
    * @param  {Number} register [description] The register to write to. This
    * should be one of the register constants.
    * @return {Number} The byte read.
    * @throws {IOException} if unable to read from the SPI bus.
    */
  	this._read = function(register) {
    	// create packet in data buffer.
    	var packet = new Array(3);
    	packet[0] = (_address | RD_FLAG);  // address byte
    	packet[1] = register;              // register byte
    	packet[2] = 0x00000000;            // data byte

    	var result = 0;
    	_spi.transfer(new Buffer(packet), packet.length, function(err, buf) {
      	if (err) {
        		throw new IOException("Failed to read from SPI bus device at" +
                              " address " + _address.toString() + " on " +
                              "channel /dev/spidev0.0. Error: " + err);
      	}

      	// (include the '& 0xFF' to ensure the bits in the unsigned byte are cast
      	// properly)
      	result = buf[2] & 0xFF;
    	});
    	return result;
  	};

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
  	self._write(REGISTER_IOCON_A, (IOCON_SEQOP | IOCON_HAEN));  // enable hardware address
  	self._write(REGISTER_IOCON_B, (IOCON_SEQOP | IOCON_HAEN));  // enable hardware address

  	// read initial GPIO pin states
  	_currentStatesA = self._read(REGISTER_GPIO_A);
  	_currentStatesB = self._read(REGISTER_GPIO_B);

  	// set all default pin pull up resistors
  	// (1 = Pull-up enabled.)
  	// (0 = Pull-up disabled.)
  	self._write(REGISTER_IODIR_A, _currentDirectionA);
  	self._write(REGISTER_IODIR_B, _currentDirectionB);

  	// set all default pin states
  	self._write(REGISTER_GPIO_A, _currentStatesA);
  	self._write(REGISTER_GPIO_B, _currentStatesB);

  	// set all default pin pull up resistors
  	// (1 = Pull-up enabled.)
  	// (0 = Pull-up disabled.)
  	self._write(REGISTER_GPPU_A, _currentPullupA);
  	self._write(REGISTER_GPPU_B, _currentPullupB);

  	// set all default pin interrupts
  	// (if pin direction is input (1), then enable interrupt for pin)
  	// (1 = Enable GPIO input pin for interrupt-on-change event.)
  	// (0 = Disable GPIO input pin for interrupt-on-change event.)
  	self._write(REGISTER_GPINTEN_A, _currentDirectionA);
  	self._write(REGISTER_GPINTEN_B, _currentDirectionB);

  	// set all default pin interrupt default values
  	// (comparison value registers are not used in this implementation)
  	self._write(REGISTER_DEFVAL_A, 0x00);
  	self._write(REGISTER_DEFVAL_B, 0x00);

  	// set all default pin interrupt comparison behaviors
  	// (1 = Controls how the associated pin value is compared for interrupt-on-change.)
  	// (0 = Pin value is compared against the previous pin value.)
  	self._write(REGISTER_INTCON_A, 0x00);
  	self._write(REGISTER_INTCON_B, 0x00);

  	// reset/clear interrupt flags
  	if (_currentDirectionA > 0) {
    	self._read(REGISTER_INTCAP_A);
  	}

  	if (_currentDirectionB > 0) {
    	self._read(REGISTER_INTCAP_B);
  	}
	
	/**
    * Determines whether or not the current instance has been disposed.
    * @return {Boolean} true if disposed; Otherwise, false.
    * @override
    */
  	this.isDisposed = function() {
		return _base.isDisposed();
	};
	
	 /**
     * Attaches a listener (callback) for the specified event name.
     * @param  {String}   evt      The name of the event.
     * @param  {Function} callback The callback function to execute when the
     * event is raised.
     * @throws {ObjectDisposedException} if this instance has been disposed.
     */
    this.on = function(evt, callback) {
		_base.on(evt, callback); 
	 };
	
	/**
    * Emits the specified event.
    * @param  {String} evt  The name of the event to emit.
    * @param  {Object} args The object that provides arguments to the event.
    * @throws {ObjectDisposedException} if this instance has been disposed.
    */
   this.emit = function(evt, args) {
		_base.emit(evt, args);
	};
	
	/**
     * Fires the pin state change event.
     * @param  {PinStateChangeEvent} psce The event object.
     * @throws {ObjectDisposedException} if this instance has been disposed.
     * @protected
     */
    this.onPinStateChange = function(psce) {
		_base.onPinStateChange(psce); 
	 };
	
	 /**
     * Gets the physical pin being represented by this instance.
     * @return {PiFacePins} The physical pin.
     * @override
     */
    this.getInnerPin = function () {
		return _base.getInnerPin(); 
	 };
	
	 /**
     * Gets the exported pins.
     * @return {Array} A dictionary of exported pins.
     * @override
     */
    this.getExportedPins = function() {
		return _base.getExportedPins(); 
	 };
	
	/**
    * Gets the pin address.
    * @return {Number} The address.
    * @override
    */
   this.address = function() {
		return _base.address();
	};
	
	/**
    * Gets the GPIO pin number.
    * @param  {GpioPins} pin The GPIO pin.
    * @return {Number}       The GPIO pin number.
    * @protected
    */
   this.getGpioPinNumber = function(pin) {
   	return pin.value.toString();
   };

  	/**
    * Sets the state of this pin if on Port A (outputs).
    * @param  {PinState} state The state to set.
    * @throws {IOException} if unable to write to the SPI port.
    * @private
    */
  	var setStateA = function(state) {
    	// determine pin address.
    	var pinAddress = self.getInnerPin().value - GPIO_A_OFFSET;

    	// determine state value for pin bit
    	if (state === PinState.High) {
      	_currentStatesA |= pinAddress;
    	}
    	else {
      	_currentStatesA &= ~pinAddress;
    	}

    	// update state value.
    	self._write(REGISTER_GPIO_A, _currentStatesA);
  	};

  	/**
	 * Sets the state of this pin if on Port B (inputs).
    * @param  {PinState} state The state to set.
    * @throws {IOException} if unable to write to the SPI port.
    * @private
    */
  	var setStateB = function(state) {
    	// determine pin address
    	var pinAddress = self.getInnerPin().value - GPIO_B_OFFSET;

    	// determine state value for pin bit
    	if (state === PinState.High) {
      	_currentStatesB |= pinAddress;
    	}
    	else {
      	_currentStatesB &= ~pinAddress;
    	}

    	// update state value.
    	self._write(REGISTER_GPIO_B, _currentStatesB);
  	};

  	/**
    * Sets the state of this pin.
    * @param  {PinState} state The state to set.
    * @throws {IOException} if unable to write to the SPI port.
    * @private
    */
  	var setState = function(state) {
    	if (_base.state() === state) {
      	return;
    	}

    	_oldState = _base.state();
    	_base.write(state);

    	// determine A or B port based on pin address.
    	if (self.getInnerPin().value < GPIO_B_OFFSET) {
      	setStateA(state);
    	}
    	else {
      	setStateB(state);
    	}
  	};

  	/**
    * Writes the specified state to the pin (set state).
    * @param  {PinState} state The state to set.
    * @throws {ObjectDisposedException} if this instance has been disposed.
    * @throws {IOException} if unable to write to the SPI port.
    * @override
    */
  	this.write = function(state) {
    	if (_base.isDisposed()) {
      	throw new ObjectDisposedException("PiFaceGpioDigital");
    	}
    	_base.write(state);
    	setState(state);
  	};

  	/**
    * Evaluates this pin to see if on Port A, and if so, if it has changed state
    * in comparison to the specified state, then emits the Gpio.EVENT_STATE_CHANGED
    * event if the state has in fact changed.
    * @param  {PinState} state The state to check against.
    * @private
    */
  	var evaluatePinForChangeA = function(state) {
    	if (self.getInnerPin() in self.getExportedPins()) {
      	// determine pin address.
      	var pinAddress = self.getInnerPin().value - GPIO_A_OFFSET;

      	// determine if state changed.
      	if ((state & pinAddress) !== (_currentStatesA & pinAddress)) {
        		// Determine new state value for pin bit.
        		var newState = (state & pinAddress) === pinAddress ? PinState.High : PinState.Low;
        		if (newState === PinState.High) {
          		_currentStatesA |= pinAddress;
        		}
        		else {
          		_currentStatesA &= ~pinAddress;
        		}

        		// change detected for pin.
        		var evt = new PinStateChangeEvent(_oldState, newState, pinAddress);
        		self.onPinStateChange(evt);
      	}
    	}
  	};

  	/**
    * Evaluates this pin to see if on Port B, and if so, if it has changed state
    * in comparison to the specified state, then emits the Gpio.EVENT_STATE_CHANGED
    * event if the state has in fact changed.
    * @param  {PinState} state The state to check against.
    * @private
    */
  	var evaluatePinForChangeB = function(state) {
    	if (self.getInnerPin() in self.getExportedPins()) {
      	// determine pin address.
      	var pinAddress = self.getInnerPin().value - GPIO_B_OFFSET;

      	// determine if state changed.
      	if ((state & pinAddress) !== (_currentStatesB & pinAddress)) {
        		// Determine new state value for pin bit.
        		var newState = (state & pinAddress) === pinAddress ? PinState.High : PinState.Low;
        		if (newState === PinState.High) {
          		_currentStatesB |= pinAddress;
        		}
        		else {
          		_currentStatesB &= ~pinAddress;
        		}

        		// change detected for pin.
        		var evt = new PinStateChangeEvent(_oldState, newState, pinAddress);
        		self.onPinStateChange(evt);
      	}
    	}
  	};

  	/**
    * Sets the mode of this pin on port A.
    * @param  {PinMode} mode The pin mode to set.
    * @throws {IOException} if unable to write to the SPI port.
    * @private
    */
  	var setModeA = function(mode) {
    	var pinAddress = self.getInnerPin().value - GPIO_A_OFFSET;

    	if (mode === PinMode.IN) {
      	_currentDirectionA |= pinAddress;
    	}
    	else if (mode === PinMode.OUT) {
      	_currentDirectionA &= ~pinAddress;
    	}

    	self._write(REGISTER_IODIR_A, _currentDirectionA);

    	self._write(REGISTER_GPINTEN_A, _currentDirectionA);
  	};

  	/**
    * Sets the mode of this pin on port B.
    * @param  {PinMode} mode The pin mode to set.
    * @throws {IOException} if unable to write to the SPI port.
    * @private
    */
  	var setModeB = function(mode) {
    	var pinAddress = self.getInnerPin().value - GPIO_B_OFFSET;

    	if (mode === PinMode.IN) {
      	_currentDirectionB |= pinAddress;
    	}
    	else if (mode === PinMode.OUT) {
      	_currentDirectionB &= ~pinAddress;
    	}

    	self._write(REGISTER_IODIR_B, _currentDirectionB);

    	self._write(REGISTER_GPINTEN_B, _currentDirectionB);
  	};

  	/**
    * Sets the mode of this pin.
    * @param  {PinMode} mode The pin mode to set.
    * @throws {IOException} if unable to write to the SPI port.
    * @throws {ObjectDisposedException} if this instance has been disposed.
    * @override
    * @protected
    */
  	this.setMode = function(mode) {
    	if (_base.isDisposed()) {
      	throw new ObjectDisposedException("PiFaceGpioDigital");
    	}

    	_base.setMode(mode);

    	// determine A or B port based on pin address
    	if (self.getInnerPin().value < GPIO_B_OFFSET) {
      	setModeA(mode);
    	}
    	else {
      	setModeB(mode);
    	}

    	// if any pins are configured as input pins, then we need to start the
    	// interrupt monitoring poll timer.
    	if ((_currentDirectionA > 0) || (_currentDirectionB > 0)) {
      	self.poll();
    	}
    	else {
      	self.cancelPoll();
    	}
  	};

  	/**
    * Exports (caches) the pin.
    * @param  {PinMode} mode The mode to set for the pin when exporting.
    * @throws {ObjectDisposedException} if this instance has been disposed.
    * @override
    */
  	this.export = function(mode) {
    	_base.export();
    	self.setMode(mode);
  	};

  	/**
    * Unexports (removes from cache) the pin.
    * @throws {ObjectDisposedException} if this instance has been disposed.
    * @override
    */
  	this.unexport = function() {
    	_base.unexport();
    	self.setMode(PinMode.OUT);
  	};

  	/**
    * Provisions the I/O pin.
    * @throws {ObjectDisposedException} if this instance has been disposed.
    * @override
    */
  	this.provision = function() {
    	self.export(self.mode);
    	self.write(_initialValue);
  	};

  	/**
    * Cancels an input poll cycle (if running) started by poll() or setMode().
    */
  	this.cancelPoll = function() {
    	if (_shuttingDown) {
      	return;
    	}

    	_shuttingDown = true;
    	if (!util.isNullOrUndefined(_pollTimer)) {
      	clearInterval(_pollTimer);
      	_pollTimer = null;
    	}
  	};

  	/**
    * The background (asynchronous) poll cycle routine. This is the callback
    * executed by the timer started by poll().
    * @throws {IOException}
    * @private
    */
  	var backgroundPoll = function() {
    	if (_shuttingDown) {
      	return;
    	}

    	// only process for interrupts if a pin on port A is configured as an input pin.
    	var pin = null;
    	var pinInterruptState = -1;
    	if (_currentDirectionA > 0) {
      	// process interrupts for port A.
      	var pinInterruptA = self._read(REGISTER_INTF_A);

      	// validate that there is at least one interrupt active on port A.
      	if (pinInterruptA > 0) {
        		// read the current pin states on port A.
        		pinInterruptState = self._read(REGISTER_GPIO_A);

        		// loop over the available pins on port B.
        		var pinAddressA = -1;
        		for (var i = 0; i < PiFaceGPIO.OUTPUTS.length; i++) {
          		pin = PiFaceGPIO.OUTPUTS[i];
          		pinAddressA = pin.value - GPIO_A_OFFSET;

          		// is there an interrupt flag on this pin?
          		evaluatePinForChangeA(pin, pinInterruptState);
        		}
      	}
    	}

    	// only process for interrupts if a pin on port B is configured as an input pin.
    	if (_currentDirectionB > 0) {
      	// process interrupts for port B.
      	var pinInterruptB = self._read(REGISTER_INTF_B);

      	// validate that there is at least one interrupt active on port B.
      	if (pinInterruptB > 0) {
        		// read the current pin states on port B.
        		pinInterruptState = self._read(REGISTER_GPIO_B);

        		// loop over the available pins on port B
        		var pinAddressB = -1;
        		for (var j = 0; j < PiFaceGPIO.INPUTS.length; j++) {
          		pin = PiFaceGPIO.INPUTS[j];
          		pinAddressB = pin.value - GPIO_B_OFFSET;

          		// is there an interrupt flag on this pin?
          		evaluatePinForChangeB(pin, pinInterruptState);
        		}
      	}
    	}
  	};

  	/**
    * Starts a pin poll cycle. This will monitor the pin and check for state
    * changes. If a state change is detected, the Gpio.EVENT_STATE_CHANGED event
    * will be emitted. The poll cycle runs asynchronously until stopped by the
    * cancelPoll() method or when this object instance is disposed.
    * @throws {ObjectDisposedException} if this instance has been disposed.
    */
  	this.poll = function() {
    	if (_base.isDisposed()) {
      	throw new ObjectDisposedException("PiFaceGpioDigital");
    	}
    	_shuttingDown = false;
    	_pollTimer = setInterval(backgroundPoll, 50);
  	};

  	/**
    * Sets the pin pull-up/down resistance for Port A.
    * @param  {PinPullResistance} resistance The pin pull resistance flag to set.
    * Can enable the internal pull-up or pull-down resistor, or disable it.
    * @throws {IOException} if unable to write to the SPI port.
    * @private
    */
  	var setPullResistanceA = function(resistance) {
    	var pinAddress = self.getInnerPin().value - GPIO_A_OFFSET;

    	if (resistance.value === PinPullResistance.PULL_UP.value) {
      	_currentPullupA |= pinAddress;
    	}
    	else {
      	_currentPullupA &= ~pinAddress;
    	}

    	self._write(REGISTER_GPPU_A, _currentPullupA);
  	};

  	/**
    * Sets the pin pull-up/down resistance for Port B.
    * @param {PinPullResistance} resistance The pin pull resistance flag to set.
    * Can enable the internal pull-up or pull-down resistor, or disable it.
    * @throws {IOException} if unable to write to the SPI port.
    * @private
    */
  	var setPullResistanceB = function(resistance) {
    	var pinAddress = self.getInnerPin().value - GPIO_B_OFFSET;

    	if (resistance.value === PinPullResistance.PULL_UP.value) {
      	_currentPullupB |= pinAddress;
    	}
    	else {
      	_currentPullupB &= ~pinAddress;
    	}

    	self._write(REGISTER_GPPU_B, _currentPullupB);
  	};

  	/**
    * Enables/disables pin pull-up/down internal resistor.
    * @param {PinPullResistance} resistance The pin pull resistance flag to set.
    * Can enable the internal pull-up or pull-down resistor, or disable it.
    * @throws {ObjectDisposedException} if this instance has been disposed.
    * @throws {IOException} if unable to write to the SPI port.
    */
  	this.setPullResistance = function(resistance) {
    	if (_pullResistance.value === resistance.value) {
      	return;
    	}

    	if (self.isDisposed()) {
      	throw new ObjectDisposedException("PiFaceGpioDigital");
    	}

    	_pullResistance = resistance;
    	if (self.getInnerPin().value < GPIO_B_OFFSET) {
      	setPullResistanceA(resistance);
    	}
    	else {
      	setPullResistanceB(resistance);
    	}
  	};

  	/**
    * Gets the pin pull-up/down resistance.
    * @return {PinPullResistance} The pin pull-up/down resistance.
    */
  	this.getPullResistance = function() {
    	return _pullResistance;
  	};

  	/**
    * Reads a value from the pin.
    * @return {Number} A single byte read from the pin.
    * @throws {IOException} if unable to read from the SPI port.
    */
  	this.read = function() {
    	if (self.getInnerPin().value < GPIO_B_OFFSET) {
      	return self._read(REGISTER_GPIO_A);
    	}
    	return self._read(REGISTER_GPIO_B);
  	};

  	/**
    * Gets the state of the pin if on Port A.
    * @return {PinState} The state of the pin.
    * @throws {IOException} if unable to read from the SPI port.
    * @private
    */
  	var getStateA = function() {
    	var pinAddress = self.getInnerPin().value - GPIO_A_OFFSET;
    	var state = (_currentStatesA & pinAddress) === pinAddress ? PinState.High : PinState.Low;
    	_base.write(state);
    	return state;
  	};

  	/**
    * Gets the state of the pin if on Port B.
    * @return {PinState} The state of the pin.
    * @throws {IOException} if unable to read from the SPI port.
    * @private
    */
  	var getStateB = function() {
    	var pinAddress = self.getInnerPin().value - GPIO_B_OFFSET;
    	var state = (_currentStatesB & pinAddress) === pinAddress ? PinState.High : PinState.Low;
    	_base.write(state);
    	return state;
  	};

  	/**
    * Gets the state of the pin.
    * @return {PinState} The state of the pin.
    * @throws {ObjectDisposedException} if this instance has been disposed.
    * @throws {IOException} if unable to read from the SPI port.
    * @override
    */
  	this.state = function() {
    	if (self.isDisposed()) {
      	throw new ObjectDisposedException("PiFaceGpioDigital");
    	}

    	var result = _base.state();
    	if (self.getInnerPin().value < GPIO_B_OFFSET) {
      	result = getStateA();
    	}
    	else {
      	result = getStateB();
    	}

    	return result;
  	};

  	/**
    * Releases all resources used by the PiFaceGpioDigital object.
    * @override
    */
  	this.dispose = function() {
    	if (_base.isDisposed()) {
      	return;
    	}

    	self.cancelPoll();
    	self.unexport();
    	_spi = undefined;
    	_base.dispose();
  	};
}

PiFaceGpioDigital.prototype.constructor = PiFaceGpioDigital;
inherits(PiFaceGpioDigital, PiFaceGpioBase);

/**
 * Bus address 0.
 * @type {Number}
 * @const
 */
PiFaceGpioDigital.ADDRESS_0 = ADDR_0;

/**
 * Bus address 1.
 * @type {Number}
 * @const
 */
PiFaceGpioDigital.ADDRESS_1 = ADDR_1;

/**
 * Bus address 2.
 * @type {Number}
 * @const
 */
PiFaceGpioDigital.ADDRESS_2 = ADDR_2;

/**
 * Bus address 3.
 * @type {Number}
 * @const
 */
PiFaceGpioDigital.ADDRESS_3 = ADDR_3;

/**
 * Default bus address (ADDRESS_0).
 * @type {Number}
 * @const
 */
PiFaceGpioDigital.DEFAULT_ADDRESS = DEF_ADDR;

/**
 * The clock speed to transfer at (1MHz).
 * @type {Number}
 * @const
 */
PiFaceGpioDigital.SPI_SPEED = BUS_SPEED;

/**
 * The write operation flag.
 * @type {Number}
 * @const
 */
PiFaceGpioDigital.WRITE_FLAG = WRT_FLAG;

/**
 * The read operation flag.
 * @type {Number}
 * @const
 */
PiFaceGpioDigital.READ_FLAG = RD_FLAG;

module.exports = PiFaceGpioDigital;
