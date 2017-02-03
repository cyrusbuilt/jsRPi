'use strict';

const IllegalArgumentException = require('../src/lib/IllegalArgumentException.js');

module.exports.illegalArgumentExceptionTests = {
  testThrow: function(assert) {
    let result = false;
    try {
      throw new IllegalArgumentException("The argument is illegal");
    }
    catch (e) {
      result = (e.name === 'IllegalArgumentException');
    }

    assert.expect(1);
    assert.ok(result, "Exception thrown is not of type: IllegalArgumentException");
    assert.done();
  }
};
