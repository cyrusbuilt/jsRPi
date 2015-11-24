'use strict';

var os = require('os');
var fs = require('fs');
var IOException = require('../../src/lib/IO/IOException.js');
var FileInfo = require('../../src/lib/IO/FileInfo.js');

var filePath = os.homedir() + "/temp.txt";
if (os.platform() === 'win32') {
  filePath = os.homedir() + "\\temp.txt";
}

module.exports.IOExceptionTests = {
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
  ioExceptionTest: function(assert) {
    var result = false;
    var f = new FileInfo(filePath);
    f.delete();

    try {
      // Should throw IOException because it should no longer exist.
      f.delete();
    }
    catch (e) {
      result = ((e.name === 'IOException') && (e instanceof IOException));
    }

    assert.expect(1);
    assert.ok(result, "Exception not thrown or is not of type IOException");
    assert.done();
  }
};
