'use strict';

var util = require('util');
var inherits = require('util').inherits;
var PiFaceDevice = require('../../../src/lib/Devices/PiFace/PiFaceDevice.js');
var PiFaceLED = require('../../../src/lib/Devices/PiFace/PiFaceLED.js');
var PiFaceRelay = require('../../../src/lib/Devices/PiFace/PiFaceRelay.js');
var PiFaceSwitch = require('../../../src/lib/Devices/PiFace/PiFaceSwitch.js');
var PiFaceGpioBase = require('../../../src/lib/IO/PiFaceGpioBase.js');
var PiFacePins = require('../../../src/lib/IO/PiFacePins.js');
var PiFacePinFactory = require('../../../src/lib/IO/PiFacePinFactory.js');
var PinState = require('../../../src/lib/IO/PinState.js');
var PinMode = require('../../../src/lib/IO/PinMode.js');
var PinPullResistance = require('../../../src/lib/IO/PinPullResistance.js');


function FakePiFaceGpio(pin, initialValue, name) {
	PiFaceGpioBase.call(this, pin, initialValue, name);
}

FakePiFaceGpio.prototype.constructor = FakePiFaceGpio;
inherits(FakePiFaceGpio, PiFaceGpioBase);


PiFacePinFactory.createOutputPin = function(pin, name) {
	name = name || pin.name;
	var fpfg = new FakePiFaceGpio(pin, PinState.Low, pin.value);
	fpfg.pinName = name;
	fpfg.setMode(PinMode.OUT);
	return fpfg;
};

PiFacePinFactory.createInputPin = function(pin, name) {
	name = name || pin.name;
	var fpfg = new FakePiFaceGpio(pin, PinState.Low, pin.value);
	fpfg.pinName = name;
	fpfg.setMode(PinMode.IN);
	return fpfg;
};


module.exports.PiFaceDeviceTests = {
	disposeAndIsDisposedTest: function(assert) {
		var pfd = new PiFaceDevice();
		
		assert.expect(2);
		assert.ok(!pfd.isDisposed(), "PiFace already disposed");
		
		pfd.dispose();
		assert.ok(pfd.isDisposed(), "PiFace did not dispose");
		assert.done();
	},
	setHasPropertyTest: function(assert) {
		var pfd = new PiFaceDevice();
		pfd.setProperty("foo", "bar");
		
		assert.expect(1);
		assert.ok(pfd.hasProperty("foo"), "PiFace does not possess property 'foo'.");
		assert.done();
	},
	getLedsTest: function(assert) {
		var pfd = new PiFaceDevice();
		
		
		var allLEDs = pfd.getLEDs();
		assert.expect(allLEDs.length);
		
		var led0name = allLEDs[PiFaceLED.LED0].getPin().pinName;
		var led0expected = PiFacePins.Output00.name;
		assert.equals(led0name, led0expected, "LED 0 is not " + led0expected);
		
		var led1name = allLEDs[PiFaceLED.LED1].getPin().pinName;
		var led1expected = PiFacePins.Output01.name;
		assert.equals(led1name, led1expected, "LED 1 is not " + led1expected);
		
		var led2name = allLEDs[PiFaceLED.LED2].getPin().pinName;
		var led2expected = PiFacePins.Output02.name;
		assert.equals(led2name, led2expected, "LED 2 is not " + led2expected);
		
		var led3name = allLEDs[PiFaceLED.LED3].getPin().pinName;
		var led3expected = PiFacePins.Output03.name;
		assert.equals(led3name, led3expected, "LED 3 is not " + led3expected);
		
		var led4name = allLEDs[PiFaceLED.LED4].getPin().pinName;
		var led4expected = PiFacePins.Output04.name;
		assert.equals(led4name, led4expected, "LED 4 is not " + led4expected);
		
		var led5name = allLEDs[PiFaceLED.LED5].getPin().pinName;
		var led5expected = PiFacePins.Output05.name;
		assert.equals(led5name, led5expected, "LED 5 is not " + led5expected);
		
		var led6name = allLEDs[PiFaceLED.LED6].getPin().pinName;
		var led6expected = PiFacePins.Output06.name;
		assert.equals(led6name, led6expected, "LED 6 is not " + led6expected);
		
		var led7name = allLEDs[PiFaceLED.LED7].getPin().pinName;
		var led7expected = PiFacePins.Output07.name;
		assert.equals(led7name, led7expected, "LED 7 is not " + led7expected);
		assert.done();
	},
	getRelaysTest: function(assert) {
		var pfd = new PiFaceDevice();
		var allRelays = pfd.getRelays();
		assert.expect(allRelays.length);
		
		var relay0name = allRelays[PiFaceRelay.K0].getPin().pinName;
		var relay0expected = PiFacePins.Output00.name;
		assert.equals(relay0name, relay0expected, "Relay 0 is not " + relay0expected);
		
		var relay1name = allRelays[PiFaceRelay.K1].getPin().pinName;
		var relay1expected = PiFacePins.Output01.name;
		assert.equals(relay1name, relay1expected, "Relay 1 is not " + relay1expected);
		assert.done();
	},
	getSwitchesTest: function(assert) {
		var pfd = new PiFaceDevice();
		var allSwitches = pfd.getSwitches();
		assert.expect(allSwitches.length);
		
		var switch1name = allSwitches[PiFaceSwitch.S1].getPin().pinName;
		var switch1expected = PiFacePins.Input00.name;
		assert.equals(switch1name, switch1expected, "Switch 1 is not " + switch1expected);
		
		var switch2name = allSwitches[PiFaceSwitch.S2].getPin().pinName;
		var switch2expected = PiFacePins.Input01.name;
		assert.equals(switch2name, switch2expected, "Switch 2 is not " + switch2expected);
		
		var switch3name = allSwitches[PiFaceSwitch.S3].getPin().pinName;
		var switch3expected = PiFacePins.Input02.name;
		assert.equals(switch3name, switch3expected, "Switch 3 is not " + switch3expected);
		
		var switch4name = allSwitches[PiFaceSwitch.S4].getPin().pinName;
		var switch4expected = PiFacePins.Input03.name;
		assert.equals(switch4name, switch4expected, "Switch 4 is not " + switch4expected);
		assert.done();
	}
};