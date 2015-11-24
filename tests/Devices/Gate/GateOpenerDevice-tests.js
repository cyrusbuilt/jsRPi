'use strict';

var util = require('util');
var inherits = require('util').inherits;
var GpioBase = require('../../../src/lib/IO/GpioBase.js');
var GpioPins = require('../../../src/lib/IO/GpioPins.js');
var PinMode = require('../../../src/lib/IO/PinMode.js');
var PinState = require('../../../src/lib/IO/PinState.js');
var PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
var RelayComponent = require('../../../src/lib/Components/Relays/RelayComponent.js');
var SensorComponent = require('../../../src/lib/Components/Sensors/SensorComponent.js');
var SensorState = require('../../../src/lib/Components/Sensors/SensorState.js');
var SwitchComponent = require('../../../src/lib/Components/Switches/SwitchComponent.js');
var GateOpener = require('../../../src/lib/Devices/Gate/GateOpener');
var GateOpenerDevice = require('../../../src/lib/Devices/Gate/GateOpenerDevice');
var Opener = require('../../../src/lib/Devices/Access/Opener.js');
var OpenerState = require('../../../src/lib/Devices/Access/OpenerState.js');


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


function createGateOpener() {
	var fakePin1 = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
	var fakeRelay = new RelayComponent(fakePin1);
	
	var fakePin2 = new FakeGpio(GpioPins.GPIO04, PinMode.IN, PinState.Low);
	var fakeSensor = new SensorComponent(fakePin2);
	
	var fakePin3 = new FakeGpio(GpioPins.GPIO07, PinMode.IN, PinState.Low);
	var fakeSwitch = new SwitchComponent(fakePin3);
	
	return new GateOpenerDevice(fakeRelay, fakeSensor, SensorState.Open, fakeSwitch);
}


module.exports.GateOpenerDeviceTests = {
	disposeAndIsDisposedTest: function(assert) {
		var fakeOpener = createGateOpener();
		
		assert.expect(2);
		assert.ok(!fakeOpener.isDisposed(), "Garage Door is already disposed");
		
		fakeOpener.dispose();
		assert.ok(fakeOpener.isDisposed(), "Garage Door did not dispose");
		assert.done();
	},
	setHasPropertyTest: function(assert) {
		var fakeOpener = createGateOpener();
		fakeOpener.setProperty("foo", "bar");
		
		assert.expect(1);
		assert.ok(fakeOpener.hasProperty("foo"), "Property 'foo' not present in Garage Door object");
		assert.done();
	},
	getStateTest: function(assert) {
		var fakeOpener = createGateOpener();
		
		assert.expect(2);
		assert.equals(fakeOpener.getState(), OpenerState.Open, "Garage Door is not open");
		
		fakeOpener.getStateSensor().getPin().write(PinState.High);  // Trick the sensor
		assert.equals(fakeOpener.getState(), OpenerState.Closed, "Garage Door is not closed");
		assert.done();
	},
	isOpenTest: function(assert) {
		var fakeOpener = createGateOpener();
		
		assert.expect(1);
		assert.ok(fakeOpener.isOpen(), "Garage Door is not open");
		assert.done();
	},
	isClosedTest: function(assert) {
		var fakeOpener = createGateOpener();
		fakeOpener.getStateSensor().getPin().write(PinState.High);
		
		assert.expect(1);
		assert.ok(fakeOpener.isClosed(), "Garage Door is not closed");
		assert.done();
	},
	isLockedTest: function(assert) {
		var fakeOpener = createGateOpener();
		fakeOpener.getLockSwitch().getPin().write(PinState.High);
		
		assert.expect(1);
		assert.ok(fakeOpener.isLocked(), "Garage Door is not locked");
		assert.done();
	},
	overrideLockTest: function(assert) {
		var fakeOpener = createGateOpener();
		fakeOpener.overrideLock(OpenerState.Closed);
		
		assert.expect(2);
		assert.ok(fakeOpener.isLocked(), "Garage Door lock did not override");
		
		fakeOpener.disableOverride();
		assert.ok(!fakeOpener.isLocked(), "Garage Door lock override not disabled");
		assert.done();
	},
	openTest: function(assert) {
		var fakeOpener = createGateOpener();
		
		// Trick the opener into thinking it is closed.
		fakeOpener.getStateSensor().getPin().write(PinState.High);
		
		fakeOpener.on(Opener.EVENT_STATE_CHANGED, function(stateChanged) {
			assert.expect(2);
			assert.equals(stateChanged.getOldState(), OpenerState.Closed, "Garage Door was not already closed");
			assert.equals(stateChanged.getNewState(), OpenerState.Open, "Garage Door did not open");
			assert.done();
		});
		
		fakeOpener.open();
		
		// Now trick the opener into thinking it is open.
		fakeOpener.getStateSensor().getPin().write(PinState.Low);
	},
	closeTest: function(assert) {
		var fakeOpener = createGateOpener();
		
		// Trick the opener into thinking it is open.
		fakeOpener.getStateSensor().getPin().write(PinState.Low);
		
		fakeOpener.on(Opener.EVENT_STATE_CHANGED, function(stateChanged) {
			assert.expect(2);
			assert.equals(stateChanged.getOldState(), OpenerState.Open, "Garage Door was not already open");
			assert.equals(stateChanged.getNewState(), OpenerState.Closed, "Garage Door did not close");
			assert.done();
		});
		
		fakeOpener.close();
		
		// Now trick the opener into thinking it is closed.
		fakeOpener.getStateSensor().getPin().write(PinState.High);
	},
	testLockStateChange: function(assert) {
		var fakeOpener = createGateOpener();
		fakeOpener.on(Opener.EVENT_LOCK_STATE_CHANGED, function(lockChanged) {
			assert.expect(1);
			assert.ok(lockChanged.isLocked(), "Garage Door did not lock");
			assert.done();
		});
		
		// Trick the opener into thinking it is locked.
		fakeOpener.getLockSwitch().getPin().write(PinState.High);
	}
};