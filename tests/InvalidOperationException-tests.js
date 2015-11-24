'use strict';

var InvalidOperationException = require('../src/lib/InvalidOperationException.js');

module.exports.invalidOperationExceptionTests = {
  testThrow: function(assert) {
    var result = false;
    try {
      throw new InvalidOperationException("This operation is not valid");
    }
    catch (e) {
      result = (e.name === "InvalidOperationException");
    }

    assert.expect(1);
    assert.ok(result, "Exception thrown is not of type InvalidOperationException");
    assert.done();
  }
};
