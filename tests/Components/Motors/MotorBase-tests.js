'use strict';

const Motor = require('../../../src/lib/Components/Motors/Motor.js');
const MotorState = require('../../../src/lib/Components/Motors/MotorState.js');
const MotorBase = require('../../../src/lib/Components/Motors/MotorBase.js');


module.exports.MotoBaseTests = {
  disposeAndIsDisposedTest: function(assert) {
    let motor = new MotorBase();

    assert.expect(2);
    assert.ok(!motor.isDisposed, "Motor already disposed");

    motor.dispose();
    assert.ok(motor.isDisposed, "Motor did not dispose");
    assert.done();
  },
  getSetStateTest: function(assert) {
    let motor = new MotorBase();

    assert.expect(2);
    assert.equals(motor.state, MotorState.Stop, "Motor is not stopped");

    motor.state = MotorState.Forward;
    assert.equals(motor.state, MotorState.Forward, "Motor is not going forward");
    assert.done();
  },
  isStateTest: function(assert) {
    let motor = new MotorBase();
    motor.state = MotorState.Reverse;

    assert.expect(1);
    assert.ok(motor.isState(MotorState.Reverse), "Motor is not reversing");
    assert.done();
  },
  isStoppedTest: function(assert) {
    let motor = new MotorBase();

    assert.expect(1);
    assert.ok(motor.isStopped, "Motor is not stopped");
    assert.done();
  },
  stopTest: function(assert) {
    let motor = new MotorBase();
    motor.state = MotorState.Forward;

    assert.expect(1);
    motor.stop();
    assert.ok(motor.isStopped, "Motor is not stopped");
    assert.done();
  },
  forwardTest: function(assert) {
    let motor = new MotorBase();
    motor.forward(5);

    assert.expect(1);
    assert.ok(motor.isState(MotorState.Forward), "Motor state is not forward");
    assert.done();
  },
  reverseTest: function(assert) {
    let motor = new MotorBase();
    motor.reverse(5);

    assert.expect(1);
    assert.ok(motor.isState(MotorState.Reverse), "Motor is not reversing");
    assert.done();
  },
  motorForwardEventTest: function(assert) {
    let eventFired = false;
    let motor = new MotorBase();
    motor.on(Motor.EVENT_FORWARD, () => {
      eventFired = true;
      assert.expect(1);
      assert.ok(eventFired, "Forward event did not fire.");
      assert.done();
    });

    motor.forward(5);
  },
  motorReverseEventTest: function(assert) {
    let eventFired = false;
    let motor = new MotorBase();
    motor.on(Motor.EVENT_REVERSE, () => {
      eventFired = true;
      assert.expect(1);
      assert.ok(eventFired, "Reverse event did not fire.");
      assert.done();
    });

    motor.reverse(5);
  },
  motorStoppedEventTest: function(assert) {
    let eventFired = false;
    let motor = new MotorBase();
    motor.on(Motor.EVENT_STOPPED, () => {
      eventFired = true;
      assert.expect(1);
      assert.ok(eventFired, "Stop event did not fire.");
      assert.done();
    });

    motor.reverse(5);
  }
};
