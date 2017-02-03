'use strict';

const util = require('util');
const GpioBase = require('../../../src/lib/IO/GpioBase.js');
const GpioPins = require('../../../src/lib/IO/GpioPins.js');
const PinMode = require('../../../src/lib/IO/PinMode.js');
const PinState = require('../../../src/lib/IO/PinState.js');
const PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
const MotionSensor = require('../../../src/lib/Components/Sensors/MotionSensor.js');
const MotionSensorComponent = require('../../../src/lib/Components/Sensors/MotionSensorComponent.js');


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


module.exports.MotionSensorComponentTests = {
  disposeAndIsDisposedTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    let sensor = new MotionSensorComponent(fakePin);

    assert.expect(2);
    assert.ok(!sensor.isDisposed, "Sensor already disposed");

    sensor.dispose();
    assert.ok(sensor.isDisposed, "Sensor did not dispose");
    assert.done();
  },
  setHasPropertyTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    let sensor = new MotionSensorComponent(fakePin);
    sensor.setProperty("foo", "bar");

    assert.expect(1);
    assert.ok(sensor.hasProperty("foo"), "Sensor does not have property 'foo'");
    assert.done();
  },
  pollIsPollingTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    let sensor = new MotionSensorComponent(fakePin);

    assert.expect(2);
    assert.ok(!sensor.isPolling, "Sensor is alrady polling");

    sensor.poll();
    assert.ok(sensor.isPolling, "Sensor is not polling");

    sensor.interruptPoll();
    assert.done();
  },
  isMotionDetectedTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    let sensor = new MotionSensorComponent(fakePin);

    assert.expect(2);
    assert.ok(!sensor.isMotionDetected, "Motion was detected");

    fakePin.write(PinState.High);
    assert.ok(sensor.isMotionDetected, "Motion was not detected");
    assert.done();
  },
  motionDetetedEventTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    let sensor = new MotionSensorComponent(fakePin);
    sensor.on(MotionSensor.EVENT_MOTION_STATE_CHANGED, (stateChanged) => {
      assert.expect(2);
      assert.ok(stateChanged.isMotionDetected, "Motion not detected");

      let tsLastCheck = sensor.lastMotionTimestamp;
      let tsStateChange = stateChanged.timestamp;
      if (!util.isNullOrUndefined(tsLastCheck)) {
          let actual = tsLastCheck.getTime();
          let expected = tsStateChange.getTime();
          let result = ((expected === actual) || (actual <= expected + 2));
          assert.ok(result, "Timestamps do not match");
      }

      assert.done();
    });

    sensor.poll();
    fakePin.write(PinState.High);

    setTimeout(() => {
      sensor.interruptPoll();
    }, 225);
  }
};
