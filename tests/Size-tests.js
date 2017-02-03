'use strict';

const Size = require('../src/lib/Size.js');

const e = Size.EMPTY;

// Size object
module.exports.SizeTests = {
  testSize: function(assert) {
    let s = new Size(5, 3);
    assert.expect(3);
    assert.equals(s.width, 5, "Size.width == 5");
    assert.equals(s.height, 3, "Size.height == 3");
    s = new Size(0, 0);
    assert.ok((s.width === e.width && s.height === e.height), "Size is -not- EMPTY");
    assert.done();
  }
};
