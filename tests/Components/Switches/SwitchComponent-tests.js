'use strict';

const util = require('util');
const GpioBase = require('../../../src/lib/IO/GpioBase.js');
const GpioPins = require('../../../src/lib/IO/GpioPins.js');
const PinMode = require('../../../src/lib/IO/PinMode.js');
const PinState = require('../../../src/lib/IO/PinState.js');
const PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
const SwitchComponent = require('../../../src/lib/Components/Switches/SwitchComponent.js');
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


module.exports.SwitchComponentTests = {
	disposeAndIsDisposedTest: function(assert) {
		let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		let sc = new SwitchComponent(fakePin);

		assert.expect(2);
		assert.ok(!sc.isDisposed, "Switch already disposed");

		sc.dispose();
		assert.ok(sc.isDisposed, "Switch did not dispose");
		assert.done();
	},
	setHasPropertyTest: function(assert) {
		let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		let sc = new SwitchComponent(fakePin);
		sc.setProperty("foo", "bar");

		assert.expect(1);
		assert.ok(sc.hasProperty("foo"), "Property 'foo' not present");
		assert.done();
	},
	getStateTest: function(assert) {
		let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		let sc = new SwitchComponent(fakePin);

		assert.expect(2);
		assert.equals(sc.state, SwitchState.Off, "Switch is already on");

		fakePin.write(PinState.High);
		assert.equals(sc.state, SwitchState.On, "Switch is not on");
		assert.done();
	},
	isStateTest: function(assert) {
		let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		let sc = new SwitchComponent(fakePin);

		assert.expect(2);
		assert.ok(sc.isState(SwitchState.Off), "Switch is not off");

		fakePin.write(PinState.High);
		assert.ok(sc.isState(SwitchState.On), "Switch is not on");
		assert.done();
	},
	isOnTest: function(assert) {
		let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		let sc = new SwitchComponent(fakePin);
		fakePin.write(PinState.High);

		assert.expect(1);
		assert.ok(sc.isOn, "Switch is not on");
		assert.done();
	},
	isOffTest: function(assert) {
		let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		let sc = new SwitchComponent(fakePin);

		assert.expect(1);
		assert.ok(sc.isOff, "Switch is not off");
		assert.done();
	},
	pollTest: function(assert) {
		let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		let sc = new SwitchComponent(fakePin);

		assert.expect(2);
		assert.ok(!sc.isPolling, "Switch is already polling");

		sc.poll();
		assert.ok(sc.isPolling, "Switch is not polling");
		assert.done();
	},
	stateChangeTest: function(assert) {
		let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		let sc = new SwitchComponent(fakePin);
		sc.on(Switch.EVENT_STATE_CHANGED, (stateChanged) => {
			assert.expect(2);
			assert.equals(stateChanged.oldState, SwitchState.Off, "Old switch state not off");
			assert.equals(stateChanged.newState, SwitchState.On, "New state not on");
			assert.done();
		});

		sc.poll();
		fakePin.write(PinState.High);

		setTimeout(() => {
			sc.interruptPoll();
		}, 225);
	}
};
