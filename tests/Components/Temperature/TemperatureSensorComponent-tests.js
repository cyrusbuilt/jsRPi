'use strict';

const util = require('util');
const GpioBase = require('../../../src/lib/IO/GpioBase.js');
const GpioPins = require('../../../src/lib/IO/GpioPins.js');
const PinMode = require('../../../src/lib/IO/PinMode.js');
const PinState = require('../../../src/lib/IO/PinState.js');
const PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
const TemperatureSensor = require('../../../src/lib/Components/Temperature/TemperatureSensor.js');
const TemperatureScale = require('../../../src/lib/Components/Temperature/TemperatureScale.js');
const TemperatureSensorComponent = require('../../../src/lib/Components/Temperature/TemperatureSensorComponent.js');


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
}


const buildSensor = function() {
	let fakeClock = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
	let fakeReset = new FakeGpio(GpioPins.GPIO04, PinMode.IN, PinState.Low);
	let fakeData = new FakeGpio(GpioPins.GPIO07, PinMode.IN, PinState.Low);
	let scl = TemperatureScale.Celcius;
	return new TemperatureSensorComponent(scl, fakeClock, fakeData, fakeReset);
};


module.exports.TemperatureSensorComponentTests = {
	disposeAndIsDisposedTest: function(assert) {
		let sensor = buildSensor();
		assert.expect(2);
		assert.ok(!sensor.isDisposed, "Temp sensor already disposed");

		sensor.dispose();
		assert.ok(sensor.isDisposed, "Temp sensor did not dispose");
		assert.done();
	},
	setHasPropertyTest: function(assert) {
		let sensor = buildSensor();
		sensor.setProperty("foo", "bar");

		assert.expect(1);
		assert.ok(sensor.hasProperty("foo"), "Property 'foo' does not exist");
		assert.done();
	},
	pollTest: function(assert) {
		let sensor = buildSensor();

		assert.expect(2);
		assert.ok(!sensor.isPolling, "Temp sensor is already polling");

		sensor.poll();
		assert.ok(sensor.isPolling, "Temp sensor is not polling");

		sensor.interruptPoll();
		assert.done();
	},
	getSetScaleTest: function(assert) {
		let sensor = buildSensor();

		assert.expect(2);
		assert.equals(sensor.scale, TemperatureScale.Celcius, "Temp scale is not celcius");

		sensor.scale = TemperatureScale.Farenheit;
		assert.equals(sensor.scale, TemperatureScale.Farenheit, "Temp scale is not farenheit");
		assert.done();
	},
	getRawTemperatureTest: function(assert) {
		let sensor = buildSensor();
		let expected = 255.5;

		assert.expect(1);
		assert.equals(sensor.getRawTemperature(), expected, "Raw temp is not " + expected.toString());
		assert.done();
	},
	getTemperatureTest: function(assert) {
		let sensor = buildSensor();
		let expected = 491.9;

		assert.expect(1);
		assert.equals(sensor.getTemperature(TemperatureScale.Farenheit), expected, "Temp is not " + expected.toString());
		assert.done();
	},
	temperatureChangeEventTest: function(assert) {
		let tempSensor = buildSensor();
		tempSensor.on(TemperatureSensor.EVENT_TEMPERATURE_CHANGED, (tempChanged) => {
			assert.expect(2);
			assert.equals(tempChanged.oldTemp, 0, "Old temp not non-zero");
			assert.equals(tempChanged.newTemp, 255.5, "New temp not 255.5");
			assert.done();
		});

		tempSensor.poll();
		tempSensor.sensor.dataPin.write(PinState.High);

		setTimeout(() => {
			tempSensor.interruptPoll();
		}, 225);
	}
};
