'use strict';

const EventEmitter = require('events').EventEmitter;
const UnrecognizedPinFoundEvent = require('../../src/lib/IO/UnrecognizedPinFoundEvent.js');
const GpioPins = require('../../src/lib/IO/GpioPins.js');

class DummyEmitter extends EventEmitter {
    constructor(pin) {
        super();

        this._scanPin = pin || GpioPins.GPIO01;
        this._pinCache = [ GpioPins.GPIO00, GpioPins.GPIO04 ];
    }

    onUnrecognizedPinFound(pinFoundEvent) {
        setImmediate(() => {
            this.emit("unrecognizePinFound", pinFoundEvent);
        });
    }

    scanPins() {
        let found = false;
        for (let i = 0; i < this._pinCache.length; i++) {
            if (this._pinCache[i].value === this._scanPin.value) {
                found = true;
                break;
            }
        }

        if (!found) {
            let evt = new UnrecognizedPinFoundEvent("Unknown pin: " + this._scanPin.name);
            this.onUnrecognizedPinFound(evt);
        }
    }
}


module.exports.UnrecognizedPinFoundEventTests = {
  testEvent: function(assert) {
    let d = new DummyEmitter(GpioPins.GPIO01);
    d.on("unrecognizePinFound", function(pinFoundEvent) {
      assert.expect(2);

      let result = (pinFoundEvent instanceof UnrecognizedPinFoundEvent);
      assert.ok(result, "Event object is not of type UnrecognizedPinFoundEvent");

      let expected = "Unknown pin: " + GpioPins.GPIO01.name;
      let actual = pinFoundEvent.eventMessage;
      assert.equals(actual, expected, "The unknown pin is not the expected pin");
      assert.done();
    });

    d.scanPins();
  }
};
