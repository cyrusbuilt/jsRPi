'use strict';

const NotImplementedException = require('../src/lib/NotImplementedException.js');

class Dummy {
    constructor() {
    }

    dummyMethod() {
        throw new NotImplementedException("This method is not yet implemented");
    }
}

Dummy.prototype.constructor = Dummy;

module.exports.notImplementedExceptionTests = {
  testThrow: function(assert) {
    let result = false;
    try {
      let d = new Dummy();
      d.dummyMethod();
    }
    catch (e) {
      result = (e.name === 'NotImplementedException');
    }

    assert.expect(1);
    assert.ok(result, "Exception thrown is not of type NotImplementedException");
    assert.done();
  }
};
