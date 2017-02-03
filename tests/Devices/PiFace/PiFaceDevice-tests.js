'use strict';

const util = require('util');
const PiFaceDevice = require('../../../src/lib/Devices/PiFace/PiFaceDevice.js');
const PiFaceLED = require('../../../src/lib/Devices/PiFace/PiFaceLED.js');
const PiFaceRelay = require('../../../src/lib/Devices/PiFace/PiFaceRelay.js');
const PiFaceSwitch = require('../../../src/lib/Devices/PiFace/PiFaceSwitch.js');
const PiFaceGpioBase = require('../../../src/lib/IO/PiFaceGpioBase.js');
const PiFacePins = require('../../../src/lib/IO/PiFacePins.js');
const PiFacePinFactory = require('../../../src/lib/IO/PiFacePinFactory.js');
const PinState = require('../../../src/lib/IO/PinState.js');
const PinMode = require('../../../src/lib/IO/PinMode.js');
const PinPullResistance = require('../../../src/lib/IO/PinPullResistance.js');


class FakePiFaceGpio extends PiFaceGpioBase {
	constructor(pin, initialValue, name) {
		super(pin, initialValue, name);
	}
}


PiFacePinFactory.createOutputPin = function(pin, name) {
	name = name || pin.name;
	let fpfg = new FakePiFaceGpio(pin, PinState.Low, pin.value);
	fpfg.pinName = name;
	fpfg.mode = PinMode.OUT;
	return fpfg;
};

PiFacePinFactory.createInputPin = function(pin, name) {
	name = name || pin.name;
	let fpfg = new FakePiFaceGpio(pin, PinState.Low, pin.value);
	fpfg.pinName = name;
	fpfg.mode = PinMode.IN;
	return fpfg;
};


module.exports.PiFaceDeviceTests = {
	disposeAndIsDisposedTest: function(assert) {
		let pfd = new PiFaceDevice();

		assert.expect(2);
		assert.ok(!pfd.isDisposed, "PiFace already disposed");

		pfd.dispose();
		assert.ok(pfd.isDisposed, "PiFace did not dispose");
		assert.done();
	},
	setHasPropertyTest: function(assert) {
		let pfd = new PiFaceDevice();
		pfd.setProperty("foo", "bar");

		assert.expect(1);
		assert.ok(pfd.hasProperty("foo"), "PiFace does not possess property 'foo'.");
		assert.done();
	},
	getLedsTest: function(assert) {
		let pfd = new PiFaceDevice();

		let allLEDs = pfd.LEDs;
		assert.expect(allLEDs.length);

		let led0name = allLEDs[PiFaceLED.LED0].pin.pinName;
		let led0expected = PiFacePins.Output00.name;
		assert.equals(led0name, led0expected, "LED 0 is not " + led0expected);

		let led1name = allLEDs[PiFaceLED.LED1].pin.pinName;
		let led1expected = PiFacePins.Output01.name;
		assert.equals(led1name, led1expected, "LED 1 is not " + led1expected);

		let led2name = allLEDs[PiFaceLED.LED2].pin.pinName;
		let led2expected = PiFacePins.Output02.name;
		assert.equals(led2name, led2expected, "LED 2 is not " + led2expected);

		let led3name = allLEDs[PiFaceLED.LED3].pin.pinName;
		let led3expected = PiFacePins.Output03.name;
		assert.equals(led3name, led3expected, "LED 3 is not " + led3expected);

		let led4name = allLEDs[PiFaceLED.LED4].pin.pinName;
		let led4expected = PiFacePins.Output04.name;
		assert.equals(led4name, led4expected, "LED 4 is not " + led4expected);

		let led5name = allLEDs[PiFaceLED.LED5].pin.pinName;
		let led5expected = PiFacePins.Output05.name;
		assert.equals(led5name, led5expected, "LED 5 is not " + led5expected);

		let led6name = allLEDs[PiFaceLED.LED6].pin.pinName;
		let led6expected = PiFacePins.Output06.name;
		assert.equals(led6name, led6expected, "LED 6 is not " + led6expected);

		let led7name = allLEDs[PiFaceLED.LED7].pin.pinName;
		let led7expected = PiFacePins.Output07.name;
		assert.equals(led7name, led7expected, "LED 7 is not " + led7expected);
		assert.done();
	},
	getRelaysTest: function(assert) {
		let pfd = new PiFaceDevice();
		let allRelays = pfd.relays;
		assert.expect(allRelays.length);

		let relay0name = allRelays[PiFaceRelay.K0].pin.pinName;
		let relay0expected = PiFacePins.Output00.name;
		assert.equals(relay0name, relay0expected, "Relay 0 is not " + relay0expected);

		let relay1name = allRelays[PiFaceRelay.K1].pin.pinName;
		let relay1expected = PiFacePins.Output01.name;
		assert.equals(relay1name, relay1expected, "Relay 1 is not " + relay1expected);
		assert.done();
	},
	getSwitchesTest: function(assert) {
		let pfd = new PiFaceDevice();
		let allSwitches = pfd.switches;
		assert.expect(allSwitches.length);

		let switch1name = allSwitches[PiFaceSwitch.S1].pin.pinName;
		let switch1expected = PiFacePins.Input00.name;
		assert.equals(switch1name, switch1expected, "Switch 1 is not " + switch1expected);

		let switch2name = allSwitches[PiFaceSwitch.S2].pin.pinName;
		let switch2expected = PiFacePins.Input01.name;
		assert.equals(switch2name, switch2expected, "Switch 2 is not " + switch2expected);

		let switch3name = allSwitches[PiFaceSwitch.S3].pin.pinName;
		let switch3expected = PiFacePins.Input02.name;
		assert.equals(switch3name, switch3expected, "Switch 3 is not " + switch3expected);

		let switch4name = allSwitches[PiFaceSwitch.S4].pin.pinName;
		let switch4expected = PiFacePins.Input03.name;
		assert.equals(switch4name, switch4expected, "Switch 4 is not " + switch4expected);
		assert.done();
	}
};
