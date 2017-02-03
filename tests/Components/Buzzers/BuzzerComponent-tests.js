'use strict';

const util = require('util');
const GpioBase = require('../../../src/lib/IO/GpioBase.js');
const GpioPins = require('../../../src/lib/IO/GpioPins.js');
const PinMode = require('../../../src/lib/IO/PinMode.js');
const PinState = require('../../../src/lib/IO/PinState.js');
const PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
const BuzzerComponent = require('../../../src/lib/Components/Buzzers/BuzzerComponent');


class FakeGpio extends GpioBase {
    constructor(pin, mode, value) {
        super(pin, mode, value);

        this._pwmRange = 0;
        this._pwm = 0;
        this._overriddenState = value;
        if (util.isNullOrUndefined(this._overriddenState)) {
            this._overriddenState = PinState.Low;
        }
    }

    get pwm() {
        return this._pwm;
    }

    set pwm(m) {
        this._pwm = m;
    }

    get pwmRange() {
        return this._pwmRange;
    }

    set pwmRange(range) {
        this._pwmRange = range;
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


module.exports.BuzzerComponentTests = {
  testDisposeAndIsDisposed: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.PWM, PinState.Low);
    let fakeBuzzer = new BuzzerComponent(fakePin);

    assert.expect(2);
    assert.ok(!fakeBuzzer.isDisposed, "Buzzer is disposed");

    fakeBuzzer.dispose();
    assert.ok(fakeBuzzer.isDisposed, "Buzzer is not disposed");
    assert.done();
  },
  testBuzz: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.PWM, PinState.Low);
    let fakeBuzzer = new BuzzerComponent(fakePin);

    assert.expect(3);
    assert.ok(!fakeBuzzer.isBuzzing, "Buzzer is already buzzing");

    fakeBuzzer.buzz(300, 500);
    assert.ok(fakeBuzzer.isBuzzing, "Buzzer is not buzzing");

    fakeBuzzer.stop();
    assert.ok(!fakeBuzzer.isBuzzing, "Buzzer is still buzzing");
    assert.done();
  }
};
