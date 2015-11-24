'use strict';

var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;
var UnrecognizedPinFoundEvent = require('../../src/lib/IO/UnrecognizedPinFoundEvent.js');
var GpioPins = require('../../src/lib/IO/GpioPins.js');

function DummyEmitter(pin) {
  EventEmitter.call(this);

  var self = this;
  var _scanPin = pin || GpioPins.GPIO01;
  var _pinCache = [ GpioPins.GPIO00, GpioPins.GPIO04 ];

  this.onUnrecognizedPinFound = function(pinFoundEvent) {
    process.nextTick(function() {
      self.emit("unrecognizePinFound", pinFoundEvent);
    });
  };

  this.scanPins = function() {
    var found = false;
    for (var i = 0; i < _pinCache.length; i++) {
      if (_pinCache[i].value === _scanPin.value) {
        found = true;
        break;
      }
    }

    if (!found) {
      var evt = new UnrecognizedPinFoundEvent("Unknown pin: " + _scanPin.name);
      self.onUnrecognizedPinFound(evt);
    }
  };
}

DummyEmitter.prototype.constructor = DummyEmitter;
inherits(DummyEmitter, EventEmitter);


module.exports.UnrecognizedPinFoundEventTests = {
  testEvent: function(assert) {
    var d = new DummyEmitter(GpioPins.GPIO01);
    d.on("unrecognizePinFound", function(pinFoundEvent) {
      assert.expect(2);

      var result = (pinFoundEvent instanceof UnrecognizedPinFoundEvent);
      assert.ok(result, "Event object is not of type UnrecognizedPinFoundEvent");

      var expected = "Unknown pin: " + GpioPins.GPIO01.name;
      var actual = pinFoundEvent.getEventMessage();
      assert.equals(actual, expected, "The unknown pin is not the expected pin");
      assert.done();
    });

    d.scanPins();
  }
};
