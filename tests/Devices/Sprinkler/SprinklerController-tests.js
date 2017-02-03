'use strict';

const util = require('util');
const GpioBase = require('../../../src/lib/IO/GpioBase.js');
const GpioPins = require('../../../src/lib/IO/GpioPins.js');
const PinMode = require('../../../src/lib/IO/PinMode.js');
const PinState = require('../../../src/lib/IO/PinState.js');
const PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
const SprinklerZoneDevice = require('../../../src/lib/Devices/Sprinkler/SprinklerZoneDevice.js');
const RelayComponent = require('../../../src/lib/Components/Relays/RelayComponent.js');
const SprinklerControllerDevice = require('../../../src/lib/Devices/Sprinkler/SprinklerControllerDevice.js');
const SprinklerZone = require('../../../src/lib/Devices/Sprinkler/SprinklerZone.js');


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


const createZone = function() {
	let fakePin = new FakeGpio(GpioPins.GPIO00, PinMode.OUT, PinState.Low);
	let rel = new RelayComponent(fakePin);
	return new SprinklerZoneDevice(rel);
};


module.exports.SprinklerControllerTests = {
	disposeAndIsDisposedTest: function(assert) {
		let cntlr = new SprinklerControllerDevice();

		assert.expect(2);
		assert.ok(!cntlr.isDisposed, "Controller is already disposed");

		cntlr.dispose();
		assert.ok(cntlr.isDisposed, "Controller did not dispose");
		assert.done();
	},
	setAndHasPropertyTest: function(assert) {
		let cntlr = new SprinklerControllerDevice();
		cntlr.setProperty("foo", "bar");

		assert.expect(1);
		assert.ok(cntlr.hasProperty("foo"), "Controller does not posses property 'foo'");
		assert.done();
	},
	zoneListTests: function(assert) {
		let cntlr = new SprinklerControllerDevice();
		let oldCount = cntlr.zoneCount;

		assert.expect(3);
		assert.equals(oldCount, 0, "There are already zones in the list");

		let zone = createZone();
		cntlr.addZone(zone);
		assert.equals(cntlr.zoneCount, 1, "Failed to add zone");

		cntlr.removeZone(zone);
		assert.equals(cntlr.zoneCount, 0, "Failed to remove zone");
		assert.done();
	},
	setStateTest: function(assert) {
		let cntlr = new SprinklerControllerDevice();
		cntlr.addZone(createZone());
		cntlr.setState(0, true);

		assert.expect(1);
		assert.ok(cntlr.isOnForZone(0), "Zone 0 is not on");
		assert.done();
	},
	turnOnOffTests: function(assert) {
		let cntlr = new SprinklerControllerDevice();
		cntlr.addZone(createZone());
		cntlr.turnOn(0);

		assert.expect(6);
		assert.ok(cntlr.isOn, "No zones are turned on");
		assert.ok(cntlr.isOnForZone(0), "Zone 0 is not on");

		cntlr.turnOff(0);
		assert.ok(cntlr.isOffForZone(0), "Zone 0 is still on");
		assert.ok(cntlr.isOff, "One or more zones are still on");

		cntlr.turnOnAllZones();
		assert.ok(cntlr.isOn, "No zones turned on");

		cntlr.turnOffAllZones();
		assert.ok(cntlr.isOff, "One or more zones are still on");
		assert.done();
	},
	zoneStateChangeTest: function(assert) {
		let cntlr = new SprinklerControllerDevice();
		cntlr.addZone(createZone());
		cntlr.on(SprinklerZone.EVENT_STATE_CHANGED, (stateChange) => {
			assert.expect(2);
			assert.equals(stateChange.oldState, false, "Old state was not false (off)");
			assert.equals(stateChange.newState, true, "New state is not true (on)");
			assert.done();
		});

		cntlr.turnOn(0);
	}
};
