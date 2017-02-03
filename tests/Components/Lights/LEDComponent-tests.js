'use strict';

const util = require('util');
const GpioBase = require('../../../src/lib/IO/GpioBase.js');
const GpioPins = require('../../../src/lib/IO/GpioPins.js');
const PinMode = require('../../../src/lib/IO/PinMode.js');
const PinState = require('../../../src/lib/IO/PinState.js');
const PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
const Light = require('../../../src/lib/Components/Lights/Light.js');
const LEDComponent = require('../../../src/lib/Components/Lights/LEDComponent.js');


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


module.exports.LEDComponentTests = {
  disposeAndIsDisposedTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    let testLED = new LEDComponent(fakePin);

    assert.expect(2);
    assert.ok(!testLED.isDisposed, "LED is already disposed");

    testLED.dispose();
    assert.ok(testLED.isDisposed, "LED did not dispose");
    assert.done();
  },
  turnOnTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    let testLED = new LEDComponent(fakePin);

    assert.expect(2);
    assert.ok(!testLED.isOn, "The LED is already on");

    testLED.turnOn();
    assert.ok(testLED.isOn, "LED did not turn on");
    assert.done();
  },
  turnOffTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    let testLED = new LEDComponent(fakePin);

    assert.expect(3);
    assert.ok(testLED.isOff, "LED is already on");

    testLED.turnOn();
    assert.ok(!testLED.isOff, "LED is still on");

    testLED.turnOff();
    assert.ok(testLED.isOff, "LED did not turn back off");
    assert.done();
  },
  stateChangeTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    let testLED = new LEDComponent(fakePin);

    testLED.on(Light.EVENT_STATE_CHANGED, (changeEvent) => {
      assert.expect(1);
      assert.ok(changeEvent.isOn, "LED did not turn on");
      assert.done();
    });

    testLED.turnOn();
  }
};
