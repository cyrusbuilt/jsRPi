'use strict';

var util = require('util');
var inherits = require('util').inherits;
var GpioBase = require('../../../src/lib/IO/GpioBase.js');
var GpioPins = require('../../../src/lib/IO/GpioPins.js');
var PinMode = require('../../../src/lib/IO/PinMode.js');
var PinState = require('../../../src/lib/IO/PinState.js');
var PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
var RelayComponent = require('../../../src/lib/Components/Relays/RelayComponent.js');
var RelayState = require('../../../src/lib/Components/Relays/RelayState.js');
var SensorComponent = require('../../../src/lib/Components/Sensors/SensorComponent.js');
var SensorState = require('../../../src/lib/Components/Sensors/SensorState.js');
var FireplaceDevice = require('../../../src/lib/Devices/Fireplace/FireplaceDevice.js');
var FireplaceState = require('../../../src/lib/Devices/Fireplace/FireplaceState.js');
var TimeUnit = require('../../../src/lib/PiSystem/TimeUnit.js');


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


function createFireplace() {
	var fakePin1 = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
	var fakeRelay = new RelayComponent(fakePin1);
	
	var fakePin2 = new FakeGpio(GpioPins.GPIO04, PinMode.IN, PinState.Low);
	var fakeSensor = new SensorComponent(fakePin2);
	
	return new FireplaceDevice(fakeRelay, RelayState.Closed, fakeSensor, SensorState.Closed);
}


module.exports.FireplaceDeviceTests = {
	disposeAndIsDisposedTest: function(assert) {
		var fp = createFireplace();
		
		assert.expect(2);
		assert.ok(!fp.isDisposed(), "Fireplace is already disposed");
		
		fp.dispose();
		assert.ok(fp.isDisposed(), "Fireplace did not dispose");
		assert.done();
	},
	setHasPropertyTest: function(assert) {
		var fp = createFireplace();
		fp.setProperty("foo", "bar");
		
		assert.expect(1);
		assert.ok(fp.hasProperty("foo"), "Fireplace does not possess property 'foo'.");
		assert.done();
	},
	isPilotLightOnTest: function(assert) {
		var fp = createFireplace();
		
		assert.expect(2);
		assert.ok(!fp.isPilotLightOn(), "Pilot light is already lit");
		
		// Simulate pilot light being lit.
		fp.getPilotLightSensor().getPin().write(PinState.High);
		assert.ok(fp.isPilotLightOn(), "Pilot light is not lit");
		assert.done();
	},
	isPilotLightOffTest: function(assert) {
		var fp = createFireplace();
		
		assert.expect(1);
		assert.ok(fp.isPilotLightOff(), "Pilot light is already lit");
		assert.done();
	},
	getStateTest: function(assert) {
		var fp = createFireplace();
		
		assert.expect(2);
		assert.equals(fp.getState(), FireplaceState.Off, "Fireplace is already on");
		
		// Simulate control relay energized.
		fp.getControlRelay().getPin().write(PinState.High);
		assert.equals(fp.getState(), FireplaceState.On, "Fireplace is not on");
		assert.done();
	},
	setStateTest: function(assert) {
		var fp = createFireplace();
		
		// Simulate pilot light ignition
		fp.getPilotLightSensor().getPin().write(PinState.High);
		
		assert.expect(2);
		fp.setState(FireplaceState.On);
		assert.equals(fp.getState(), FireplaceState.On, "Fireplace is not on");
		
		fp.setState(FireplaceState.Off);
		assert.equals(fp.getState(), FireplaceState.Off, "Fireplace is still on");
		assert.done();
	},
	pilotLightExceptionTest: function(assert) {
		var fp = createFireplace();
		
		assert.expect(1);
		try {
			fp.setState(FireplaceState.On);
		}
		catch (ex) {
			// We attempted to turn on the fireplace without the pilot light being lit first.
			// This pilot light is not lit, so a FireplacePilotLightException should be thrown.
			// This is because if a pilot light sensor was provided, we will not attempt to
			// turn on the gas unless the pilot light is lit. Otherwise, there is a safety
			// hazard as we are basically just releasing a flamable gas into the open air.
			var isExpectedException = (ex.name === 'FireplacePilotLightException');
			assert.ok(isExpectedException, "An unexpected exception was thrown: " + ex.name);
		}
		finally {
			assert.done();
		}
	},
	isOffTest: function(assert) {
		var fp = createFireplace();

		assert.expect(1);
		assert.ok(fp.isOff(), "Fireplace is already on");
		assert.done();
	},
	isOnTest: function(assert) {
		var fp = createFireplace();
		
		// Simulate pilot light ignition
		fp.getPilotLightSensor().getPin().write(PinState.High);

		fp.setState(FireplaceState.On);
		assert.expect(1);
		assert.ok(fp.isOn(), "Fireplace did not turn on");
		assert.done();
	},
	getSetTimeoutDelayTest: function(assert) {
		var fp = createFireplace();
		
		// Simulate pilot light ignition
		fp.getPilotLightSensor().getPin().write(PinState.High);
		
		// We have to turn the fireplace on before setting the timeout,
		// otherwise an InvalidOperationException will be thrown.
		fp.setState(FireplaceState.On);
		fp.setTimeoutDelay(5, TimeUnit.Seconds);
		
		assert.expect(2);
		assert.equals(fp.getTimeoutDelay(), 5, "Fireplace timeout delay not 5.");
		assert.equals(fp.getTimeoutUnit(), TimeUnit.Seconds, "Fireplace timeout delay time units is not seconds");
		assert.done();
	},
	turnOnTest: function(assert) {
		var fp = createFireplace();
		
		// Simulate pilot light ignition
		fp.getPilotLightSensor().getPin().write(PinState.High);
		
		fp.turnOn(5, TimeUnit.Seconds);
		
		assert.expect(1);
		assert.ok(fp.isOn(), "Fireplace did not turn on");
		
		fp.cancelTimeout();
		assert.done();
	},
	turnOffTest: function(assert) {
		var fp = createFireplace();
		
		// Simulate pilot light ignition
		fp.getPilotLightSensor().getPin().write(PinState.High);
		
		fp.turnOn(5, TimeUnit.Seconds);
		
		assert.expect(2);
		assert.ok(fp.isOn(), "Fireplace did not turn on");
		
		fp.turnOff();
		assert.ok(fp.isOff(), "Fireplace did not turn off");
		
		fp.cancelTimeout();
		assert.done();
	},
	shutdownTest: function(assert) {
		var fp = createFireplace();
		
		// Simulate pilot light ignition
		fp.getPilotLightSensor().getPin().write(PinState.High);
		
		fp.turnOn(5, TimeUnit.Seconds);
		
		assert.expect(2);
		assert.ok(fp.isOn(), "Fireplace did not turn on");
		
		fp.shutdown();
		assert.ok(fp.isOff(), "Fireplace did not shutdown");
		assert.done();
	}
};