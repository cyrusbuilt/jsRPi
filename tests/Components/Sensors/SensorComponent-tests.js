'use strict';

const util = require('util');
const GpioBase = require('../../../src/lib/IO/GpioBase.js');
const GpioPins = require('../../../src/lib/IO/GpioPins.js');
const PinMode = require('../../../src/lib/IO/PinMode.js');
const PinState = require('../../../src/lib/IO/PinState.js');
const PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
const SensorComponent = require('../../../src/lib/Components/Sensors/SensorComponent.js');
const SensorState = require('../../../src/lib/Components/Sensors/SensorState.js');
const Sensor = require('../../../src/lib/Components/Sensors/Sensor.js');


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


module.exports.SensorComponentTests = {
  disposeAndIsDisposedTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    let sc = new SensorComponent(fakePin);

    assert.expect(2);
    assert.ok(!sc.isDisposed, "Sensor is already disposed");

    sc.dispose();
    assert.ok(sc.isDisposed, "Sensor did not dispose");
    assert.done();
  },
  setHasPropertyTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    let sc = new SensorComponent(fakePin);
    sc.setProperty("foo", "bar");

    assert.expect(1);
    assert.ok(sc.hasProperty("foo"), "Property 'foo' not found");
    assert.done();
  },
  getStateTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    let sc = new SensorComponent(fakePin);

    assert.expect(1);
    assert.equals(sc.state, SensorState.Open, "Sensor still closed");
    assert.done();
  },
  isStateTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    let sc = new SensorComponent(fakePin);

    assert.expect(1);
    assert.ok(sc.isState(SensorState.Open), "Sensor closed");
    assert.done();
  },
  isOpenTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    let sc = new SensorComponent(fakePin);

    assert.expect(1);
    assert.ok(sc.isOpen, "Sensor closed");
    assert.done();
  },
  isClosedTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    let sc = new SensorComponent(fakePin);
    fakePin.write(PinState.High);

    assert.expect(1);
    assert.ok(sc.isClosed, "Sensor still open");
    assert.done();
  },
  pollTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    let sc = new SensorComponent(fakePin);

    assert.expect(2);
    assert.ok(!sc.isPolling, "Sensor is already polling");

    sc.poll();
    assert.ok(sc.isPolling, "Sensor poll did not start");

    sc.interruptPoll();
    assert.done();
  },
  stateChangeTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    let sc = new SensorComponent(fakePin);
    sc.on(Sensor.EVENT_STATE_CHANGED, (changeEvent) => {
      assert.expect(2);
      assert.equals(changeEvent.oldState, SensorState.Open, "Old state not open");
      assert.equals(changeEvent.newState, SensorState.Closed, "New state not closed");
      assert.done();
    });

    sc.poll();
    fakePin.write(PinState.High);

    setTimeout(() => {
      sc.interruptPoll();
    }, 600);
  }
};
