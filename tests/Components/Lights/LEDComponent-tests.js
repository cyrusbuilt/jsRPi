'use strict';

var util = require('util');
var inherits = require('util').inherits;
var GpioBase = require('../../../src/lib/IO/GpioBase.js');
var GpioPins = require('../../../src/lib/IO/GpioPins.js');
var PinMode = require('../../../src/lib/IO/PinMode.js');
var PinState = require('../../../src/lib/IO/PinState.js');
var PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
var Light = require('../../../src/lib/Components/Lights/Light.js');
var LEDComponent = require('../../../src/lib/Components/Lights/LEDComponent.js');

function FakeGpio(pin, mode, value) {
  GpioBase.call(this, pin, mode, value);

  var self = this;
  var _overriddenState = value;
  if (util.isNullOrUndefined(_overriddenState)) {
    _overriddenState = PinState.Low;
  }

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


module.exports.LEDComponentTests = {
  disposeAndIsDisposedTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    var testLED = new LEDComponent(fakePin);

    assert.expect(2);
    assert.ok(!testLED.isDisposed(), "LED is already disposed");

    testLED.dispose();
    assert.ok(testLED.isDisposed(), "LED did not dispose");
    assert.done();
  },
  turnOnTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    var testLED = new LEDComponent(fakePin);

    assert.expect(2);
    assert.ok(!testLED.isOn(), "The LED is already on");

    testLED.turnOn();
    assert.ok(testLED.isOn(), "LED did not turn on");
    assert.done();
  },
  turnOffTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    var testLED = new LEDComponent(fakePin);

    assert.expect(3);
    assert.ok(testLED.isOff(), "LED is already on");

    testLED.turnOn();
    assert.ok(!testLED.isOff(), "LED is still on");

    testLED.turnOff();
    assert.ok(testLED.isOff(), "LED did not turn back off");
    assert.done();
  },
  stateChangeTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    var testLED = new LEDComponent(fakePin);

    testLED.on(Light.EVENT_STATE_CHANGED, function(changeEvent) {
      assert.expect(1);
      assert.ok(changeEvent.isOn(), "LED did not turn on");
      assert.done();
    });

    testLED.turnOn();
  }
};
