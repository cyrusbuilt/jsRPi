'use strict';

var OS = require('os');
var StringUtils = require('../src/lib/StringUtils.js');
var ExecUtils = require('../src/lib/ExecUtils.js');

module.exports.execUtilsTests = {
  testExec: function(assert) {
    var cmd = "ping -c 1 127.0.0.1";
    if (OS.platform() === 'win32') {
      cmd = "ping -n 1 127.0.0.1";
    }

    var result = ExecUtils.executeCommand(cmd);
    var success = StringUtils.contains(result.toString(), "Reply from 127.0.0.1");
    assert.expect(1);
    assert.ok(success, "Execution failed. No reply from host.");
    assert.done();
  }
};
