'use strict';

const Disposable = require('../src/lib/Disposable.js');

class Foo extends Disposable {
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
}

module.exports.disposableTests = {
  testDisposable: function(assert) {
    let f = new Foo();
    f.dispose();

    assert.expect(2);
    assert.ok((f instanceof Disposable), "Object Foo is not Disposable");
    assert.ok(f.isDisposed, "Object Foo is not disposed");
    assert.done();
  }
};
