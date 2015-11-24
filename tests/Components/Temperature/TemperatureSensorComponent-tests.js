'use strict';

var util = require('util');
var inherits = require('util').inherits;
var GpioBase = require('../../../src/lib/IO/GpioBase.js');
var GpioPins = require('../../../src/lib/IO/GpioPins.js');
var PinMode = require('../../../src/lib/IO/PinMode.js');
var PinState = require('../../../src/lib/IO/PinState.js');
var PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
var TemperatureSensor = require('../../../src/lib/Components/Temperature/TemperatureSensor.js');
var TemperatureScale = require('../../../src/lib/Components/Temperature/TemperatureScale.js');
var TemperatureSensorComponent = require('../../../src/lib/Components/Temperature/TemperatureSensorComponent.js');


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

var buildSensor = function() {
	var fakeClock = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
	var fakeReset = new FakeGpio(GpioPins.GPIO04, PinMode.IN, PinState.Low);
	var fakeData = new FakeGpio(GpioPins.GPIO07, PinMode.IN, PinState.Low);
	var scl = TemperatureScale.Celcius;
	return new TemperatureSensorComponent(scl, fakeClock, fakeData, fakeReset);
};


module.exports.TemperatureSensorComponentTests = {
	disposeAndIsDisposedTest: function(assert) {
		var sensor = buildSensor();
		assert.expect(2);
		assert.ok(!sensor.isDisposed(), "Temp sensor already disposed");
		
		sensor.dispose();
		assert.ok(sensor.isDisposed(), "Temp sensor did not dispose");
		assert.done();
	},
	setHasPropertyTest: function(assert) {
		var sensor = buildSensor();
		sensor.setProperty("foo", "bar");
		
		assert.expect(1);
		assert.ok(sensor.hasProperty("foo"), "Property 'foo' does not exist");
		assert.done();
	},
	pollTest: function(assert) {
		var sensor = buildSensor();
		
		assert.expect(2);
		assert.ok(!sensor.isPolling(), "Temp sensor is already polling");
		
		sensor.poll();
		assert.ok(sensor.isPolling(), "Temp sensor is not polling");
		
		sensor.interruptPoll();
		assert.done();
	},
	getSetScaleTest: function(assert) {
		var sensor = buildSensor();
		
		assert.expect(2);
		assert.equals(sensor.getScale(), TemperatureScale.Celcius, "Temp scale is not celcius");
		
		sensor.setScale(TemperatureScale.Farenheit);
		assert.equals(sensor.getScale(), TemperatureScale.Farenheit, "Temp scale is not farenheit");
		assert.done();
	},
	getRawTemperatureTest: function(assert) {
		var sensor = buildSensor();
		var expected = 255.5;
		
		assert.expect(1);
		assert.equals(sensor.getRawTemperature(), expected, "Raw temp is not " + expected.toString());
		assert.done();
	},
	getTemperatureTest: function(assert) {
		var sensor = buildSensor();
		var expected = 491.9;
		
		assert.expect(1);
		assert.equals(sensor.getTemperature(TemperatureScale.Farenheit), expected, "Temp is not " + expected.toString());
		assert.done();
	},
	temperatureChangeEventTest: function(assert) {
		var sensor = buildSensor();
		sensor.on(TemperatureSensor.EVENT_TEMPERATURE_CHANGED, function(tempChanged) {
			assert.expect(2);
			assert.equals(tempChanged.getOldTemp(), 0, "Old temp not non-zero");
			assert.equals(tempChanged.getNewTemp(), 255.5, "New temp not 255.5");
			assert.done();
		});
		
		sensor.poll();
		sensor.getSensor().getDataPin().write(PinState.High);
		
		setTimeout(function() {
			sensor.interruptPoll();
		}, 225);
	}
};