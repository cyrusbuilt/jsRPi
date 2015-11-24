'use strict';

var util = require('util');
var inherits = require('util').inherits;
var GpioBase = require('../../../src/lib/IO/GpioBase.js');
var GpioPins = require('../../../src/lib/IO/GpioPins.js');
var PinMode = require('../../../src/lib/IO/PinMode.js');
var PinState = require('../../../src/lib/IO/PinState.js');
var PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
var Switch = require('../../../src/lib/Components/Switches/Switch.js');
var SwitchState = require('../../../src/lib/Components/Switches/SwitchState.js');
var MomentarySwitchComponent = require('../../../src/lib/Components/Switches/MomentarySwitchComponent.js');


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


module.exports.MomentarySwitchComponentTests = {
	disposeAndIsDisposedTest: function(assert) {
		var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		var msc = new MomentarySwitchComponent(fakePin);
		
		assert.expect(2);
		assert.ok(!msc.isDisposed(), "Momentary switch is already disposed");
		
		msc.dispose();
		assert.ok(msc.isDisposed(), "Momentary switch is not disposed");
		assert.done();
	},
	setHasPropertyTest: function(assert) {
		var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		var msc = new MomentarySwitchComponent(fakePin);
		msc.setProperty("foo", "bar");
		
		assert.expect(1);
		assert.ok(msc.hasProperty("foo"), "Propery 'foo' not present");
		assert.done();
	},
	getStateTest: function(assert) {
		var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		var msc = new MomentarySwitchComponent(fakePin);
		
		assert.expect(2);
		assert.equals(msc.getState(), SwitchState.Off, "Momentary switch state is not off");
		
		fakePin.write(PinState.High);
		assert.equals(msc.getState(), SwitchState.On, "Momentary switch is not on");
		assert.done();
	},
	isStateTest: function(assert) {
		var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		var msc = new MomentarySwitchComponent(fakePin);
		
		assert.expect(1);
		assert.ok(msc.isState(SwitchState.Off), "Momentary switch is not on");
		assert.done();
	},
	isOnTest: function(assert) {
		var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		var msc = new MomentarySwitchComponent(fakePin);
		
		assert.expect(2);
		assert.ok(!msc.isOn(), "Momentary switch is already on");
		
		fakePin.write(PinState.High);
		assert.ok(msc.isOn(), "Momentary switch is not on");
		assert.done();
	},
	isOffTest: function(assert) {
		var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		var msc = new MomentarySwitchComponent(fakePin);
		
		assert.expect(1);
		assert.ok(msc.isOff(), "Momentary switch is not off");
		assert.done();
	},
	pollTest: function(assert) {
		var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		var msc = new MomentarySwitchComponent(fakePin);
		
		assert.expect(2);
		assert.ok(!msc.isPolling(), "Momentary switch is already polling");
		
		msc.poll();
		assert.ok(msc.isPolling(), "Momentary switch is not polling");
		
		msc.interruptPoll();
		assert.done();
	},
	stateChangeTest: function(assert) {
		var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
		var msc = new MomentarySwitchComponent(fakePin);
		msc.on(Switch.EVENT_STATE_CHANGED, function(stateChanged) {
			assert.expect(2);
			assert.equals(stateChanged.getOldState(), SwitchState.Off, "Old momentary switch state is not off");
			assert.equals(stateChanged.getNewState(), SwitchState.On, "New momentary switch state is not on");
			assert.done();
		});
		
		msc.poll();
		fakePin.write(PinState.High);
		
		setTimeout(function() {
			msc.interruptPoll();
		}, 225);
	}
};