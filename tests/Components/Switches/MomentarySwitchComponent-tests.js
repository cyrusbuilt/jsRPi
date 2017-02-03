'use strict';

const util = require('util');
const GpioBase = require('../../../src/lib/IO/GpioBase.js');
const GpioPins = require('../../../src/lib/IO/GpioPins.js');
const PinMode = require('../../../src/lib/IO/PinMode.js');
const PinState = require('../../../src/lib/IO/PinState.js');
const PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
const Switch = require('../../../src/lib/Components/Switches/Switch.js');
const SwitchState = require('../../../src/lib/Components/Switches/SwitchState.js');
const MomentarySwitchComponent = require('../../../src/lib/Components/Switches/MomentarySwitchComponent.js');


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
        super.write(ps);
        if (this._overriddenState !== ps) {
            let addr = this.innerPin.value;
            let evt = new PinStateChangeEvent(this._overriddenState, ps, addr);
            this._overriddenState = ps;
            this.onPinStateChange(evt);
        }
    }
}


module.exports.MomentarySwitchComponentTests = {
	disposeAndIsDisposedTest: function(assert) {
		let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		let msc = new MomentarySwitchComponent(fakePin);

		assert.expect(2);
		assert.ok(!msc.isDisposed, "Momentary switch is already disposed");

		msc.dispose();
		assert.ok(msc.isDisposed, "Momentary switch is not disposed");
		assert.done();
	},
	setHasPropertyTest: function(assert) {
		let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		let msc = new MomentarySwitchComponent(fakePin);
		msc.setProperty("foo", "bar");

		assert.expect(1);
		assert.ok(msc.hasProperty("foo"), "Propery 'foo' not present");
		assert.done();
	},
	getStateTest: function(assert) {
		let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		let msc = new MomentarySwitchComponent(fakePin);

		assert.expect(2);
		assert.equals(msc.state, SwitchState.Off, "Momentary switch state is not off");

		fakePin.write(PinState.High);
		assert.equals(msc.state, SwitchState.On, "Momentary switch is not on");
		assert.done();
	},
	isStateTest: function(assert) {
		let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
        let msc = new MomentarySwitchComponent(fakePin);
        let result = msc.isState(SwitchState.Off);

		assert.expect(1);
		assert.ok(result, "Momentary switch is not on");
		assert.done();
	},
	isOnTest: function(assert) {
		let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		let msc = new MomentarySwitchComponent(fakePin);

		assert.expect(2);
		assert.ok(!msc.isOn, "Momentary switch is already on");

		fakePin.write(PinState.High);
		assert.ok(msc.isOn, "Momentary switch is not on");
		assert.done();
	},
	isOffTest: function(assert) {
		let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		let msc = new MomentarySwitchComponent(fakePin);

		assert.expect(1);
		assert.ok(msc.isOff, "Momentary switch is not off");
		assert.done();
	},
	pollTest: function(assert) {
		let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		let msc = new MomentarySwitchComponent(fakePin);

		assert.expect(2);
		assert.ok(!msc.isPolling, "Momentary switch is already polling");

		msc.poll();
		assert.ok(msc.isPolling, "Momentary switch is not polling");

		msc.interruptPoll();
		assert.done();
	},
	stateChangeTest: function(assert) {
		let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		let msc = new MomentarySwitchComponent(fakePin);
		msc.on(Switch.EVENT_STATE_CHANGED, (stateChanged) => {
			assert.expect(2);
			assert.equals(stateChanged.oldState, SwitchState.Off, "Old momentary switch state is not off");
			assert.equals(stateChanged.newState, SwitchState.On, "New momentary switch state is not on");
			assert.done();
		});

		msc.poll();
		fakePin.write(PinState.High);

		setTimeout(() => {
			msc.interruptPoll();
		}, 225);
	}
};
