'use strict';

var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;
var GpioPins = require('../../src/lib/IO/GpioPins.js');
var PinState = require('../../src/lib/IO/PinState.js');
var PinStateChangeEvent = require('../../src/lib/IO/PinStateChangeEvent.js');

// Generic event emitter that fires a PinStateChangeEvent.
function DummyEmitter() {
  EventEmitter.call(this);

  var self = this;

  this.onPinStateChange = function(stateChangeEvent) {
    process.nextTick(function() {
      self.emit("pinStateChanged", stateChangeEvent);
    });
  };

  this.triggerEvent = function() {
    var pinAddress = GpioPins.GPIO01.value;
    var oldState = PinState.Low;
    var newState = PinState.High;
    var evt = new PinStateChangeEvent(oldState, newState, pinAddress);
    self.onPinStateChange(evt);
  };
}

DummyEmitter.prototype.constructor = DummyEmitter;
inherits(DummyEmitter, EventEmitter);

module.exports.PinStateChangeEventTests = {
  testEvent: function(assert) {
    var d = new DummyEmitter();
    d.on("pinStateChanged", function(stateChangeEvent) {
      assert.expect(3);

      var expected = PinState.Low;
      var actual = stateChangeEvent.getOldState();
      assert.equals(actual, expected, "Old state is not PinState.Low");

      expected = PinState.High;
      actual = stateChangeEvent.getNewState();
      assert.equals(actual, expected, "New state is not PinState.High");

      expected = 1;
      actual = stateChangeEvent.getPinAddress();
      assert.equals(actual, expected, "Pin address is not 1");
      assert.done();
    });

    d.triggerEvent();
  }
};
