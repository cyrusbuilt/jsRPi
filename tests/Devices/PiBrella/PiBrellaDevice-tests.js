'use strict';


// The following code is meant to override the PiBrella inputs and outputs
// definitions. This is so we can run our unit tests on non-raspi hosts.
// This basically allows us to 'simulate' the pins instead so that we
// can run our tests. Otherwise, when the PiBrellaDevice constructor is
// called it will throw an exception (ENOENT error) because the underlying
// filesystem path to the actual pin does not exist on non-raspi hosts.
// The constructor calls the privision() method on the pins which involves
// writing to the pin. Since the path does actually exist, this will not
// be possible.  If you are running these tests on an actual raspi host
// however, you can comment all this code to test proper initialization
// of the pins.

var util = require('util');
var inherits = require('util').inherits;
var GpioBase = require('../../../src/lib/IO/GpioBase.js');
var GpioPins = require('../../../src/lib/IO/GpioPins.js');
var PinMode = require('../../../src/lib/IO/PinMode.js');
var PinState = require('../../../src/lib/IO/PinState.js');
var PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
var PiBrellaInput = require('../../../src/lib/Devices/PiBrella/PiBrellaInput.js');
var PiBrellaOutput = require('../../../src/lib/Devices/PiBrella/PiBrellaOutput.js');


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
	
  this.provision = function() {
	  // No-op
  };
	
  this.setPWM = function(pwm) {
	 // No-op 
  };
}

FakeGpio.prototype.constructor = FakeGpio;
inherits(FakeGpio, GpioBase);


PiBrellaInput.A = new FakeGpio(GpioPins.Pin13, PinMode.IN, PinState.Low);
PiBrellaInput.B = new FakeGpio(GpioPins.GPIO11, PinMode.IN, PinState.Low);
PiBrellaInput.C = new FakeGpio(GpioPins.GPIO10, PinMode.IN, PinState.Low);
PiBrellaInput.D = new FakeGpio(GpioPins.Pin12, PinMode.IN, PinState.Low);
PiBrellaInput.BUTTON = new FakeGpio(GpioPins.GPIO14, PinMode.IN, PinState.Low);

PiBrellaOutput.E = new FakeGpio(GpioPins.V2_GPIO03, PinMode.OUT, PinState.Low);
PiBrellaOutput.F = new FakeGpio(GpioPins.GPIO04, PinMode.OUT, PinState.Low);
PiBrellaOutput.G = new FakeGpio(GpioPins.Pin05, PinMode.OUT, PinState.Low);
PiBrellaOutput.H = new FakeGpio(GpioPins.V2_P5_Pin06, PinMode.OUT, PinState.Low);
PiBrellaOutput.LED_RED = new FakeGpio(GpioPins.V2_GPIO02, PinMode.OUT, PinState.Low);
PiBrellaOutput.LED_YELLOW = new FakeGpio(GpioPins.GPIO00, PinMode.OUT, PinState.Low);
PiBrellaOutput.LED_GREEN = new FakeGpio(GpioPins.GPIO07, PinMode.OUT, PinState.Low);
PiBrellaOutput.BUZZER = new FakeGpio(GpioPins.GPIO01, PinMode.PWM, PinState.Low);


// COMMENT ALL OF THE ABOVE CODE TO TEST NATIVE ACCESS TO PINS IF RUNNING THESE 
// TESTS ON AN ACTUAL RASPI HOST.

var PiBrellaDevice = require('../../../src/lib/Devices/PiBrella/PiBrellaDevice.js');

module.exports.PiBrellaDeviceTests = {
	disposeAndIsDisposedTest: function(assert) {
		var pb = new PiBrellaDevice();
		
		assert.expect(2);
		assert.ok(!pb.isDisposed(), "PiBrella is already disposed");
		
		pb.dispose();
		assert.ok(pb.isDisposed(), "PiBrella did not dispose");
		assert.done();
	},
	setHasPropertyTest: function(assert) {
		var pb = new PiBrellaDevice();
		pb.setProperty("foo", "bar");
		
		assert.expect(1);
		assert.ok(pb.hasProperty("foo"), "The PiBrella does not possess property 'foo'.");
		assert.done();
	},
	getRedLEDtest: function(assert) {
		var pb = new PiBrellaDevice();
		var l = pb.getRedLED().getPin();
		
		assert.expect(1);
		assert.equals(l.pinName, "RED LED", "LED is not RED LED.");
		assert.done();
	},
	getYellowLEDtest: function(assert) {
		var pb = new PiBrellaDevice();
		var l = pb.getYellowLED().getPin();
		
		assert.expect(1);
		assert.equals(l.pinName, "YELLOW LED", "LED is not YELLOW LED.");
		assert.done();
	},
	getGreenLEDtest: function(assert) {
		var pb = new PiBrellaDevice();
		var l = pb.getGreenLED().getPin();
		
		assert.expect(1);
		assert.equals(l.pinName, "GREEN LED", "LED is not GREEN LED.");
		assert.done();
	},
	getButtonTest: function(assert) {
		var pb = new PiBrellaDevice();
		var l = pb.getButton().getPin();
		
		assert.expect(1);
		assert.equals(l.pinName, "BUTTON", "Pin is not BUTTON.");
		assert.done();
	},
	getBuzzerTest: function(assert) {
		var pb = new PiBrellaDevice();
		var l = pb.getBuzzer();
		
		assert.expect(1);
		assert.equals(l.componentName, "PIBRELLA BUZZER", "PiBrella component is not the buzzer");
		assert.done();
	},
	getInputAtest: function(assert) {
		var pb = new PiBrellaDevice();
		var l = pb.getInputA();
		
		assert.expect(1);
		assert.equals(l.pinName, "INPUT A", "PiBrella component is not INPUT A");
		assert.done();
	},
	getInputBtest: function(assert) {
		var pb = new PiBrellaDevice();
		var l = pb.getInputB();
		
		assert.expect(1);
		assert.equals(l.pinName, "INPUT B", "PiBrella component is not INPUT B");
		assert.done();
	},
	getInputCtest: function(assert) {
		var pb = new PiBrellaDevice();
		var l = pb.getInputC();
		
		assert.expect(1);
		assert.equals(l.pinName, "INPUT C", "PiBrella component is not INPUT C");
		assert.done();
	},
	getInputDtest: function(assert) {
		var pb = new PiBrellaDevice();
		var l = pb.getInputD();
		
		assert.expect(1);
		assert.equals(l.pinName, "INPUT D", "PiBrella component is not INPUT D");
		assert.done();
	},
	getOutputEtest: function(assert) {
		var pb = new PiBrellaDevice();
		var l = pb.getOutputE();
		
		assert.expect(1);
		assert.equals(l.pinName, "OUTPUT E", "PiBrella component is not OUTPUT E");
		assert.done();
	},
	getOutputFtest: function(assert) {
		var pb = new PiBrellaDevice();
		var l = pb.getOutputF();
		
		assert.expect(1);
		assert.equals(l.pinName, "OUTPUT F", "PiBrella component is not OUTPUT F");
		assert.done();
	},
	getOutputGtest: function(assert) {
		var pb = new PiBrellaDevice();
		var l = pb.getOutputG();
		
		assert.expect(1);
		assert.equals(l.pinName, "OUTPUT G", "PiBrella component is not OUTPUT G");
		assert.done();
	},
	getOutputHtest: function(assert) {
		var pb = new PiBrellaDevice();
		var l = pb.getOutputH();
		
		assert.expect(1);
		assert.equals(l.pinName, "OUTPUT H", "PiBrella component is not OUTPUT H");
		assert.done();
	}
};