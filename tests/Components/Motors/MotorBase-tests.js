'use strict';

var Motor = require('../../../src/lib/Components/Motors/Motor.js');
var MotorState = require('../../../src/lib/Components/Motors/MotorState.js');
var MotorBase = require('../../../src/lib/Components/Motors/MotorBase.js');


module.exports.MotoBaseTests = {
  disposeAndIsDisposedTest: function(assert) {
    var motor = new MotorBase();

    assert.expect(2);
    assert.ok(!motor.isDisposed(), "Motor already disposed");

    motor.dispose();
    assert.ok(motor.isDisposed(), "Motor did not dispose");
    assert.done();
  },
  getSetStateTest: function(assert) {
    var motor = new MotorBase();

    assert.expect(2);
    assert.equals(motor.getState(), MotorState.Stop, "Motor is not stopped");

    motor.setState(MotorState.Forward);
    assert.equals(motor.getState(), MotorState.Forward, "Motor is not going forward");
    assert.done();
  },
  isStateTest: function(assert) {
    var motor = new MotorBase();
    assert.expect(1);
    motor.setState(MotorState.Reverse);
    assert.ok(motor.isState(MotorState.Reverse), "Motor is not reversing");
    assert.done();
  },
  isStoppedTest: function(assert) {
    var motor = new MotorBase();
    assert.expect(1);
    assert.ok(motor.isStopped(), "Motor is not stopped");
    assert.done();
  },
  stopTest: function(assert) {
    var motor = new MotorBase();
    motor.setState(MotorState.Forward);

    assert.expect(1);
    motor.stop();
    assert.ok(motor.isStopped(), "Motor is not stopped");
    assert.done();
  },
  forwardTest: function(assert) {
    var motor = new MotorBase();
    motor.forward(5);

    assert.expect(1);
    assert.ok(motor.isState(MotorState.Forward), "Motor state is not forward");
    assert.done();
  },
  reverseTest: function(assert) {
    var motor = new MotorBase();
    motor.reverse(5);

    assert.expect(1);
    assert.ok(motor.isState(MotorState.Reverse), "Motor is not reversing");
    assert.done();
  },
  motorForwardEventTest: function(assert) {
    var eventFired = false;
    var motor = new MotorBase();
    motor.on(Motor.EVENT_FORWARD, function() {
      eventFired = true;
      assert.expect(1);
      assert.ok(eventFired, "Forward event did not fire.");
      assert.done();
    });

    motor.forward(5);
  },
  motorReverseEventTest: function(assert) {
    var eventFired = false;
    var motor = new MotorBase();
    motor.on(Motor.EVENT_REVERSE, function() {
      eventFired = true;
      assert.expect(1);
      assert.ok(eventFired, "Reverse event did not fire.");
      assert.done();
    });

    motor.reverse(5);
  },
  motorStoppedEventTest: function(assert) {
    var eventFired = false;
    var motor = new MotorBase();
    motor.on(Motor.EVENT_STOPPED, function() {
      eventFired = true;
      assert.expect(1);
      assert.ok(eventFired, "Stop event did not fire.");
      assert.done();
    });

    motor.reverse(5);
  }
};
