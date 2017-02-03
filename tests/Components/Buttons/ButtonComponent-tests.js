'use strict';

const util = require('util');
const GpioBase = require('../../../src/lib/IO/GpioBase.js');
const GpioPins = require('../../../src/lib/IO/GpioPins.js');
const PinMode = require('../../../src/lib/IO/PinMode.js');
const PinState = require('../../../src/lib/IO/PinState.js');
const PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
const ButtonComponent = require('../../../src/lib/Components/Button/ButtonComponent.js');
const ButtonState = require('../../../src/lib/Components/Button/ButtonState.js');
const Button = require('../../../src/lib/Components/Button/Button.js');


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


module.exports.ButtonComponentTests = {
  testDisposeAndIsDisposed: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    let fakeButton = new ButtonComponent(fakePin);

    assert.expect(2);
    assert.ok(!fakeButton.isDisposed, "Button not instantiated.");

    fakeButton.dispose();
    assert.ok(fakeButton.isDisposed, "Button not disposed");

    assert.done();
  },
  testGetState: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    let fakeButton = new ButtonComponent(fakePin);

    assert.expect(2);
    assert.equals(fakeButton.state, ButtonState.Released, "Button state is pressed");

    fakePin.write(PinState.High);
    assert.equals(fakeButton.state, ButtonState.Pressed, "Button state is released");
    assert.done();
  },
  testPoll: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    let fakeButton = new ButtonComponent(fakePin);

    assert.expect(3);
    assert.ok(!fakeButton.isPolling, "Button poll is already polling");

    fakeButton.poll();
    assert.ok(fakeButton.isPolling, "Button poll is not polling");

    fakeButton.interruptPoll();
    assert.ok(!fakeButton.isPolling, "Button poll still running");
    assert.done();
  },
  testIsPressed: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    let fakeButton = new ButtonComponent(fakePin);

    assert.expect(2);
    assert.ok(!fakeButton.isPressed, "Button is pressed");

    fakePin.write(PinState.High);
    assert.ok(fakeButton.isPressed, "Button is released");
    assert.done();
  },
  testIsReleased: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    let fakeButton = new ButtonComponent(fakePin);

    assert.expect(2);
    assert.ok(fakeButton.isReleased, "Button is pressed");

    fakePin.write(PinState.High);
    assert.ok(!fakeButton.isReleased, "Button is released");
    assert.done();
  },
  testIsState: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    let fakeButton = new ButtonComponent(fakePin);

    assert.expect(2);
    assert.ok(fakeButton.isState(ButtonState.Released), "Button is pressed");

    fakePin.write(PinState.High);
    assert.ok(fakeButton.isState(ButtonState.Pressed), "Button is released");
    assert.done();
  },
  testOnStateChanged: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    let fakeButton = new ButtonComponent(fakePin);
    fakeButton.on(Button.EVENT_STATE_CHANGED, (stateChanged) => {
      assert.expect(1);
      assert.ok(stateChanged.isPressed, "Button is released");
      assert.done();
    });

    fakePin.write(PinState.High);
  }
};
