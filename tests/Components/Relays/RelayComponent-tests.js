'use strict';

const util = require('util');
const GpioBase = require('../../../src/lib/IO/GpioBase.js');
const GpioPins = require('../../../src/lib/IO/GpioPins.js');
const PinMode = require('../../../src/lib/IO/PinMode.js');
const PinState = require('../../../src/lib/IO/PinState.js');
const PinStateChangeEvent = require('../../../src/lib/IO/PinStateChangeEvent.js');
const RelayComponent = require('../../../src/lib/Components/Relays/RelayComponent.js');
const RelayState = require('../../../src/lib/Components/Relays/RelayState.js');
const Relay = require('../../../src/lib/Components/Relays/Relay.js');


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


module.exports.RelayComponentTests = {
  disposeAndIsDisposedTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    let rc = new RelayComponent(fakePin);

    assert.expect(2);
    assert.ok(!rc.isDisposed, "Relay already disposed");

    rc.dispose();
    assert.ok(rc.isDisposed, "Relay did not dispose");
    assert.done();
  },
  setHasPropertyTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    let rc = new RelayComponent(fakePin);
    rc.setProperty("foo", "bar");

    assert.expect(1);
    assert.ok(rc.hasProperty("foo"), "Property 'foo' does not exist");
    assert.done();
  },
  setGetStateTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    let rc = new RelayComponent(fakePin);

    assert.expect(2);
    assert.equals(rc.state, RelayState.Open, "Relay is closed");

    rc.state = RelayState.Closed;
    assert.equals(rc.state, RelayState.Closed, "Relay is still open");
    assert.done();
  },
  openIsOpenTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    let rc = new RelayComponent(fakePin);
    rc.state = RelayState.Closed;  // Is "open" by default.

    assert.expect(2);
    assert.ok(!rc.isOpen, "Relay is open");

    rc.open();
    assert.ok(rc.isOpen, "Relay still closed");
    assert.done();
  },
  closeIsClosedTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    let rc = new RelayComponent(fakePin);

    assert.expect(2);
    assert.ok(!rc.isClosed, "Relay is already closed");

    rc.close();
    assert.ok(rc.isClosed, "Relay still open");
    assert.done();
  },
  isStateTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    let rc = new RelayComponent(fakePin);

    assert.expect(1);
    assert.ok(rc.isState(RelayState.Open), "Relay is closed");
    assert.done();
  },
  stateChangeTest: function(assert) {
    let fakePin = new FakeGpio(GpioPins.GPIO01, PinMode.OUT, PinState.Low);
    let rc = new RelayComponent(fakePin);
    rc.on(Relay.EVENT_STATE_CHANGED, (stateChanged) => {
      assert.expect(2);
      assert.equals(stateChanged.oldState, RelayState.Open, "Old state not open");
      assert.equals(stateChanged.newState, RelayState.Closed, "New state not closed");
      assert.done();
    });

    rc.close();
  }
};
