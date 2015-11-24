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


function createRelay() {
	var fakePin = new FakeGpio(GpioPins.GPIO00, PinMode.OUT, PinState.Low);
	return new RelayComponent(fakePin);
}


module.exports.SprinklerZoneDeviceTests = {
	disposeAndIsDisposedTest: function(assert) {
		var zone = new SprinklerZoneDevice(createRelay());
		
		assert.expect(2);
		assert.ok(!zone.isDisposed(), "Zone is already disposed");
		
		zone.dispose();
		assert.ok(zone.isDisposed(), "Zone did not dispose");
		assert.done();
	},
	setAndHasPropertyTest: function(assert) {
		var zone = new SprinklerZoneDevice(createRelay());
		zone.setProperty("foo", "bar");
		
		assert.expect(1);
		assert.ok(zone.hasProperty("foo"), "Zone does not possess property 'foo'");
		assert.done();
	},
	setStateTest: function(assert) {
		var zone = new SprinklerZoneDevice(createRelay());
		
		assert.expect(2);
		assert.ok(zone.isOff(), "Zone is already on");
		
		zone.setState(true);
		assert.ok(zone.isOn(), "Zone is still off");
		assert.done();
	},
	turnOnTest: function(assert) {
		var zone = new SprinklerZoneDevice(createRelay());
		zone.turnOn();
		
		assert.expect(1);
		assert.ok(zone.isOn(), "Zone did not turn on");
		assert.done();
	},
	turnOffTest: function(assert) {
		var zone = new SprinklerZoneDevice(createRelay());
		zone.turnOn();
		
		assert.expect(2);
		assert.ok(zone.isOn(), "Zone did not turn on");
		
		zone.turnOff();
		assert.ok(zone.isOff(), "Zone is still on");
		assert.done();
	}
};