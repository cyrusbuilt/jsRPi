'use strict';

const os = require('os');
const fs = require('fs');
const IOException = require('../../src/lib/IO/IOException.js');
const FileInfo = require('../../src/lib/IO/FileInfo.js');

let filePath = os.homedir() + "/temp.txt";
if (os.platform() === 'win32') {
  filePath = os.homedir() + "\\temp.txt";
}

module.exports.IOExceptionTests = {
  setUp: function(callback) {
    // Check to see if temp file exists.
    let fd = -1;
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
    let fd = -1;
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
    let result = false;
    let f = new FileInfo(filePath);
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
