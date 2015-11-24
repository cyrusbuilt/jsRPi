'use strict';

var util = require('util');
var inherits = require('util').inherits;
var GpioBase = require('../../../src/lib/IO/GpioBase.js');
var GpioPins = require('../../../src/lib/IO/GpioPins.js');
var PinMode = require('../../../src/lib/IO/PinMode.js');
var PinState = require('../../../src/lib/IO/PinState.js');
var PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
var LightComponent = require('../../../src/lib/Components/Lights/LightComponent.js');
var Light = require('../../../src/lib/Components/Lights/Light.js');

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
inherits(FakeGpio, GpioBase);

module.exports.LightComponentTests = {
  disposeAndIsDisposedTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    var testLight = new LightComponent(fakePin);

    assert.expect(2);
    assert.ok(!testLight.isDisposed(), "Light is already disposed.");

    testLight.dispose();
    assert.ok(testLight.isDisposed(), "Light is not disposed");
    assert.done();
  },
  lightOnTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    var testLight = new LightComponent(fakePin);

    assert.expect(2);
    assert.ok(!testLight.isOn(), "Light is already on");

    testLight.turnOn();
    assert.ok(testLight.isOn(), "Light did not turn on");
    assert.done();
  },
  lightOffTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    var testLight = new LightComponent(fakePin);

    assert.expect(2);
    assert.ok(testLight.isOff(), "Light is already on");

    testLight.turnOn();
    assert.ok(!testLight.isOff(), "Light did not turn on");
    assert.done();
  },
  lightStateChangeTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    var testLight = new LightComponent(fakePin);
    testLight.on(Light.EVENT_STATE_CHANGED, function(changeEvent) {
      assert.expect(1);
      assert.ok(changeEvent.isOn(), "Light did not turn on");
      assert.done();
    });

    testLight.turnOn();
  }
};
