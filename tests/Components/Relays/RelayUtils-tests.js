'use strict';

const RelayUtils = require('../../../src/lib/Components/Relays/RelayUtils.js');
const RelayState = require('../../../src/lib/Components/Relays/RelayState.js');

module.exports.RelayUtilsTests = {
  getInverseStateTest: function(assert) {
    let result = RelayUtils.getInverseState(RelayState.Open);
    assert.expect(1);
    assert.equals(result, RelayState.Closed, "Relay state is not closed");
    assert.done();
  }
};
