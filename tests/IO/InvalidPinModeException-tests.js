'use strict';

var inherits = require('util').inherits;
var InvalidPinModeException = require('../../src/lib/IO/InvalidPinModeException.js');
var Gpio = require('../../src/lib/IO/Gpio.js');
var GpioPins = require('../../src/lib/IO/GpioPins.js');
var PinMode = require('../../src/lib/IO/PinMode.js');
var PinState = require('../../src/lib/IO/PinState.js');

function FakeGpio(pin) {
  Gpio.call(this);

  var self = this;
  var _pin = pin || GpioPins.GPIO_NONE;
  var _mode = PinMode.OUT;

  this.pinName = _pin.name;

  this.address = function() {
    return _pin.value;
  };

  this.read = function() {
    if (_mode !== PinMode.IN) {
      throw new InvalidPinModeException(this, "Pin must be configured as an input.");
    }
    return PinState.High;
  };
}

module.exports.InvalidPinModeExceptionTests = {
  testThrow: function(assert) {
    var pinAddr = -1;
    var result = false;
    var fg = new FakeGpio(GpioPins.GPIO01);

    try {
      fg.read();
    }
    catch (e) {
      result = ((e.name === 'InvalidPinModeException')  &&
                (e instanceof InvalidPinModeException));
      pinAddr = e.getPin().address();
    }

    assert.expect(2);
    assert.ok(result, "Exception thrown is not of type InvalidPinModeException");
    assert.equals(pinAddr, GpioPins.GPIO01.value, "Pin address is not 1");
    assert.done();
  }
};
