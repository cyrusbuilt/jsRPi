'use strict';

var fs = require('fs');
var os = require('os');
var FileInfo = require('../../src/lib/IO/FileInfo.js');

// Build path to temp file. This is meant to be platform agnostic so that unit
// testing can be done on hosts other than *nix on the Raspberry Pi itself.
var filePath = os.homedir() + "/temp.txt";
if (os.platform() === 'win32') {
  filePath = os.homedir() + "\\temp.txt";
}

module.exports.FileInfoTests = {
  setUp: function(callback) {
    // Check to see if temp file exists.
    var fd = -1;
    try {
      fd = fs.openSync(filePath, 'r');
    }
    catch (e) {
    }

    // Create temp file if not exist.
    if (fd === -1) {
      try {
          fd = fs.openSync(filePath, 'w');
      }
      catch (e) {
      }
    }

    // Release handle.
    if (fd !== -1) {
      fs.closeSync(fd);
    }

    callback();
  },
  tearDown: function(callback) {
    // Check if temp file exists.
    var fd = -1;
    try {
      fd = fs.openSync(filePath, 'r');
    }
    catch (e) {
    }

    // Release handle and delete.
    if (fd !== -1) {
      fs.closeSync(fd);
      fs.unlinkSync(filePath);
    }

    callback();
  },
  testToString: function(assert) {
    var f = new FileInfo(filePath);
    var expected = os.homedir() + "/temp.txt";
    if (os.platform() === 'win32') {
        expected = os.homedir() + "\\temp.txt";
    }

    var actual = f.toString();

    assert.expect(1);
    assert.equals(actual, expected, "Path is not '" + expected + "'");
    assert.done();
  },
  testExists: function(assert) {
    var f = new FileInfo(filePath);
    assert.expect(1);
    assert.ok(f.exists(), "'" + filePath + "' does not exist");
    assert.done();
  },
  testGetDirectoryName: function(assert) {
    var f = new FileInfo(filePath);
    var expected = os.homedir();
    var actual = f.getDirectoryName();

    assert.expect(1);
    assert.equals(actual, expected, "Directory path is not '" + expected + "'");
    assert.done();
  },
  testGetFileName: function(assert) {
    var f = new FileInfo(filePath);
    var expected = "temp.txt";
    var actual = f.getFileName();

    assert.expect(1);
    assert.equals(actual, expected, "Filename is not '" + expected + "'");
    assert.done();
  },
  testGetFileExtension: function(assert) {
    var f = new FileInfo(filePath);
    var expected = "txt";
    var actual = f.getFileExtension();

    assert.expect(1);
    assert.equals(actual, expected, "File extension is not '" + expected + "'");
    assert.done();
  },
  testDelete: function(assert) {
    var f = new FileInfo(filePath);
    f.delete();

    assert.expect(1);
    assert.ok(!f.exists(), "File still exists");
    assert.done();
  },
  testGetLength: function(assert) {
    var f = new FileInfo(filePath);

    assert.expect(1);
    assert.equals(f.getLength(), 0, "File size is not zero bytes");
    assert.done();
  },
  testGetFileNameWithoutExtension: function(assert) {
    var f = new FileInfo(filePath);
    var expected = "temp";
    var actual = f.getFileNameWithoutExtension();

    assert.expect(1);
    assert.equals(actual, expected, "File base name is not '" + expected + "'");
    assert.done();
  },
  testGetFullName: function(assert) {
    var f = new FileInfo(filePath);
    var expected = os.homedir() + "/temp.txt";
    if (os.platform() === 'win32') {
      expected = os.homedir() + "\\temp.txt";
    }

    var actual = f.getFullName();

    assert.expect(1);
    assert.equals(actual, expected, "Full path is not '" + expected + "'");
    assert.done();
  }
};
