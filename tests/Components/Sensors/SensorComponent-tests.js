'use strict';

var util = require('util');
var inherits = require('util').inherits;
var GpioBase = require('../../../src/lib/IO/GpioBase.js');
var GpioPins = require('../../../src/lib/IO/GpioPins.js');
var PinMode = require('../../../src/lib/IO/PinMode.js');
var PinState = require('../../../src/lib/IO/PinState.js');
var PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
var SensorComponent = require('../../../src/lib/Components/Sensors/SensorComponent.js');
var SensorState = require('../../../src/lib/Components/Sensors/SensorState.js');
var Sensor = require('../../../src/lib/Components/Sensors/Sensor.js');
   

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


module.exports.SensorComponentTests = {
  disposeAndIsDisposedTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    var sc = new SensorComponent(fakePin);

    assert.expect(2);
    assert.ok(!sc.isDisposed(), "Sensor is already disposed");

    sc.dispose();
    assert.ok(sc.isDisposed(), "Sensor did not dispose");
    assert.done();
  },
  setHasPropertyTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    var sc = new SensorComponent(fakePin);
    sc.setProperty("foo", "bar");

    assert.expect(1);
    assert.ok(sc.hasProperty("foo"), "Property 'foo' not found");
    assert.done();
  },
  getStateTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    var sc = new SensorComponent(fakePin);

    assert.expect(1);
    assert.equals(sc.getState(), SensorState.Open, "Sensor still closed");
    assert.done();
  },
  isStateTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    var sc = new SensorComponent(fakePin);

    assert.expect(1);
    assert.ok(sc.isState(SensorState.Open), "Sensor closed");
    assert.done();
  },
  isOpenTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    var sc = new SensorComponent(fakePin);

    assert.expect(1);
    assert.ok(sc.isOpen(), "Sensor closed");
    assert.done();
  },
  isClosedTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    var sc = new SensorComponent(fakePin);
    fakePin.write(PinState.High);

    assert.expect(1);
    assert.ok(sc.isClosed(), "Sensor still open");
    assert.done();
  },
  pollTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    var sc = new SensorComponent(fakePin);

    assert.expect(2);
    assert.ok(!sc.isPolling(), "Sensor is already polling");

    sc.poll();
    assert.ok(sc.isPolling(), "Sensor poll did not start");

    sc.interruptPoll();
    assert.done();
  },
  stateChangeTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    var sc = new SensorComponent(fakePin);
    sc.on(Sensor.EVENT_STATE_CHANGED, function(changeEvent) {
      assert.expect(2);
      assert.equals(changeEvent.getOldState(), SensorState.Open, "Old state not open");
      assert.equals(changeEvent.getNewState(), SensorState.Closed, "New state not closed");
      assert.done();
    });

    sc.poll();
    fakePin.write(PinState.High);

    setTimeout(function() {
      sc.interruptPoll();
    }, 600);
  }
};
