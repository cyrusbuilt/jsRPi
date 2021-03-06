'use strict';

const ArgumentNullException = require('../src/lib/ArgumentNullException.js');

module.exports.argumentNullExceptionTests = {
  testThrow: function(assert) {
    let result = false;
    try {
        throw new ArgumentNullException("The argument is null or undefined");
    }
    catch (e) {
      result = (e.name === 'ArgumentNullException');
    }

    assert.expect(1);
    assert.ok(result, "Exception is not 'ArgumentNullException'");
    assert.done();
  }
};
