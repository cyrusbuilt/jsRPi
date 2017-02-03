'use strict';

const util = require('util');
const GpioBase = require('../../../src/lib/IO/GpioBase.js');
const GpioPins = require('../../../src/lib/IO/GpioPins.js');
const PinMode = require('../../../src/lib/IO/PinMode.js');
const PinState = require('../../../src/lib/IO/PinState.js');
const PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
const SprinklerZoneDevice = require('../../../src/lib/Devices/Sprinkler/SprinklerZoneDevice.js');
const RelayComponent = require('../../../src/lib/Components/Relays/RelayComponent.js');


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


const createRelay = function() {
	let fakePin = new FakeGpio(GpioPins.GPIO00, PinMode.OUT, PinState.Low);
	return new RelayComponent(fakePin);
};


module.exports.SprinklerZoneDeviceTests = {
	disposeAndIsDisposedTest: function(assert) {
		let zone = new SprinklerZoneDevice(createRelay());

		assert.expect(2);
		assert.ok(!zone.isDisposed, "Zone is already disposed");

		zone.dispose();
		assert.ok(zone.isDisposed, "Zone did not dispose");
		assert.done();
	},
	setAndHasPropertyTest: function(assert) {
		let zone = new SprinklerZoneDevice(createRelay());
		zone.setProperty("foo", "bar");

		assert.expect(1);
		assert.ok(zone.hasProperty("foo"), "Zone does not possess property 'foo'");
		assert.done();
	},
	setStateTest: function(assert) {
		let zone = new SprinklerZoneDevice(createRelay());

		assert.expect(2);
		assert.ok(zone.isOff, "Zone is already on");

		zone.setState(true);
		assert.ok(zone.isOn, "Zone is still off");
		assert.done();
	},
	turnOnTest: function(assert) {
		let zone = new SprinklerZoneDevice(createRelay());
		zone.turnOn();

		assert.expect(1);
		assert.ok(zone.isOn, "Zone did not turn on");
		assert.done();
	},
	turnOffTest: function(assert) {
		let zone = new SprinklerZoneDevice(createRelay());
		zone.turnOn();

		assert.expect(2);
		assert.ok(zone.isOn, "Zone did not turn on");

		zone.turnOff();
		assert.ok(zone.isOff, "Zone is still on");
		assert.done();
	}
};
