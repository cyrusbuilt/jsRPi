'use strict';

const CoreUtils = require('../../src/lib/PiSystem/CoreUtils.js');

module.exports.CoreUtilsTests = {
  testSleepMicroseconds: function(assert) {
    let start = new Date().getTime();
    console.log("Timer Start: " + start);
    CoreUtils.sleepMicroseconds(200000);
    let stop = new Date().getTime();
    console.log("Timer Stop: " + stop);

    assert.expect(1);
    assert.ok((stop > start), "Stop time is not greater than start time");
    assert.done();
  },

  testCloneObject: function(assert) {
      let auxobj = {
          prop1 : "prop1 aux val",
          prop2 : ["prop2 item1", "prop2 item2"]
      };

      let obj = {};
      obj.prop1 = "prop1_value";
      obj.prop2 = [auxobj, auxobj, "some extra val", undefined];
      obj.nr = 3465;
      obj.bool = true;

      obj.f1 = function() {
          this.prop1 = "prop1 val changed by f1";
      };

      let objclone = CoreUtils.cloneObject(obj);

      assert.expect(7);
      console.log("Testing number, boolean, and string property cloning...");
      assert.ok((obj.prop1 === objclone.prop1), "prop1 values between source object and clone not equal");
      assert.ok((obj.nr === objclone.nr), "nr values between source object and clone not equal");
      assert.ok((obj.bool === objclone.bool), "bool values between source object and clone not equal");

      console.log("Testing function cloning 1...");
      objclone.f1();
      assert.ok((objclone.prop1 === 'prop1 val changed by f1'), "function cloning 1 failed.");

      console.log("Testing function cloning 2...");
      objclone.f1.prop = 'some prop';
      assert.ok((obj.f1.prop === undefined), "function cloning 2 failed.");

      console.log("Test multiple references cloning...");
      objclone.prop2[0].prop1 = "prop1 aux val NEW";
      assert.ok((objclone.prop2[1].prop1 === objclone.prop2[0].prop1), "reference cloning 1 failed.");
      assert.ok((objclone.prop2[1].prop1 !== obj.prop2[0].prop1), "reference cloning 2 failed.");
      assert.done();
  },

  testSleep: function(assert) {
      let start = new Date().getTime();
      console.log("Timer Start: " + start);
      CoreUtils.sleep(1000).then(() => {
          let stop = new Date().getTime();
          console.log("Timer Stop: " + stop);

          assert.expect(1);
          assert.ok((stop > start), "Stop time is not greater than start time");
          assert.done();
      });
  }
};
