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
var Relay = require('../../../src/lib/Components/Relays/Relay.js');


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


module.exports.RelayComponentTests = {
  disposeAndIsDisposedTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    var rc = new RelayComponent(fakePin);

    assert.expect(2);
    assert.ok(!rc.isDisposed(), "Relay already disposed");

    rc.dispose();
    assert.ok(rc.isDisposed(), "Relay did not dispose");
    assert.done();
  },
  setHasPropertyTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    var rc = new RelayComponent(fakePin);
    rc.setProperty("foo", "bar");

    assert.expect(1);
    assert.ok(rc.hasProperty("foo"), "Property 'foo' does not exist");
    assert.done();
  },
  setGetStateTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    var rc = new RelayComponent(fakePin);

    assert.expect(2);
    assert.equals(rc.getState(), RelayState.Open, "Relay is closed");

    rc.setState(RelayState.Closed);
    assert.equals(rc.getState(), RelayState.Closed, "Relay is still open");
    assert.done();
  },
  openIsOpenTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    var rc = new RelayComponent(fakePin);
    rc.setState(RelayState.Closed);  // Is "open" by default.

    assert.expect(2);
    assert.ok(!rc.isOpen(), "Relay is open");

    rc.open();
    assert.ok(rc.isOpen(), "Relay still closed");
    assert.done();
  },
  closeIsClosedTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    var rc = new RelayComponent(fakePin);

    assert.expect(2);
    assert.ok(!rc.isClosed(), "Relay is already closed");

    rc.close();
    assert.ok(rc.isClosed(), "Relay still open");
    assert.done();
  },
  isStateTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    var rc = new RelayComponent(fakePin);

    assert.expect(1);
    assert.ok(rc.isState(RelayState.Open), "Relay is closed");
    assert.done();
  },
  stateChangeTest: function(assert) {
    var fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    var rc = new RelayComponent(fakePin);
    rc.on(Relay.EVENT_STATE_CHANGED, function(stateChanged) {
      assert.expect(2);
      assert.equals(stateChanged.getOldState(), RelayState.Open, "Old state not open");
      assert.equals(stateChanged.getNewState(), RelayState.Closed, "New state not closed");
      assert.done();
    });

    rc.close();
  }
};
