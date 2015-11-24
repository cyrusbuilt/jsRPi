'use strict';

var util = require('util');
var inherits = require('util').inherits;
var GpioBase = require('../../../src/lib/IO/GpioBase.js');
var GpioPins = require('../../../src/lib/IO/GpioPins.js');
var PinMode = require('../../../src/lib/IO/PinMode.js');
var PinState = require('../../../src/lib/IO/PinState.js');
var PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
var SwitchComponent = require('../../../src/lib/Components/Switches/SwitchComponent.js');
var Switch = require('../../../src/lib/Components/Switches/Switch.js');
var SwitchState = require('../../../src/lib/Components/Switches/SwitchState.js');


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


module.exports.SwitchComponentTests = {
	disposeAndIsDisposedTest: function(assert) {
		var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		var sc = new SwitchComponent(fakePin);
		
		assert.expect(2);
		assert.ok(!sc.isDisposed(), "Switch already disposed");
		
		sc.dispose();
		assert.ok(sc.isDisposed(), "Switch did not dispose");
		assert.done();
	},
	setHasPropertyTest: function(assert) {
		var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		var sc = new SwitchComponent(fakePin);
		sc.setProperty("foo", "bar");
		
		assert.expect(1);
		assert.ok(sc.hasProperty("foo"), "Property 'foo' not present");
		assert.done();
	},
	getStateTest: function(assert) {
		var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		var sc = new SwitchComponent(fakePin);
		
		assert.expect(2);
		assert.equals(sc.getState(), SwitchState.Off, "Switch is already on");
		
		fakePin.write(PinState.High);
		assert.equals(sc.getState(), SwitchState.On, "Switch is not on");
		assert.done();
	},
	isStateTest: function(assert) {
		var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		var sc = new SwitchComponent(fakePin);
		
		assert.expect(2);
		assert.ok(sc.isState(SwitchState.Off), "Switch is not off");
		
		fakePin.write(PinState.High);
		assert.ok(sc.isState(SwitchState.On), "Switch is not on");
		assert.done();
	},
	isOnTest: function(assert) {
		var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		var sc = new SwitchComponent(fakePin);
		fakePin.write(PinState.High);
		
		assert.expect(1);
		assert.ok(sc.isOn(), "Switch is not on");
		assert.done();
	},
	isOffTest: function(assert) {
		var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		var sc = new SwitchComponent(fakePin);
		
		assert.expect(1);
		assert.ok(sc.isOff(), "Switch is not off");
		assert.done();
	},
	pollTest: function(assert) {
		var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		var sc = new SwitchComponent(fakePin);
		
		assert.expect(2);
		assert.ok(!sc.isPolling(), "Switch is already polling");
		
		sc.poll();
		assert.ok(sc.isPolling(), "Switch is not polling");
		assert.done();
	},
	stateChangeTest: function(assert) {
		var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		var sc = new SwitchComponent(fakePin);
		sc.on(Switch.EVENT_STATE_CHANGED, function(stateChanged) {
			assert.expect(2);
			assert.equals(stateChanged.getOldState(), SwitchState.Off, "Old switch state not off");
			assert.equals(stateChanged.getNewState(), SwitchState.On, "New state not on");
			assert.done();
		});
		
		sc.poll();
		fakePin.write(PinState.High);
		
		setTimeout(function() {
			sc.interruptPoll();
		}, 225);
	}
};