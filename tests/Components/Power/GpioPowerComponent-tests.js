'use strict';

var util = require('util');
var inherits = require('util').inherits;
var GpioBase = require('../../../src/lib/IO/GpioBase.js');
var GpioPins = require('../../../src/lib/IO/GpioPins.js');
var PinMode = require('../../../src/lib/IO/PinMode.js');
var PinState = require('../../../src/lib/IO/PinState.js');
var PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
var GpioPowerComponent = require('../../../src/lib/Components/Power/GpioPowerComponent.js');
var PowerState = require('../../../src/lib/Components/Power/PowerState.js');
var PowerInterface = require('../../../src/lib/Components/Power/PowerInterface.js');

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


module.exports.GpioPowerComponentTests = {
  disposeAndIsDisposedTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    var p = new GpioPowerComponent(fakePin, PinState.High, PinState.Low);

    assert.expect(2);
    assert.ok(!p.isDisposed(), "Power component already disposed");

    p.dispose();
    assert.ok(p.isDisposed(), "Power component did not dispose");
    assert.done();
  },
  getStateStateTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    var p = new GpioPowerComponent(fakePin, PinState.High, PinState.Low);

    assert.expect(2);
    assert.equals(p.getState(), PowerState.Off, "Power state is not off");

    p.setState(PowerState.On);
    assert.equals(p.getState(), PowerState.On, "Power state is not on");
    assert.done();
  },
  turnOnTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    var p = new GpioPowerComponent(fakePin, PinState.High, PinState.Low);

    assert.expect(2);
    assert.ok(!p.isOn(), "Power component is already on");

    p.turnOn();
    assert.ok(p.isOn(), "Power component did not turn on");
    assert.done();
  },
  turnOffTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    var p = new GpioPowerComponent(fakePin, PinState.High, PinState.Low);
    p.turnOn();  // Default state on init is PowerState.Off

    assert.expect(2);
    assert.ok(!p.isOff(), "Power component is not on");

    p.turnOff();
    assert.ok(p.isOff(), "Power component did not turn off");
    assert.done();
  },
  stateChangeTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    var p = new GpioPowerComponent(fakePin, PinState.High, PinState.Low);
    p.on(PowerInterface.EVENT_STATE_CHANGED, function(stateChanged) {
      assert.expect(2);
      assert.equals(stateChanged.getOldState(), PowerState.Off, "Old state is not off");
      assert.equals(stateChanged.getNewState(), PowerState.On, "New state is not on");
      assert.done();
    });

    p.turnOn();
  }
};
