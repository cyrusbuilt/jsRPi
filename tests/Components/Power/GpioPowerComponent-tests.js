'use strict';

const util = require('util');
const GpioBase = require('../../../src/lib/IO/GpioBase.js');
const GpioPins = require('../../../src/lib/IO/GpioPins.js');
const PinMode = require('../../../src/lib/IO/PinMode.js');
const PinState = require('../../../src/lib/IO/PinState.js');
const PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
const GpioPowerComponent = require('../../../src/lib/Components/Power/GpioPowerComponent.js');
const PowerState = require('../../../src/lib/Components/Power/PowerState.js');
const PowerInterface = require('../../../src/lib/Components/Power/PowerInterface.js');


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


module.exports.GpioPowerComponentTests = {
  disposeAndIsDisposedTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    let p = new GpioPowerComponent(fakePin, PinState.High, PinState.Low);

    assert.expect(2);
    assert.ok(!p.isDisposed, "Power component already disposed");

    p.dispose();
    assert.ok(p.isDisposed, "Power component did not dispose");
    assert.done();
  },
  getStateStateTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    let p = new GpioPowerComponent(fakePin, PinState.High, PinState.Low);

    assert.expect(2);
    assert.equals(p.state, PowerState.Off, "Power state is not off");

    p.state = PowerState.On;
    assert.equals(p.state, PowerState.On, "Power state is not on");
    assert.done();
  },
  turnOnTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    let p = new GpioPowerComponent(fakePin, PinState.High, PinState.Low);

    assert.expect(2);
    assert.ok(!p.isOn, "Power component is already on");

    p.turnOn();
    assert.ok(p.isOn, "Power component did not turn on");
    assert.done();
  },
  turnOffTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    let p = new GpioPowerComponent(fakePin, PinState.High, PinState.Low);
    p.turnOn();  // Default state on init is PowerState.Off

    assert.expect(2);
    assert.ok(!p.isOff, "Power component is not on");

    p.turnOff();
    assert.ok(p.isOff, "Power component did not turn off");
    assert.done();
  },
  stateChangeTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    let p = new GpioPowerComponent(fakePin, PinState.High, PinState.Low);
    p.on(PowerInterface.EVENT_STATE_CHANGED, (stateChanged) => {
      assert.expect(2);
      assert.equals(stateChanged.oldState, PowerState.Off, "Old state is not off");
      assert.equals(stateChanged.newState, PowerState.On, "New state is not on");
      assert.done();
    });

    p.turnOn();
  }
};
