'use strict';

var util = require('util');
var inherits = require('util').inherits;
var GpioBase = require('../../../src/lib/IO/GpioBase.js');
var GpioPins = require('../../../src/lib/IO/GpioPins.js');
var PinMode = require('../../../src/lib/IO/PinMode.js');
var PinState = require('../../../src/lib/IO/PinState.js');
var PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
var BuzzerComponent = require('../../../src/lib/Components/Buzzers/BuzzerComponent');


function FakeGpio(pin, mode, value) {
  GpioBase.call(this, pin, mode, value);

  var self = this;
  var _pwmRange = 0;
  var _pwm = 0;
  var _overriddenState = value;
  if (util.isNullOrUndefined(_overriddenState)) {
    _overriddenState = PinState.Low;
  }

  this.getPWM = function() {
    return _pwm;
  };

  this.setPWM = function(pwm) {
    _pwm = pwm;
  };

  this.getPWMRange = function() {
    return _pwmRange;
  };

  this.setPWMRange = function(range) {
    _pwmRange = range;
  };

  this.read = function() {
    return _overriddenState;
  };

  this.write = function(ps) {
    if (_overriddenState !== ps) {
      var addr = pin.value;
      var evt = new PinStateChangeEvent(_overriddenState, ps, addr);
      _overriddenState = ps;
      self.onPinStateChange(evt);
    }
  };
}

FakeGpio.prototype.constructor = FakeGpio;
inherits(GpioBase, FakeGpio);


module.exports.BuzzerComponentTests = {
  testDisposeAndIsDisposed: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.PWM, PinState.Low);
    var fakeBuzzer = new BuzzerComponent(fakePin);

    assert.expect(2);
    assert.ok(!fakeBuzzer.isDisposed(), "Buzzer is disposed");

    fakeBuzzer.dispose();
    assert.ok(fakeBuzzer.isDisposed(), "Buzzer is not disposed");
    assert.done();
  },
  testBuzz: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.PWM, PinState.Low);
    var fakeBuzzer = new BuzzerComponent(fakePin);

    assert.expect(3);
    assert.ok(!fakeBuzzer.isBuzzing(), "Buzzer is already buzzing");

    fakeBuzzer.buzz(300, 500);
    assert.ok(fakeBuzzer.isBuzzing(), "Buzzer is not buzzing");

    fakeBuzzer.stop();
    assert.ok(!fakeBuzzer.isBuzzing(), "Buzzer is still buzzing");
    assert.done();
  }
};
