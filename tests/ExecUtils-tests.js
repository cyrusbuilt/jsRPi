'use strict';

const OS = require('os');
const StringUtils = require('../src/lib/StringUtils.js');
const ExecUtils = require('../src/lib/ExecUtils.js');

module.exports.execUtilsTests = {
  testExec: function(assert) {
    let cmd = "ping -c 1 127.0.0.1";
    let text = "bytes from";
    if (OS.platform() === 'win32') {
      cmd = "ping -n 1 127.0.0.1";
      text = "Reply from 127.0.0.1";
    }

    let result = ExecUtils.executeCommand(cmd);
    let success = StringUtils.contains(result.toString(), text);
    assert.expect(1);
    assert.ok(success, "Execution failed. No reply from host.");
    assert.done();
  }
};
