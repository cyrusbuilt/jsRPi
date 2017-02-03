'use strict';

const EventEmitter = require('events').EventEmitter;
const GpioPins = require('../../src/lib/IO/GpioPins.js');
const PinState = require('../../src/lib/IO/PinState.js');
const PinStateChangeEvent = require('../../src/lib/IO/PinStateChangeEvent.js');

// Generic event emitter that fires a PinStateChangeEvent.
class DummyEmitter extends EventEmitter {
    constructor() {
        super();
    }

    onPinStateChange(stateChangeEvent) {
        setImmediate(() => {
            this.emit("pinStateChanged", stateChangeEvent);
        });
    }

    triggerEvent() {
        let pinAddress = GpioPins.GPIO01.value;
        let oldState = PinState.Low;
        let newState = PinState.High;
        let evt = new PinStateChangeEvent(oldState, newState, pinAddress);
        this.onPinStateChange(evt);
    }
}

module.exports.PinStateChangeEventTests = {
  testEvent: function(assert) {
    let d = new DummyEmitter();
    d.on("pinStateChanged", function(stateChangeEvent) {
      assert.expect(3);

      let expected = PinState.Low;
      let actual = stateChangeEvent.oldState;
      assert.equals(actual, expected, "Old state is not PinState.Low");

      expected = PinState.High;
      actual = stateChangeEvent.newState;
      assert.equals(actual, expected, "New state is not PinState.High");

      expected = 1;
      actual = stateChangeEvent.pinAddress;
      assert.equals(actual, expected, "Pin address is not 1");
      assert.done();
    });

    d.triggerEvent();
  }
};
