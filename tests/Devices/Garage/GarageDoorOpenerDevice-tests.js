'use strict';

const util = require('util');
const GpioBase = require('../../../src/lib/IO/GpioBase.js');
const GpioPins = require('../../../src/lib/IO/GpioPins.js');
const PinMode = require('../../../src/lib/IO/PinMode.js');
const PinState = require('../../../src/lib/IO/PinState.js');
const PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
const RelayComponent = require('../../../src/lib/Components/Relays/RelayComponent.js');
const SensorComponent = require('../../../src/lib/Components/Sensors/SensorComponent.js');
const SensorState = require('../../../src/lib/Components/Sensors/SensorState.js');
const SwitchComponent = require('../../../src/lib/Components/Switches/SwitchComponent.js');
const GarageDoorOpener = require('../../../src/lib/Devices/Garage/GarageDoorOpener');
const GarageDoorOpenerDevice = require('../../../src/lib/Devices/Garage/GarageDoorOpenerDevice');
const Opener = require('../../../src/lib/Devices/Access/Opener.js');
const OpenerState = require('../../../src/lib/Devices/Access/OpenerState.js');


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


const createGarageDoorOpener = function() {
	var fakePin1 = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
	var fakeRelay = new RelayComponent(fakePin1);

	var fakePin2 = new FakeGpio(GpioPins.GPIO04, PinMode.IN, PinState.Low);
	var fakeSensor = new SensorComponent(fakePin2);

	var fakePin3 = new FakeGpio(GpioPins.GPIO07, PinMode.IN, PinState.Low);
	var fakeSwitch = new SwitchComponent(fakePin3);

	return new GarageDoorOpenerDevice(fakeRelay, fakeSensor, SensorState.Open, fakeSwitch);
};


module.exports.GarageDoorOpenerDeviceTests = {
	disposeAndIsDisposedTest: function(assert) {
		let fakeOpener = createGarageDoorOpener();

		assert.expect(2);
		assert.ok(!fakeOpener.isDisposed, "Garage Door is already disposed");

		fakeOpener.dispose();
		assert.ok(fakeOpener.isDisposed, "Garage Door did not dispose");
		assert.done();
	},
	setHasPropertyTest: function(assert) {
		let fakeOpener = createGarageDoorOpener();
		fakeOpener.setProperty("foo", "bar");

		assert.expect(1);
		assert.ok(fakeOpener.hasProperty("foo"), "Property 'foo' not present in Garage Door object");
		assert.done();
	},
	getStateTest: function(assert) {
		let fakeOpener = createGarageDoorOpener();

		assert.expect(2);
		assert.equals(fakeOpener.state, OpenerState.Open, "Garage Door is not open");

		fakeOpener.stateSensor.pin.write(PinState.High);  // Trick the sensor
		assert.equals(fakeOpener.state, OpenerState.Closed, "Garage Door is not closed");
		assert.done();
	},
	isOpenTest: function(assert) {
		let fakeOpener = createGarageDoorOpener();

		assert.expect(1);
		assert.ok(fakeOpener.isOpen, "Garage Door is not open");
		assert.done();
	},
	isClosedTest: function(assert) {
		let fakeOpener = createGarageDoorOpener();
		fakeOpener.stateSensor.pin.write(PinState.High);

		assert.expect(1);
		assert.ok(fakeOpener.isClosed, "Garage Door is not closed");
		assert.done();
	},
	isLockedTest: function(assert) {
		let fakeOpener = createGarageDoorOpener();
		fakeOpener.lockSwitch.pin.write(PinState.High);

		assert.expect(1);
		assert.ok(fakeOpener.isLocked, "Garage Door is not locked");
		assert.done();
	},
	overrideLockTest: function(assert) {
		let fakeOpener = createGarageDoorOpener();
		fakeOpener.overrideLock(OpenerState.Closed);

		assert.expect(2);
		assert.ok(fakeOpener.isLocked, "Garage Door lock did not override");

		fakeOpener.disableOverride();
		assert.ok(!fakeOpener.isLocked, "Garage Door lock override not disabled");
		assert.done();
	},
	openTest: function(assert) {
		let fakeOpener = createGarageDoorOpener();

		// Trick the opener into thinking it is closed.
		fakeOpener.stateSensor.pin.write(PinState.High);

		fakeOpener.on(Opener.EVENT_STATE_CHANGED, (stateChanged) => {
			assert.expect(2);
			assert.equals(stateChanged.oldState, OpenerState.Closed, "Garage Door was not already closed");
			assert.equals(stateChanged.newState, OpenerState.Open, "Garage Door did not open");
			assert.done();
		});

		fakeOpener.open();

		// Now trick the opener into thinking it is open.
		fakeOpener.stateSensor.pin.write(PinState.Low);
	},
	closeTest: function(assert) {
		let fakeOpener = createGarageDoorOpener();

		// Trick the opener into thinking it is open.
		fakeOpener.stateSensor.pin.write(PinState.Low);

		fakeOpener.on(Opener.EVENT_STATE_CHANGED, (stateChanged) => {
			assert.expect(2);
			assert.equals(stateChanged.oldState, OpenerState.Open, "Garage Door was not already open");
			assert.equals(stateChanged.newState, OpenerState.Closed, "Garage Door did not close");
			assert.done();
		});

		fakeOpener.close();

		// Now trick the opener into thinking it is closed.
		fakeOpener.stateSensor.pin.write(PinState.High);
	},
	testLockStateChange: function(assert) {
		let fakeOpener = createGarageDoorOpener();
		fakeOpener.on(Opener.EVENT_LOCK_STATE_CHANGED, (lockChanged) => {
			assert.expect(1);
			assert.ok(lockChanged.isLocked, "Garage Door did not lock");
			assert.done();
		});

		// Trick the opener into thinking it is locked.
		fakeOpener.lockSwitch.pin.write(PinState.High);
	}
};
