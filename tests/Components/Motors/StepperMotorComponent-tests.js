'use strict';

var util = require('util');
var inherits = require('util').inherits;
var GpioBase = require('../../../src/lib/IO/GpioBase.js');
var GpioPins = require('../../../src/lib/IO/GpioPins.js');
var PinMode = require('../../../src/lib/IO/PinMode.js');
var PinState = require('../../../src/lib/IO/PinState.js');
var PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
var StepperMotorComponent = require('../../../src/lib/Components/Motors/StepperMotorComponent.js');
var MotorState = require('../../../src/lib/Components/Motors/MotorState.js');
var Motor = require('../../../src/lib/Components/Motors/Motor.js');

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

function createPins() {
  var controlPins = [
    new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low),
    new FakeGpio(GpioPins.GPIO04, PinMode.OUT, PinState.Low),
    new FakeGpio(GpioPins.GPIO07, PinMode.OUT, PinState.Low)
  ];
  return controlPins;
}


module.exports.StepperMotorComponentTests = {
  disposeAndIsDisposedTest: function(assert) {
    var pins = createPins();
    var stepper = new StepperMotorComponent(pins);

    assert.expect(2);
    assert.ok(!stepper.isDisposed(), "Stepper is already disposed");

    stepper.dispose();
    assert.ok(stepper.isDisposed(), "Stepper is not disposed");
    assert.done();
  },
  getSetStateTest: function(assert) {
    var pins = createPins();
    var stepper = new StepperMotorComponent(pins);

    assert.expect(2);
    assert.equals(stepper.getState(), MotorState.Stop, "Stepper is not stopped");

    stepper.setState(MotorState.Forward);
    assert.equals(stepper.getState(), MotorState.Forward, "Stepper is not moving forward");
    assert.done();
  },
  isStateTest: function(assert) {
    var pins = createPins();
    var stepper = new StepperMotorComponent(pins);
    stepper.setState(MotorState.Reverse);

    assert.expect(1);
    assert.ok(stepper.isState(MotorState.Reverse), "Stepper is not reversed");
    assert.done();
  },
  isStoppedTest: function(assert) {
    var pins = createPins();
    var stepper = new StepperMotorComponent(pins);

    // Stepper default init state is MotorState.Stop.
    assert.expect(1);
    assert.ok(stepper.isStopped(), "Stepper is not stopped");
    assert.done();
  },
  getSetStepsPerRevolutionTest: function(assert) {
    var pins = createPins();
    var stepper = new StepperMotorComponent(pins);

    assert.expect(2);
    assert.equals(stepper.getStepsPerRevolution(), 0, "Steps per revolution is non-zero");

    stepper.setStepsPerRevolution(5);
    assert.equals(stepper.getStepsPerRevolution(), 5, "Steps per revolution is not 5");
    assert.done();
  },
  getSetStepIntervalTest: function(assert) {
    var pins = createPins();
    var stepper = new StepperMotorComponent(pins);
    stepper.setStepInterval(500, 5000);

    assert.expect(2);
    assert.equals(stepper.getStepIntervalNanos(), 5000, "Nanos interval should be 5000");
    assert.equals(stepper.getStepIntervalMillis(), 500, "Millis interval should be 500");
    assert.done();
  },
  stopTest: function(assert) {
    var pins = createPins();
    var stepper = new StepperMotorComponent(pins);
    stepper.setState(MotorState.Forward);

    assert.expect(2);
    assert.ok(!stepper.isStopped(), "Motor is already stopped");

    stepper.stop();
    assert.ok(stepper.isStopped(), "Motor did not stop");
    assert.done();
  },
  forwardTest: function(assert) {
    var pins = createPins();
    var stepper = new StepperMotorComponent(pins);

    assert.expect(2);
    assert.ok(stepper.isStopped(), "Motor is not stopped");

    stepper.forward(300);
    assert.ok(stepper.isState(MotorState.Forward), "Motor is not going forward");
    assert.done();
  },
  reverseTest: function(assert) {
    var pins = createPins();
    var stepper = new StepperMotorComponent(pins);

    assert.expect(2);
    assert.ok(stepper.isStopped(), "Motor is not stopped");

    stepper.reverse(300);
    assert.ok(stepper.isState(MotorState.Reverse), "Motor is not reversed");
    assert.done();
  }
  // TODO Need to devise tests for rotate() and step()
};
