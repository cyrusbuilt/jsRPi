'use strict';

var PowerUtils = require('../../../src/lib/Components/Power/PowerUtils.js');
var PowerState = require('../../../src/lib/Components/Power/PowerState.js');

module.exports.PowerUtilsTests = {
  getPowerStateNameTest: function(assert) {
    var result = PowerUtils.getPowerStateName(PowerState.On);
    assert.expect(1);
    assert.equals(result, "On", "Power state is not on");
    assert.done();
  }
};
