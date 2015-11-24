'use strict';

var util = require('util');
var inherits = require('util').inherits;
var GpioBase = require('../../../src/lib/IO/GpioBase.js');
var GpioPins = require('../../../src/lib/IO/GpioPins.js');
var PinMode = require('../../../src/lib/IO/PinMode.js');
var PinState = require('../../../src/lib/IO/PinState.js');
var PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
var Light = require('../../../src/lib/Components/Lights/Light.js');
var DimmableLightComponent = require('../../../src/lib/Components/Lights/DimmableLightComponent.js');

function FakeGpio(pin, mode, value) {
  GpioBase.call(this, pin, mode, value);

  var self = this;
  var _overriddenState = value;
  var _pwm = 0;
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

  this.setPWM = function(pwm) {
    _pwm = pwm || 0;
  };

  this.getPWM = function() {
    return _pwm;
  };
}

FakeGpio.prototype.constructor = FakeGpio;
inherits(GpioBase, FakeGpio);


module.exports.DimmableLightComponentTests = {
  disposeAndIsDisposedTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.PWM, PinState.Low);
    var testLight = new DimmableLightComponent(fakePin, 0, 100);

    assert.expect(2);
    assert.ok(!testLight.isDisposed(), "Light is already disposed.");

    testLight.dispose();
    assert.ok(testLight.isDisposed(), "Light is not disposed");
    assert.done();
  },
  setLevelTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.PWM, PinState.Low);
    var testLight = new DimmableLightComponent(fakePin, 0, 100);

    assert.expect(2);
    assert.equals(testLight.getLevel(), 0, "Test light level is non-zero: " + testLight.getLevel());

    testLight.setLevel(56);
    assert.equals(testLight.getLevel(), 56, "Test light level is " + testLight.getLevel() + ", should be 56");
    assert.done();
  },
  turnOnTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.PWM, PinState.Low);
    var testLight = new DimmableLightComponent(fakePin, 0, 100);

    assert.expect(2);
    assert.ok(!testLight.isOn(), "Test light is already on");

    testLight.turnOn();
    assert.ok(testLight.isOn(), "The light is still off");
    assert.done();
  },
  turnOffTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.PWM, PinState.Low);
    var testLight = new DimmableLightComponent(fakePin, 0, 100);

    testLight.turnOn();
    assert.expect(2);
    assert.ok(!testLight.isOff(), "Light is still off");

    testLight.turnOff();
    assert.ok(testLight.isOff(), "Light is still on");
    assert.done();
  },
  stateChangeTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.PWM, PinState.Low);
    var testLight = new DimmableLightComponent(fakePin, 0, 100);
    testLight.on(Light.EVENT_STATE_CHANGED, function(stateChanged) {
      assert.expect(1);
      assert.ok(stateChanged.isOn(), "The light did not turn on");
      assert.done();
    });

    testLight.turnOn();
  },
  levelChangeTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.PWM, PinState.Low);
    var testLight = new DimmableLightComponent(fakePin, 0, 100);
    testLight.on(Light.EVENT_LEVEL_CHANGED, function(levelChanged) {
      assert.expect(1);
      assert.equals(levelChanged.getLevel(), 56, "Light level: " + levelChanged.getLevel() + ", should be 56");
      assert.done();
    });

    testLight.setLevel(56);
  },
  getLevelPercentageTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.PWM, PinState.Low);
    var testLight = new DimmableLightComponent(fakePin, 0, 100);
    testLight.setLevel(23);
    assert.expect(1);
    assert.equals(testLight.getLevelPercentage(), 23, "Level percentage: " + testLight.getLevelPercentage() + ", should be 23");
    assert.done();
  }
};
