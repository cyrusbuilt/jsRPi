'use strict';

var inherits = require('util').inherits;
var PinPollFailEvent = require('../../src/lib/IO/PinPollFailEvent.js');
var IOException = require('../../src/lib/IO/IOException.js');
var EventEmitter = require('events').EventEmitter;

function DummyEmitter() {
  EventEmitter.call(this);

  var self = this;

  this.onPollFail = function(failEvent) {
    process.nextTick(function() {
      self.emit("pinPollFailed", failEvent);
    });
  };

  this.poll = function() {
    var evt = new PinPollFailEvent(new IOException("Poll failed"));
    self.onPollFail(evt);
  };
}

DummyEmitter.prototype.constructor = DummyEmitter;
inherits(DummyEmitter, EventEmitter);

module.exports.PinPollFailEventTests = {
  testPinPollFailEvent: function(assert) {
    var d = new DummyEmitter();
    d.on("pinPollFailed", function(failEvent) {
      var result = (failEvent instanceof PinPollFailEvent);
      assert.expect(2);
      assert.ok(result, "Event object is not of type PinPollFailEvent");

      var ex = failEvent.getFailureCause();
      result = ((ex.name === 'IOException') && (ex instanceof IOException));
      assert.ok(result, "Failure cause is not of type IOException");
      assert.done();
    });

    d.poll();
  }
};
