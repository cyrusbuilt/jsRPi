'use strict';

const StringUtils = require('../src/lib/StringUtils.js');

module.exports.StringUtilsTests = {
  testCreate: function(assert) {
    assert.expect(1);
    let s = StringUtils.create('c', 3);
    assert.equals(s, "ccc", "'s' is not 'ccc'");
    assert.done();
  },
  testPadLeft: function(assert) {
    assert.expect(1);
    let testString = "Hello World!";
    let s = StringUtils.padLeft(testString, 'a', 3);
    assert.equals(s, "aaaHello World!", "'s' is not 'aaaHello World!'");
    assert.done();
  },
  testPadRight: function(assert) {
    assert.expect(1);
    let testString = "Hello World!";
    let s = StringUtils.padRight(testString, 'f', 5);
    assert.equals(s, "Hello World!fffff", "'s' is not 'Hello World!fffff'");
    assert.done();
  },
  testPad: function(assert) {
    assert.expect(1);
    let testString = "FooBar";
    let s = StringUtils.pad(testString, '-', 3);
    assert.equals(s, "---FooBar---", "'s' is not '---FooBar---'");
    assert.done();
  },
  testPadCenter: function(assert) {
    assert.expect(1);
    let testString = "FooBar";
    let s = StringUtils.padCenter(testString, StringUtils.DEFAULT_PAD_CHAR, 1);
    assert.equals(s, "Foo Bar", "'s' is not 'Foo Bar'");
    assert.done();
  },
  testEndsWith: function(assert) {
    assert.expect(1);
    let result = StringUtils.endsWith("foo.bar", "bar");
    assert.ok(result, "'foo.bar' does not end with 'bar'");
    assert.done();
  },
  testStartsWith: function(assert) {
    assert.expect(1);
    let result = StringUtils.startsWith("foo.bar", "foo");
    assert.ok(result, "'foo.bar' does not start with 'foo'");
    assert.done();
  },
  testIsNullOrEmpty: function(assert) {
    assert.expect(3);
    assert.ok(StringUtils.isNullOrEmpty(null), "String is not null");
    assert.ok(StringUtils.isNullOrEmpty(undefined), "String is not undefined");
    assert.ok(StringUtils.isNullOrEmpty(StringUtils.EMPTY), "String is not empty");
    assert.done();
  },
  testTrim: function(assert) {
    assert.expect(1);
    assert.ok(StringUtils.trim(" test "), "test", "String contains whitespace at beginning and/or end");
    assert.done();
  },
  testContains: function(assert) {
    assert.expect(1);
    assert.ok(StringUtils.contains("foo bar", "bar"), "String does not contain 'bar'");
    assert.done();
  },
  testConvertStringToByte: function(assert) {
    // utility to test array equality.
    function arraysEqual(a, b) {
      if (a === b) {
        return true;
      }

      if ((a == null) || (b == null)) {
        return false;
      }

      if (a.length !== b.length) {
        return false;
      }

      let result = true;
      for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) {
          result = false;
          break;
        }
      }
      return result;
    }

    let byte = StringUtils.convertStringToByte("1");
    assert.expect(1);
    assert.ok(arraysEqual(byte, [49]), "String does not convert to 1");
    assert.done();
  }
};
