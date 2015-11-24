'use strict';

var CoreUtils = require('../../src/lib/PiSystem/CoreUtils.js');

module.exports.CoreUtilsTests = {
  testSleepMicroseconds: function(assert) {
    var start = new Date().getTime();
    console.log("Timer Start: " + start);
    CoreUtils.sleepMicroseconds(200000);
    var stop = new Date().getTime();
    console.log("Timer Stop: " + stop);

    assert.expect(1);
    assert.ok((stop > start), "Stop time is not greater than start time");
    assert.done();
  }
};
