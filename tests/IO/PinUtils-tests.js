'use strict';

const PinUtils = require('../../src/lib/IO/PinUtils.js');
const PinMode = require('../../src/lib/IO/PinMode.js');

module.exports.PinUtilsTests = {
  testGetPinModeName: function(assert) {
    let expected = "OUT";
    let actual = PinUtils.getPinModeName(PinMode.OUT);

    assert.expect(1);
    assert.equals(actual, expected, "Pin mode name is not '" + expected + "'");
    assert.done();
  }
};
