'use strict';

var RelayUtils = require('../../../src/lib/Components/Relays/RelayUtils.js');
var RelayState = require('../../../src/lib/Components/Relays/RelayState.js');

module.exports.RelayUtilsTests = {
  getInverseStateTest: function(assert) {
    var result = RelayUtils.getInverseState(RelayState.Open);
    assert.expect(1);
    assert.equals(result, RelayState.Closed, "Relay state is not closed");
    assert.done();
  }
};
