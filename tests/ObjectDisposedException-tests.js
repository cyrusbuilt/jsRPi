'use strict';

var ObjectDisposedException = require('../src/lib/ObjectDisposedException.js');
var Disposable = require('../src/lib/Disposable.js');

class Dummy extends Disposable {
    constructor() {
        super();

        this._isDisposed = false;
    }

    dispose() {
        this._isDisposed = true;
    }

    get isDisposed() {
        return this._isDisposed;
    }

    doSomething() {
        if (this._isDisposed) {
            throw new ObjectDisposedException("Dummy");
        }
    }
}


module.exports.objectDisposedExceptionTests = {
  testThrow: function(assert) {
    let d = new Dummy();
    let result = true;
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
      result = ((d.isDisposed) && (e.name === 'ObjectDisposedException'));
    }

    assert.ok(result, "Dummy is not disposed or exception thrown is not of type ObjectDisposedException");
    assert.done();
  }
};
