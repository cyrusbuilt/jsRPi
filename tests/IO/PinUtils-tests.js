'use strict';

var PinUtils = require('../../src/lib/IO/PinUtils.js');
var PinMode = require('../../src/lib/IO/PinMode.js');

module.exports.PinUtilsTests = {
  testGetPinModeName: function(assert) {
    var expected = "OUT";
    var actual = PinUtils.getPinModeName(PinMode.OUT);

    assert.expect(1);
    assert.equals(actual, expected, "Pin mode name is not '" + expected + "'");
    assert.done();
  }
};
