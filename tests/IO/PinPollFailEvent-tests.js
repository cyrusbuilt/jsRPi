'use strict';

const PinPollFailEvent = require('../../src/lib/IO/PinPollFailEvent.js');
const IOException = require('../../src/lib/IO/IOException.js');
const EventEmitter = require('events').EventEmitter;

class DummyEmitter extends EventEmitter {
    constructor() {
        super();
    }

    onPollFail(failEvent) {
        setImmediate(() => {
            this.emit("pinPollFailed", failEvent);
        });
    }

    poll() {
        let evt = new PinPollFailEvent(new IOException("Poll failed"));
        this.onPollFail(evt);
    }
}

module.exports.PinPollFailEventTests = {
  testPinPollFailEvent: function(assert) {
    let d = new DummyEmitter();
    d.on("pinPollFailed", function(failEvent) {
      let result = (failEvent instanceof PinPollFailEvent);
      assert.expect(2);
      assert.ok(result, "Event object is not of type PinPollFailEvent");

      let ex = failEvent.failureCause;
      result = ((ex.name === 'IOException') && (ex instanceof IOException));
      assert.ok(result, "Failure cause is not of type IOException");
      assert.done();
    });

    d.poll();
  }
};
