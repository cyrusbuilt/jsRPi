'use strict';

var util = require('util');
var inherits = require('util').inherits;
var GpioBase = require('../../../src/lib/IO/GpioBase.js');
var GpioPins = require('../../../src/lib/IO/GpioPins.js');
var PinMode = require('../../../src/lib/IO/PinMode.js');
var PinState = require('../../../src/lib/IO/PinState.js');
var PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
var MotionSensor = require('../../../src/lib/Components/Sensors/MotionSensor.js');
var MotionSensorComponent = require('../../../src/lib/Components/Sensors/MotionSensorComponent.js');


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


module.exports.MotionSensorComponentTests = {
  disposeAndIsDisposedTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    var sensor = new MotionSensorComponent(fakePin);

    assert.expect(2);
    assert.ok(!sensor.isDisposed(), "Sensor already disposed");

    sensor.dispose();
    assert.ok(sensor.isDisposed(), "Sensor did not dispose");
    assert.done();
  },
  setHasPropertyTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    var sensor = new MotionSensorComponent(fakePin);
    sensor.setProperty("foo", "bar");

    assert.expect(1);
    assert.ok(sensor.hasProperty("foo"), "Sensor does not have property 'foo'");
    assert.done();
  },
  pollIsPollingTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    var sensor = new MotionSensorComponent(fakePin);

    assert.expect(2);
    assert.ok(!sensor.isPolling(), "Sensor is alrady polling");

    sensor.poll();
    assert.ok(sensor.isPolling(), "Sensor is not polling");

    sensor.interruptPoll();
    assert.done();
  },
  isMotionDetectedTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    var sensor = new MotionSensorComponent(fakePin);

    assert.expect(2);
    assert.ok(!sensor.isMotionDetected(), "Motion was detected");

    fakePin.write(PinState.High);
    assert.ok(sensor.isMotionDetected(), "Motion was not detected");
    assert.done();
  },
  motionDetetedEventTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    var sensor = new MotionSensorComponent(fakePin);
    sensor.on(MotionSensor.EVENT_MOTION_STATE_CHANGED, function(stateChanged) {
      assert.expect(2);
      assert.ok(stateChanged.isMotionDetected(), "Motion not detected");

      var tsLastCheck = sensor.getLastMotionTimestamp();
      var tsStateChange = stateChanged.getTimestamp();
      if (!util.isNullOrUndefined(tsLastCheck)) {
        assert.equals(tsLastCheck.getTime(), tsStateChange.getTime(), "Timestamps do not match");
      }

      assert.done();
    });

    sensor.poll();
    fakePin.write(PinState.High);

    setTimeout(function() {
      sensor.interruptPoll();
    }, 225);
  }
};
