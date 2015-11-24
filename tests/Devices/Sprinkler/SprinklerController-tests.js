'use strict';

var util = require('util');
var inherits = require('util').inherits;
var GpioBase = require('../../../src/lib/IO/GpioBase.js');
var GpioPins = require('../../../src/lib/IO/GpioPins.js');
var PinMode = require('../../../src/lib/IO/PinMode.js');
var PinState = require('../../../src/lib/IO/PinState.js');
var PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
var SprinklerZoneDevice = require('../../../src/lib/Devices/Sprinkler/SprinklerZoneDevice.js');
var RelayComponent = require('../../../src/lib/Components/Relays/RelayComponent.js');
var SprinklerControllerDevice = require('../../../src/lib/Devices/Sprinkler/SprinklerControllerDevice.js');
var SprinklerZone = require('../../../src/lib/Devices/Sprinkler/SprinklerZone.js');


function FakeGpio(pin, mode, value) {
  GpioBase.call(this, pin, mode, value);

  var self = this;
  var _overriddenState = value;
  if (util.isNullOrUndefined(_overriddenState)) {
    _overriddenState = PinState.Low;
  }

  this.read = function() {
    return _overriddenState;
  };

  this.write = function(ps) {
    if (_overriddenState !== ps) {
      var addr = pin.value;
      var evt = new PinStateChangeEvent(_overriddenState, ps, addr);
      _overriddenState = ps;
      self.onPinStateChange(evt);
    }
  };
}

FakeGpio.prototype.constructor = FakeGpio;
inherits(FakeGpio, GpioBase);


function createZone() {
	var fakePin = new FakeGpio(GpioPins.GPIO00, PinMode.OUT, PinState.Low);
	var rel = new RelayComponent(fakePin);
	return new SprinklerZoneDevice(rel);
}


module.exports.SprinklerControllerTests = {
	disposeAndIsDisposedTest: function(assert) {
		var cntlr = new SprinklerControllerDevice();
		
		assert.expect(2);
		assert.ok(!cntlr.isDisposed(), "Controller is already disposed");
		
		cntlr.dispose();
		assert.ok(cntlr.isDisposed(), "Controller did not dispose");
		assert.done();
	},
	setAndHasPropertyTest: function(assert) {
		var cntlr = new SprinklerControllerDevice();
		cntlr.setProperty("foo", "bar");
		
		assert.expect(1);
		assert.ok(cntlr.hasProperty("foo"), "Controller does not posses property 'foo'");
		assert.done();
	},
	zoneListTests: function(assert) {
		var cntlr = new SprinklerControllerDevice();
		var oldCount = cntlr.getZoneCount();
		
		assert.expect(3);
		assert.equals(oldCount, 0, "There are already zones in the list");
		
		var zone = createZone();
		cntlr.addZone(zone);
		assert.equals(cntlr.getZoneCount(), 1, "Failed to add zone");
		
		cntlr.removeZone(zone);
		assert.equals(cntlr.getZoneCount(), 0, "Failed to remove zone");
		assert.done();
	},
	setStateTest: function(assert) {
		var cntlr = new SprinklerControllerDevice();
		cntlr.addZone(createZone());
		cntlr.setState(0, true);
		
		assert.expect(1);
		assert.ok(cntlr.isOnForZone(0), "Zone 0 is not on");
		assert.done();
	},
	turnOnOffTests: function(assert) {
		var cntlr = new SprinklerControllerDevice();
		cntlr.addZone(createZone());
		cntlr.turnOn(0);
		
		assert.expect(6);
		assert.ok(cntlr.isOn(), "No zones are turned on");
		assert.ok(cntlr.isOnForZone(0), "Zone 0 is not on");
		
		cntlr.turnOff(0);
		assert.ok(cntlr.isOffForZone(0), "Zone 0 is still on");
		assert.ok(cntlr.isOff(), "One or more zones are still on");
		
		cntlr.turnOnAllZones();
		assert.ok(cntlr.isOn(), "No zones turned on");
		
		cntlr.turnOffAllZones();
		assert.ok(cntlr.isOff(), "One or more zones are still on");
		assert.done();
	},
	zoneStateChangeTest: function(assert) {
		var cntlr = new SprinklerControllerDevice();
		cntlr.addZone(createZone());
		cntlr.on(SprinklerZone.EVENT_STATE_CHANGED, function(stateChange) {
			assert.expect(2);
			assert.equals(stateChange.getOldState(), false, "Old state was not false (off)");
			assert.equals(stateChange.getNewState(), true, "New state is not true (on)");
			assert.done();
		});
		
		cntlr.turnOn(0);
	}
};