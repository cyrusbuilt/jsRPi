'use strict';

const util = require('util');
const GpioBase = require('../../../src/lib/IO/GpioBase.js');
const GpioPins = require('../../../src/lib/IO/GpioPins.js');
const PinMode = require('../../../src/lib/IO/PinMode.js');
const PinState = require('../../../src/lib/IO/PinState.js');
const PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
const RelayComponent = require('../../../src/lib/Components/Relays/RelayComponent.js');
const RelayState = require('../../../src/lib/Components/Relays/RelayState.js');
const SensorComponent = require('../../../src/lib/Components/Sensors/SensorComponent.js');
const SensorState = require('../../../src/lib/Components/Sensors/SensorState.js');
const FireplaceDevice = require('../../../src/lib/Devices/Fireplace/FireplaceDevice.js');
const FireplaceState = require('../../../src/lib/Devices/Fireplace/FireplaceState.js');
const TimeUnit = require('../../../src/lib/PiSystem/TimeUnit.js');


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


const createFireplace = function() {
	let fakePin1 = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
	let fakeRelay = new RelayComponent(fakePin1);

	let fakePin2 = new FakeGpio(GpioPins.GPIO04, PinMode.IN, PinState.Low);
	let fakeSensor = new SensorComponent(fakePin2);

	return new FireplaceDevice(fakeRelay, RelayState.Closed, fakeSensor, SensorState.Closed);
};


module.exports.FireplaceDeviceTests = {
	disposeAndIsDisposedTest: function(assert) {
		let fp = createFireplace();

		assert.expect(2);
		assert.ok(!fp.isDisposed, "Fireplace is already disposed");

		fp.dispose();
		assert.ok(fp.isDisposed, "Fireplace did not dispose");
		assert.done();
	},
	setHasPropertyTest: function(assert) {
		let fp = createFireplace();
		fp.setProperty("foo", "bar");

		assert.expect(1);
		assert.ok(fp.hasProperty("foo"), "Fireplace does not possess property 'foo'.");
		assert.done();
	},
	isPilotLightOnTest: function(assert) {
		let fp = createFireplace();

		assert.expect(2);
		assert.ok(!fp.isPilotLightOn, "Pilot light is already lit");

		// Simulate pilot light being lit.
		fp.pilotLightSensor.pin.write(PinState.High);
		assert.ok(fp.isPilotLightOn, "Pilot light is not lit");
		assert.done();
	},
	isPilotLightOffTest: function(assert) {
		let fp = createFireplace();

		assert.expect(1);
		assert.ok(fp.isPilotLightOff, "Pilot light is already lit");
		assert.done();
	},
	getStateTest: function(assert) {
		let fp = createFireplace();

		assert.expect(2);
		assert.equals(fp.state, FireplaceState.Off, "Fireplace is already on");

		// Simulate control relay energized.
		fp.controlRelay.pin.write(PinState.High);
		assert.equals(fp.state, FireplaceState.On, "Fireplace is not on");
		assert.done();
	},
	setStateTest: function(assert) {
		let fp = createFireplace();

		// Simulate pilot light ignition
		fp.pilotLightSensor.pin.write(PinState.High);

		assert.expect(2);
		fp.state = FireplaceState.On;
		assert.equals(fp.state, FireplaceState.On, "Fireplace is not on");

		fp.state = FireplaceState.Off;
		assert.equals(fp.state, FireplaceState.Off, "Fireplace is still on");
		assert.done();
	},
	pilotLightExceptionTest: function(assert) {
		let fp = createFireplace();

		assert.expect(1);
		try {
			fp.state = FireplaceState.On;
		}
		catch (ex) {
			// We attempted to turn on the fireplace without the pilot light being lit first.
			// This pilot light is not lit, so a FireplacePilotLightException should be thrown.
			// This is because if a pilot light sensor was provided, we will not attempt to
			// turn on the gas unless the pilot light is lit. Otherwise, there is a safety
			// hazard as we are basically just releasing a flamable gas into the open air.
			let isExpectedException = (ex.name === 'FireplacePilotLightException');
			assert.ok(isExpectedException, "An unexpected exception was thrown: " + ex.name);
		}
		finally {
			assert.done();
		}
	},
	isOffTest: function(assert) {
		let fp = createFireplace();

		assert.expect(1);
		assert.ok(fp.isOff, "Fireplace is already on");
		assert.done();
	},
	isOnTest: function(assert) {
		let fp = createFireplace();

		// Simulate pilot light ignition
		fp.pilotLightSensor.pin.write(PinState.High);

		fp.state = FireplaceState.On;
		assert.expect(1);
		assert.ok(fp.isOn, "Fireplace did not turn on");
		assert.done();
	},
	getSetTimeoutDelayTest: function(assert) {
		let fp = createFireplace();

		// Simulate pilot light ignition
		fp.pilotLightSensor.pin.write(PinState.High);

		// We have to turn the fireplace on before setting the timeout,
		// otherwise an InvalidOperationException will be thrown.
		fp.state = FireplaceState.On;
		fp.setTimeoutDelay(5, TimeUnit.Seconds);

		assert.expect(2);
		assert.equals(fp.getTimeoutDelay(), 5, "Fireplace timeout delay not 5.");
		assert.equals(fp.getTimeoutUnit(), TimeUnit.Seconds, "Fireplace timeout delay time units is not seconds");
		assert.done();
	},
	turnOnTest: function(assert) {
		let fp = createFireplace();

		// Simulate pilot light ignition
		fp.pilotLightSensor.pin.write(PinState.High);

		fp.turnOn(5, TimeUnit.Seconds);

		assert.expect(1);
		assert.ok(fp.isOn, "Fireplace did not turn on");

		fp.cancelTimeout();
		assert.done();
	},
	turnOffTest: function(assert) {
		let fp = createFireplace();

		// Simulate pilot light ignition
		fp.pilotLightSensor.pin.write(PinState.High);

		fp.turnOn(5, TimeUnit.Seconds);

		assert.expect(2);
		assert.ok(fp.isOn, "Fireplace did not turn on");

		fp.turnOff();
		assert.ok(fp.isOff, "Fireplace did not turn off");

		fp.cancelTimeout();
		assert.done();
	},
	shutdownTest: function(assert) {
		let fp = createFireplace();

		// Simulate pilot light ignition
		fp.pilotLightSensor.pin.write(PinState.High);

		fp.turnOn(5, TimeUnit.Seconds);

		assert.expect(2);
		assert.ok(fp.isOn, "Fireplace did not turn on");

		fp.shutdown();
		assert.ok(fp.isOff, "Fireplace did not shutdown");
		assert.done();
	}
};
