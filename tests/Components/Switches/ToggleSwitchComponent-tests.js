'use strict';

var util = require('util');
var inherits = require('util').inherits;
var GpioBase = require('../../../src/lib/IO/GpioBase.js');
var GpioPins = require('../../../src/lib/IO/GpioPins.js');
var PinMode = require('../../../src/lib/IO/PinMode.js');
var PinState = require('../../../src/lib/IO/PinState.js');
var PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
var ToggleSwitchComponent = require('../../../src/lib/Components/Switches/ToggleSwitchComponent.js');
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


module.exports.ToggleSwitchComponentTests = {
	disposeAndIsDisposedTest: function(assert) {
		var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		var tsc = new ToggleSwitchComponent(fakePin);
		
		assert.expect(2);
		assert.ok(!tsc.isDisposed(), "Toggle switch already disposed");
		
		tsc.dispose();
		assert.ok(tsc.isDisposed(), "Toggle switch did not dispose");
		assert.done();
	},
	setHasPropertyTest: function(assert) {
		var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		var tsc = new ToggleSwitchComponent(fakePin);
		tsc.setProperty("foo", "bar");
		
		assert.expect(1);
		assert.ok(tsc.hasProperty("foo"), "Property 'foo' not present");
		assert.done();
	},
	getStateTest: function(assert) {
		var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		var tsc = new ToggleSwitchComponent(fakePin);
		
		assert.expect(2);
		assert.equals(tsc.getState(), SwitchState.Off, "Toggle switch is not off");
		
		fakePin.write(PinState.High);
		assert.equals(tsc.getState(), SwitchState.On, "Toggle switch is not on");
		assert.done();
	},
	isStateTest: function(assert) {
		var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		var tsc = new ToggleSwitchComponent(fakePin);
		
		assert.expect(1);
		assert.ok(tsc.isState(SwitchState.Off), "Toggle switch is not off");
		assert.done();
	},
	isOnTest: function(assert) {
		var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		var tsc = new ToggleSwitchComponent(fakePin);
		
		assert.expect(2);
		assert.ok(!tsc.isOn(), "Toggle switch is already on");
		
		fakePin.write(PinState.High);
		assert.ok(tsc.isOn(), "Toggle switch did not switch on");
		assert.done();
	},
	isOffTest: function(assert) {
		var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		var tsc = new ToggleSwitchComponent(fakePin);
		
		assert.expect(1);
		assert.ok(tsc.isOff(), "Toggle switch is not off");
		assert.done();
	},
	pollTest: function(assert) {
		var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		var tsc = new ToggleSwitchComponent(fakePin);
		
		assert.expect(2);
		assert.ok(!tsc.isPolling(), "Toggle switch is already polling");
		
		tsc.poll();
		assert.ok(tsc.isPolling(), "Toggle switch is not polling");
		
		tsc.interruptPoll();
		assert.done();
	},
	stateChangeTest: function(assert) {
		var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		var tsc = new ToggleSwitchComponent(fakePin);
		tsc.on(Switch.EVENT_STATE_CHANGED, function(stateChanged) {
			assert.expect(2);
			assert.equals(stateChanged.getOldState(), SwitchState.Off, "Old toggle switch state is not off");
			assert.equals(stateChanged.getNewState(), SwitchState.On, "New toggle switch state is not on");
			assert.done();
		});
		
		tsc.poll();
		fakePin.write(PinState.High);
		
		setTimeout(function() {
			tsc.interruptPoll();
		}, 225);
	}
};