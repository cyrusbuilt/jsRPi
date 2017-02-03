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

const util = require('util');
const GpioBase = require('../../../src/lib/IO/GpioBase.js');
const GpioPins = require('../../../src/lib/IO/GpioPins.js');
const PinMode = require('../../../src/lib/IO/PinMode.js');
const PinState = require('../../../src/lib/IO/PinState.js');
const PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
const PiBrellaInput = require('../../../src/lib/Devices/PiBrella/PiBrellaInput.js');
const PiBrellaOutput = require('../../../src/lib/Devices/PiBrella/PiBrellaOutput.js');


class FakeGpio extends GpioBase {
    constructor(pin, mode, value) {
        super(pin, mode, value);

        this._overriddenState = value;
        if (util.isNullOrUndefined(this._overriddenState)) {
            this._overriddenState = PinState.Low;
        }
    }

    read() {
        return this._overriddenState;
    }

    write(ps) {
        if (this._overriddenState !== ps) {
            let addr = this.innerPin.value;
            let evt = new PinStateChangeEvent(this._overriddenState, ps, addr);
            this._overriddenState = ps;
            this.onPinStateChange(evt);
        }
    }

    provision() {
        // No-op
    }

    setPWM(pwm) {
        // No-op
    }
}


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

const PiBrellaDevice = require('../../../src/lib/Devices/PiBrella/PiBrellaDevice.js');

module.exports.PiBrellaDeviceTests = {
	disposeAndIsDisposedTest: function(assert) {
		let pb = new PiBrellaDevice();

		assert.expect(2);
		assert.ok(!pb.isDisposed, "PiBrella is already disposed");

		pb.dispose();
		assert.ok(pb.isDisposed, "PiBrella did not dispose");
		assert.done();
	},
	setHasPropertyTest: function(assert) {
		let pb = new PiBrellaDevice();
		pb.setProperty("foo", "bar");

		assert.expect(1);
		assert.ok(pb.hasProperty("foo"), "The PiBrella does not possess property 'foo'.");
		assert.done();
	},
	getRedLEDtest: function(assert) {
		let pb = new PiBrellaDevice();
		let l = pb.redLED.pin;

		assert.expect(1);
		assert.equals(l.pinName, "RED LED", "LED is not RED LED.");
		assert.done();
	},
	getYellowLEDtest: function(assert) {
		let pb = new PiBrellaDevice();
		let l = pb.yellowLED.pin;

		assert.expect(1);
		assert.equals(l.pinName, "YELLOW LED", "LED is not YELLOW LED.");
		assert.done();
	},
	getGreenLEDtest: function(assert) {
		let pb = new PiBrellaDevice();
		let l = pb.greenLED.pin;

		assert.expect(1);
		assert.equals(l.pinName, "GREEN LED", "LED is not GREEN LED.");
		assert.done();
	},
	getButtonTest: function(assert) {
		let pb = new PiBrellaDevice();
		let l = pb.button.pin;

		assert.expect(1);
		assert.equals(l.pinName, "BUTTON", "Pin is not BUTTON.");
		assert.done();
	},
	getBuzzerTest: function(assert) {
		let pb = new PiBrellaDevice();
		let l = pb.buzzer;

		assert.expect(1);
		assert.equals(l.componentName, "PIBRELLA BUZZER", "PiBrella component is not the buzzer");
		assert.done();
	},
	getInputAtest: function(assert) {
		let pb = new PiBrellaDevice();

		assert.expect(1);
		assert.equals(pb.inputA.pinName, "INPUT A", "PiBrella component is not INPUT A");
		assert.done();
	},
	getInputBtest: function(assert) {
		let pb = new PiBrellaDevice();

		assert.expect(1);
		assert.equals(pb.inputB.pinName, "INPUT B", "PiBrella component is not INPUT B");
		assert.done();
	},
	getInputCtest: function(assert) {
		let pb = new PiBrellaDevice();

		assert.expect(1);
		assert.equals(pb.inputC.pinName, "INPUT C", "PiBrella component is not INPUT C");
		assert.done();
	},
	getInputDtest: function(assert) {
		let pb = new PiBrellaDevice();

		assert.expect(1);
		assert.equals(pb.inputD.pinName, "INPUT D", "PiBrella component is not INPUT D");
		assert.done();
	},
	getOutputEtest: function(assert) {
		let pb = new PiBrellaDevice();

		assert.expect(1);
		assert.equals(pb.outputE.pinName, "OUTPUT E", "PiBrella component is not OUTPUT E");
		assert.done();
	},
	getOutputFtest: function(assert) {
		let pb = new PiBrellaDevice();

		assert.expect(1);
		assert.equals(pb.outputF.pinName, "OUTPUT F", "PiBrella component is not OUTPUT F");
		assert.done();
	},
	getOutputGtest: function(assert) {
		let pb = new PiBrellaDevice();

		assert.expect(1);
		assert.equals(pb.outputG.pinName, "OUTPUT G", "PiBrella component is not OUTPUT G");
		assert.done();
	},
	getOutputHtest: function(assert) {
		let pb = new PiBrellaDevice();

		assert.expect(1);
		assert.equals(pb.outputH.pinName, "OUTPUT H", "PiBrella component is not OUTPUT H");
		assert.done();
	}
};
