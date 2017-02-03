'use strict';

const util = require('util');
const GpioBase = require('../../../src/lib/IO/GpioBase.js');
const GpioPins = require('../../../src/lib/IO/GpioPins.js');
const PinMode = require('../../../src/lib/IO/PinMode.js');
const PinState = require('../../../src/lib/IO/PinState.js');
const PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
const Light = require('../../../src/lib/Components/Lights/Light.js');
const DimmableLightComponent = require('../../../src/lib/Components/Lights/DimmableLightComponent.js');

class FakeGpio extends GpioBase {
    constructor(pin, mode, value) {
        super(pin, mode, value);

        this._overriddenState = value;
        this._pwm = 0;
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

    set pwm(p) {
        this._pwm = p || 0;
    }

    get pwm() {
        return this._pwm;
    }
}


module.exports.DimmableLightComponentTests = {
  disposeAndIsDisposedTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.PWM, PinState.Low);
    let testLight = new DimmableLightComponent(fakePin, 0, 100);

    assert.expect(2);
    assert.ok(!testLight.isDisposed, "Light is already disposed.");

    testLight.dispose();
    assert.ok(testLight.isDisposed, "Light is not disposed");
    assert.done();
  },
  setLevelTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.PWM, PinState.Low);
    let testLight = new DimmableLightComponent(fakePin, 0, 100);

    assert.expect(2);
    assert.equals(testLight.level, 0, "Test light level is non-zero: " + testLight.level.toString());

    testLight.level = 56;
    assert.equals(testLight.level, 56, "Test light level is " + testLight.level.toString() + ", should be 56");
    assert.done();
  },
  turnOnTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.PWM, PinState.Low);
    let testLight = new DimmableLightComponent(fakePin, 0, 100);

    assert.expect(2);
    assert.ok(!testLight.isOn, "Test light is already on");

    testLight.turnOn();
    assert.ok(testLight.isOn, "The light is still off");
    assert.done();
  },
  turnOffTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.PWM, PinState.Low);
    let testLight = new DimmableLightComponent(fakePin, 0, 100);

    testLight.turnOn();
    assert.expect(2);
    assert.ok(!testLight.isOff, "Light is still off");

    testLight.turnOff();
    assert.ok(testLight.isOff, "Light is still on");
    assert.done();
  },
  stateChangeTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.PWM, PinState.Low);
    let testLight = new DimmableLightComponent(fakePin, 0, 100);
    testLight.on(Light.EVENT_STATE_CHANGED, (stateChanged) => {
      assert.expect(1);
      assert.ok(stateChanged.isOn, "The light did not turn on");
      assert.done();
    });

    testLight.turnOn();
  },
  levelChangeTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.PWM, PinState.Low);
    let testLight = new DimmableLightComponent(fakePin, 0, 100);
    testLight.on(Light.EVENT_LEVEL_CHANGED, (levelChanged) => {
      assert.expect(1);
      assert.equals(levelChanged.level, 56, "Light level: " + levelChanged.level.toString() + ", should be 56");
      assert.done();
    });

    testLight.level = 56;
  },
  getLevelPercentageTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.PWM, PinState.Low);
    let testLight = new DimmableLightComponent(fakePin, 0, 100);
    testLight.level = 23;

    let percentage = testLight.getLevelPercentage(testLight.level);

    assert.expect(1);
    assert.equals(percentage, 23, "Level percentage: " + percentage.toString() + ", should be 23");
    assert.done();
  }
};
