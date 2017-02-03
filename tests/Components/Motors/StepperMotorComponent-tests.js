'use strict';

const util = require('util');
const GpioBase = require('../../../src/lib/IO/GpioBase.js');
const GpioPins = require('../../../src/lib/IO/GpioPins.js');
const PinMode = require('../../../src/lib/IO/PinMode.js');
const PinState = require('../../../src/lib/IO/PinState.js');
const PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
const StepperMotorComponent = require('../../../src/lib/Components/Motors/StepperMotorComponent.js');
const MotorState = require('../../../src/lib/Components/Motors/MotorState.js');
const Motor = require('../../../src/lib/Components/Motors/Motor.js');


class FakeGpio extends GpioBase {
    constructor(pin, mode, value) {
        super(pin, mode, value);

        this._overriddenState = value;
        if (util.isNullOrUndefined(this._overriddenState)) {
            this._overriddenState = PinState.Low;
        }
    }

    read() {
        return this._overriddenState;
    }

    write(ps) {
        if (this._overriddenState !== ps) {
            let addr = this.innerPin.value;
            let evt = new PinStateChangeEvent(this._overriddenState, ps, addr);
            this._overriddenState = ps;
            this.onPinStateChange(evt);
        }
    }
}


const createPins = function() {
  let controlPins = [
    new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low),
    new FakeGpio(GpioPins.GPIO04, PinMode.OUT, PinState.Low),
    new FakeGpio(GpioPins.GPIO07, PinMode.OUT, PinState.Low)
  ];
  return controlPins;
};


module.exports.StepperMotorComponentTests = {
  disposeAndIsDisposedTest: function(assert) {
    let pins = createPins();
    let stepper = new StepperMotorComponent(pins);

    assert.expect(2);
    assert.ok(!stepper.isDisposed, "Stepper is already disposed");

    stepper.dispose();
    assert.ok(stepper.isDisposed, "Stepper is not disposed");
    assert.done();
  },
  getSetStateTest: function(assert) {
    let pins = createPins();
    let stepper = new StepperMotorComponent(pins);

    assert.expect(2);
    assert.equals(stepper.state, MotorState.Stop, "Stepper is not stopped");

    stepper.state = MotorState.Forward;
    assert.equals(stepper.state, MotorState.Forward, "Stepper is not moving forward");
    assert.done();
  },
  isStateTest: function(assert) {
    let pins = createPins();
    let stepper = new StepperMotorComponent(pins);
    stepper.state = MotorState.Reverse;

    assert.expect(1);
    assert.ok(stepper.isState(MotorState.Reverse), "Stepper is not reversed");
    assert.done();
  },
  isStoppedTest: function(assert) {
    let pins = createPins();
    let stepper = new StepperMotorComponent(pins);

    // Stepper default init state is MotorState.Stop.
    assert.expect(1);
    assert.ok(stepper.isStopped, "Stepper is not stopped");
    assert.done();
  },
  getSetStepsPerRevolutionTest: function(assert) {
    let pins = createPins();
    let stepper = new StepperMotorComponent(pins);

    assert.expect(2);
    assert.equals(stepper.stepsPerRevolution, 0, "Steps per revolution is non-zero");

    stepper.stepsPerRevolution = 5;
    assert.equals(stepper.stepsPerRevolution, 5, "Steps per revolution is not 5");
    assert.done();
  },
  getSetStepIntervalTest: function(assert) {
    let pins = createPins();
    let stepper = new StepperMotorComponent(pins);
    stepper.setStepInterval(500, 5000);

    assert.expect(2);
    assert.equals(stepper.stepIntervalNanos, 5000, "Nanos interval should be 5000");
    assert.equals(stepper.stepIntervalMillis, 500, "Millis interval should be 500");
    assert.done();
  },
  stopTest: function(assert) {
    let pins = createPins();
    let stepper = new StepperMotorComponent(pins);
    stepper.state = MotorState.Forward;

    assert.expect(2);
    assert.ok(!stepper.isStopped, "Motor is already stopped");

    stepper.stop();
    assert.ok(stepper.isStopped, "Motor did not stop");
    assert.done();
  },
  forwardTest: function(assert) {
    let pins = createPins();
    let stepper = new StepperMotorComponent(pins);

    assert.expect(2);
    assert.ok(stepper.isStopped, "Motor is not stopped");

    stepper.forward(300);
    assert.ok(stepper.isState(MotorState.Forward), "Motor is not going forward");
    assert.done();
  },
  reverseTest: function(assert) {
    let pins = createPins();
    let stepper = new StepperMotorComponent(pins);

    assert.expect(2);
    assert.ok(stepper.isStopped, "Motor is not stopped");

    stepper.reverse(300);
    assert.ok(stepper.isState(MotorState.Reverse), "Motor is not reversed");
    assert.done();
  }
  // TODO Need to devise tests for rotate() and step()
};
