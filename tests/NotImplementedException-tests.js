'use strict';

var NotImplementedException = require('../src/lib/NotImplementedException.js');

function Dummy() {
  this.dummyMethod = function() {
    throw new NotImplementedException("This method is not yet implemented");
  };
}

Dummy.prototype.constructor = Dummy;

module.exports.notImplementedExceptionTests = {
  testThrow: function(assert) {
    var result = false;
    try {
      var d = new Dummy();
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
