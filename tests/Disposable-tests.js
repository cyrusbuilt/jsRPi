'use strict';

var inherits = require('util').inherits;
var Disposable = require('../src/lib/Disposable.js');

function Foo() {
  Disposable.call(this);

  var _isDisposed = false;

  this.dispose = function() {
    _isDisposed = true;
  };

  this.isDisposed = function() {
    return _isDisposed;
  };
}

Foo.prototype.constructor = Foo;
inherits(Foo, Disposable);

module.exports.disposableTests = {
  testDisposable: function(assert) {
    var f = new Foo();
    f.dispose();

    assert.expect(2);
    assert.ok((Foo.prototype instanceof Disposable), "Object Foo is not Disposable");
    assert.ok(f.isDisposed(), "Object Foo is not disposed");
    assert.done();
  }
};
