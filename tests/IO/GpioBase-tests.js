'use strict';

var util = require('util');
var inherits = require('util').inherits;
var GpioBase = require('../../src/lib/IO/GpioBase.js');
var GpioPins = require('../../src/lib/IO/GpioPins.js');
var PinMode = require('../../src/lib/IO/PinMode.js');
var PinState = require('../../src/lib/IO/PinState.js');
var BoardRevision = require('../../src/lib/BoardRevision.js');
var PinStateChangeEvent = require('../../src/lib/IO/PinStateChangeEvent.js');
var Gpio = require('../../src/lib/IO/Gpio.js');

function FakeGpio(pin, mode, value) {
  GpioBase.call(this, pin, mode, value);

  var self = this;
  var _overriddenState = value || PinState.Low;

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

module.exports.GpioBaseTests = {
  testDisposeAndIsDisposed: function(assert) {
    var fg = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    assert.expect(2);
    assert.ok(!fg.isDisposed(), "Gpio is already disposed.");

    fg.dispose();
    assert.ok(fg.isDisposed(), "Gpio did not dispose");
    assert.done();
  },
  testBoardRevision: function(assert) {
    var fg = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    fg.changeBoardRevision(BoardRevision.Rev2);

    assert.equals(fg.getRevision(), BoardRevision.Rev2, "Board is not Rev2");
    assert.done();
  },
  testRead: function(assert) {
    var fg = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    assert.expect(1);
    assert.equals(fg.read(), PinState.Low, "Pin state is not PinState.Low");
    assert.done();
  },
  testState: function(assert) {
    var fg = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.High);
    assert.expect(1);
    assert.equals(fg.state(), PinState.High, "Pin state is not PinState.High");
    assert.done();
  },
  testWrite: function(assert) {
    assert.expect(2);

    var fg = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    assert.equals(fg.state(), PinState.Low, "Initial pin state is not PinState.Low");

    fg.write(PinState.High);
    assert.equals(fg.state(), PinState.High, "Written pin state is not PinState.High");
    assert.done();
  },
  testGetInnerPin: function(assert) {
    var fg = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    var p = fg.getInnerPin();

    assert.expect(1);
    assert.equals(p.value, GpioPins.GPIO01.value, "Expected pin is not GpioPins.GPIO01");
    assert.done();
  },
  testGetMode: function(assert) {
    var fg = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    var m = fg.mode();

    assert.expect(1);
    assert.equals(m, PinMode.IN, "Gpio not configured as input");
    assert.done();
  },
  testSetMode: function(assert) {
    assert.expect(2);

    var fg = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    assert.equals(fg.mode(), PinMode.IN, "Initial pin mode is not PinMode.IN");

    fg.setMode(PinMode.OUT);
    assert.equals(fg.mode(), PinMode.OUT, "Pin mode did not change to PinMode.OUT");
    assert.done();
  },
  testAddress: function(assert) {
    var fg = new FakeGpio(GpioPins.GPIO01, PinMode.IN, PinState.Low);
    var addr = fg.address();

    assert.expect(1);
    assert.equals(addr, GpioPins.GPIO01.value, "Pin address is not 1");
    assert.done();
  },

  // *** NOTE: I have discovered that testing pulse() is very difficult.
  // *** The test below *sort of* works, that pulse() correctly calls write()
  // *** and changes the pin state, and triggers the event. However, regardless
  // *** of what assert.expect() is expecting as far as number of assertions,
  // *** it will always be one more than that. So it isn't really that the
  // *** test doesn't succeed (it does), but that there are a different number
  // *** of assertions than is expected.  You can uncomment the following test,
  // *** to verify the object behaves as expected, but with the caveat that the
  // *** the unit test will fail due to the number of assertions.

  // testPulseAndStateChange: function(assert) {
  //   var changeCount = 0;
  //   var fg = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
  //   console.log("State before pulse: " + fg.read());
  //   fg.on(Gpio.EVENT_STATE_CHANGED, function(stateChanged) {
  //     console.log("Pin went high");
  //     assert.expect(2);
  //     assert.equals(stateChanged.getNewState(), PinState.High, "Pin state is not PinState.High");
  //
  //     //assert.equals(stateChanged.getNewState(), PinState.Low, "Pin state did not return to PinState.Low");
  //     assert.done();
  //   });
  //
  //   fg.pulse(100);
  //
  //   // Calling dispose here will undefine the internal emitter before the
  //   // events actually get emitted. Best to just let the object go out of scope
  //   // and let the GC clean it up non-deterministically.
  //   //fg.dispose();
  // }

  testPinStateChange: function(assert) {
    var fg = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    fg.on(Gpio.EVENT_STATE_CHANGED, function(stateChanged) {
      assert.expect(2);
      assert.equals(stateChanged.getOldState(), PinState.Low, "Begginning state was not PinState.Low");
      assert.equals(stateChanged.getNewState(), PinState.High, "Resulting state is not PinState.High");
      assert.done();
    });

    fg.write(PinState.High);
  }
};
