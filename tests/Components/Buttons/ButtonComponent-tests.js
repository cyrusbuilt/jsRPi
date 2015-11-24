'use strict';

var util = require('util');
var inherits = require('util').inherits;
var GpioBase = require('../../../src/lib/IO/GpioBase.js');
var GpioPins = require('../../../src/lib/IO/GpioPins.js');
var PinMode = require('../../../src/lib/IO/PinMode.js');
var PinState = require('../../../src/lib/IO/PinState.js');
var PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
var ButtonComponent = require('../../../src/lib/Components/Button/ButtonComponent.js');
var ButtonState = require('../../../src/lib/Components/Button/ButtonState.js');
var Button = require('../../../src/lib/Components/Button/Button.js');


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
inherits(GpioBase, FakeGpio);


module.exports.ButtonComponentTests = {
  testDisposeAndIsDisposed: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    var fakeButton = new ButtonComponent(fakePin);

    assert.expect(2);
    assert.ok(!fakeButton.isDisposed(), "Button not instantiated.");

    fakeButton.dispose();
    assert.ok(fakeButton.isDisposed(), "Button not disposed");

    assert.done();
  },
  testGetState: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    var fakeButton = new ButtonComponent(fakePin);

    assert.expect(2);
    assert.equals(fakeButton.getState(), ButtonState.Released, "Button state is pressed");

    fakePin.write(PinState.High);
    assert.equals(fakeButton.getState(), ButtonState.Pressed, "Button state is released");
    assert.done();
  },
  testPoll: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    var fakeButton = new ButtonComponent(fakePin);

    assert.expect(3);
    assert.ok(!fakeButton.isPolling(), "Button poll is already polling");

    fakeButton.poll();
    assert.ok(fakeButton.isPolling(), "Button poll is not polling");

    fakeButton.interruptPoll();
    assert.ok(!fakeButton.isPolling(), "Button poll still running");
    assert.done();
  },
  testIsPressed: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    var fakeButton = new ButtonComponent(fakePin);

    assert.expect(2);
    assert.ok(!fakeButton.isPressed(), "Button is pressed");

    fakePin.write(PinState.High);
    assert.ok(fakeButton.isPressed(), "Button is released");
    assert.done();
  },
  testIsReleased: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    var fakeButton = new ButtonComponent(fakePin);

    assert.expect(2);
    assert.ok(fakeButton.isReleased(), "Button is pressed");

    fakePin.write(PinState.High);
    assert.ok(!fakeButton.isReleased(), "Button is released");
    assert.done();
  },
  testIsState: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    var fakeButton = new ButtonComponent(fakePin);

    assert.expect(2);
    assert.ok(fakeButton.isState(ButtonState.Released), "Button is pressed");

    fakePin.write(PinState.High);
    assert.ok(fakeButton.isState(ButtonState.Pressed), "Button is released");
    assert.done();
  },
  testOnStateChanged: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    var fakeButton = new ButtonComponent(fakePin);
    fakeButton.on(Button.EVENT_STATE_CHANGED, function(stateChanged) {
      assert.expect(1);
      assert.ok(stateChanged.isPressed(), "Button is released");
      assert.done();
    });

    fakePin.write(PinState.High);
  }
};
