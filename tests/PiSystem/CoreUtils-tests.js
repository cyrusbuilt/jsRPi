'use strict';

const CoreUtils = require('../../src/lib/PiSystem/CoreUtils.js');

module.exports.CoreUtilsTests = {
  testSleepMicroseconds: function(assert) {
    let start = new Date().getTime();
    console.log("Timer Start: " + start);
    CoreUtils.sleepMicroseconds(200000);
    let stop = new Date().getTime();
    console.log("Timer Stop: " + stop);

    assert.expect(1);
    assert.ok((stop > start), "Stop time is not greater than start time");
    assert.done();
  }
};
