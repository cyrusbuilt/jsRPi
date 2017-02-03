'use strict';

const util = require('util');
const GpioBase = require('../../../src/lib/IO/GpioBase.js');
const GpioPins = require('../../../src/lib/IO/GpioPins.js');
const PinMode = require('../../../src/lib/IO/PinMode.js');
const PinState = require('../../../src/lib/IO/PinState.js');
const PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
const ToggleSwitchComponent = require('../../../src/lib/Components/Switches/ToggleSwitchComponent.js');
const Switch = require('../../../src/lib/Components/Switches/Switch.js');
const SwitchState = require('../../../src/lib/Components/Switches/SwitchState.js');


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


module.exports.ToggleSwitchComponentTests = {
	disposeAndIsDisposedTest: function(assert) {
		let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		let tsc = new ToggleSwitchComponent(fakePin);

		assert.expect(2);
		assert.ok(!tsc.isDisposed, "Toggle switch already disposed");

		tsc.dispose();
		assert.ok(tsc.isDisposed, "Toggle switch did not dispose");
		assert.done();
	},
	setHasPropertyTest: function(assert) {
		let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		let tsc = new ToggleSwitchComponent(fakePin);
		tsc.setProperty("foo", "bar");

		assert.expect(1);
		assert.ok(tsc.hasProperty("foo"), "Property 'foo' not present");
		assert.done();
	},
	getStateTest: function(assert) {
		let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		let tsc = new ToggleSwitchComponent(fakePin);

		assert.expect(2);
		assert.equals(tsc.state, SwitchState.Off, "Toggle switch is not off");

		fakePin.write(PinState.High);
		assert.equals(tsc.state, SwitchState.On, "Toggle switch is not on");
		assert.done();
	},
	isStateTest: function(assert) {
		let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		let tsc = new ToggleSwitchComponent(fakePin);

		assert.expect(1);
		assert.ok(tsc.isState(SwitchState.Off), "Toggle switch is not off");
		assert.done();
	},
	isOnTest: function(assert) {
		let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		let tsc = new ToggleSwitchComponent(fakePin);

		assert.expect(2);
		assert.ok(!tsc.isOn, "Toggle switch is already on");

		fakePin.write(PinState.High);
		assert.ok(tsc.isOn, "Toggle switch did not switch on");
		assert.done();
	},
	isOffTest: function(assert) {
		let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		let tsc = new ToggleSwitchComponent(fakePin);

		assert.expect(1);
		assert.ok(tsc.isOff, "Toggle switch is not off");
		assert.done();
	},
	pollTest: function(assert) {
		let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		let tsc = new ToggleSwitchComponent(fakePin);

		assert.expect(2);
		assert.ok(!tsc.isPolling, "Toggle switch is already polling");

		tsc.poll();
		assert.ok(tsc.isPolling, "Toggle switch is not polling");

		tsc.interruptPoll();
		assert.done();
	},
	stateChangeTest: function(assert) {
		let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		let tsc = new ToggleSwitchComponent(fakePin);
		tsc.on(Switch.EVENT_STATE_CHANGED, (stateChanged) => {
			assert.expect(2);
			assert.equals(stateChanged.oldState, SwitchState.Off, "Old toggle switch state is not off");
			assert.equals(stateChanged.newState, SwitchState.On, "New toggle switch state is not on");
			assert.done();
		});

		tsc.poll();
		fakePin.write(PinState.High);

		setTimeout(() => {
			tsc.interruptPoll();
		}, 225);
	}
};
