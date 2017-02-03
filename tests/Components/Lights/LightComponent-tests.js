'use strict';

const util = require('util');
const GpioBase = require('../../../src/lib/IO/GpioBase.js');
const GpioPins = require('../../../src/lib/IO/GpioPins.js');
const PinMode = require('../../../src/lib/IO/PinMode.js');
const PinState = require('../../../src/lib/IO/PinState.js');
const PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
const LightComponent = require('../../../src/lib/Components/Lights/LightComponent.js');
const Light = require('../../../src/lib/Components/Lights/Light.js');


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


module.exports.LightComponentTests = {
  disposeAndIsDisposedTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    let testLight = new LightComponent(fakePin);

    assert.expect(2);
    assert.ok(!testLight.isDisposed, "Light is already disposed.");

    testLight.dispose();
    assert.ok(testLight.isDisposed, "Light is not disposed");
    assert.done();
  },
  lightOnTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    let testLight = new LightComponent(fakePin);

    assert.expect(2);
    assert.ok(!testLight.isOn, "Light is already on");

    testLight.turnOn();
    assert.ok(testLight.isOn, "Light did not turn on");
    assert.done();
  },
  lightOffTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    let testLight = new LightComponent(fakePin);

    assert.expect(2);
    assert.ok(testLight.isOff, "Light is already on");

    testLight.turnOn();
    assert.ok(!testLight.isOff, "Light did not turn on");
    assert.done();
  },
  lightStateChangeTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    let testLight = new LightComponent(fakePin);
    testLight.on(Light.EVENT_STATE_CHANGED, (changeEvent) => {
      assert.expect(1);
      assert.ok(changeEvent.isOn, "Light did not turn on");
      assert.done();
    });

    testLight.turnOn();
  }
};
