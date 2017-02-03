'use strict';

const PowerUtils = require('../../../src/lib/Components/Power/PowerUtils.js');
const PowerState = require('../../../src/lib/Components/Power/PowerState.js');

module.exports.PowerUtilsTests = {
  getPowerStateNameTest: function(assert) {
    let result = PowerUtils.getPowerStateName(PowerState.On);
    assert.expect(1);
    assert.equals(result, "On", "Power state is not on");
    assert.done();
  }
};
