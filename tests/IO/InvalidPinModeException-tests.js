'use strict';

const InvalidPinModeException = require('../../src/lib/IO/InvalidPinModeException.js');
const Gpio = require('../../src/lib/IO/Gpio.js');
const GpioPins = require('../../src/lib/IO/GpioPins.js');
const PinMode = require('../../src/lib/IO/PinMode.js');
const PinState = require('../../src/lib/IO/PinState.js');

class FakeGpio extends Gpio {
    constructor(pin) {
        super();

        this._pin = pin || GpioPins.GPIO_NONE;
        this._mode = PinMode.OUT;
        this._pinName = this._pin.name;
    }

    get pinName() {
        return this._pinName;
    }

    set pinName(name) {
        this._pinName = name;
    }


    get address() {
        return this._pin.value;
    }

    read() {
        if (this._mode !== PinMode.IN) {
            throw new InvalidPinModeException("Pin must be configured as an input.", this);
        }
        return PinState.High;
    }
}

module.exports.InvalidPinModeExceptionTests = {
  testThrow: function(assert) {
    let pinAddr = -1;
    let result = false;
    let fg = new FakeGpio(GpioPins.GPIO01);

    try {
      fg.read();
    }
    catch (e) {
      result = ((e.name === 'InvalidPinModeException')  &&
                (e instanceof InvalidPinModeException));
      pinAddr = e.pin.address;
    }

    assert.expect(2);
    assert.ok(result, "Exception thrown is not of type InvalidPinModeException");
    assert.equals(pinAddr, GpioPins.GPIO01.value, "Pin address is not 1");
    assert.done();
  }
};
