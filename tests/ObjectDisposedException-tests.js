'use strict';

var inherits = require('util').inherits;
var ObjectDisposedException = require('../src/lib/ObjectDisposedException.js');
var Disposable = require('../src/lib/Disposable.js');

function Dummy() {
  Disposable.call(this);

  var _isDisposed = false;

  this.dispose = function() {
    _isDisposed = true;
  };

  this.isDisposed = function() {
    return _isDisposed;
  };

  this.doSomething = function() {
    if (_isDisposed) {
      throw new ObjectDisposedException("Dummy");
    }
    console.log("SUCCESS: Hello World from Dummy.doSomething()!");
  };
}

Dummy.prototype.constructor = Dummy;
inherits(Dummy, Disposable);

module.exports.objectDisposedExceptionTests = {
  testThrow: function(assert) {
    var d = new Dummy();
    var result = true;
    try {
      d.doSomething();
    }
    catch (e) {
      result = false;
    }

    assert.expect(2);
    assert.ok(result, "Dummy is already disposed.");

    try {
      d.dispose();
      d.doSomething();
    }
    catch (e) {
      result = ((d.isDisposed()) && (e.name === 'ObjectDisposedException'));
    }

    assert.ok(result, "Dummy is not disposed or exception thrown is not of type ObjectDisposedException");
    assert.done();
  }
};
