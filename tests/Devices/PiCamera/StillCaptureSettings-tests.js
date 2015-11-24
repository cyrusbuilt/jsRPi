'use strict';

var OS = require('os');
var Path = require('path');
var StillCaptureSettings = require('../../../src/lib/Devices/PiCamera/StillCaptureSettings.js');
var FileInfo = require('../../../src/lib/IO/FileInfo.js');
var Size = require('../../../src/lib/Size.js');

module.exports.StillCaptureSettingsTests = {
	setGetImageQualityTest: function(assert) {
		var scs = new StillCaptureSettings();
		scs.setImageQuality(StillCaptureSettings.QUALITY_DEFAULT);
		
		assert.expect(1);
		assert.equals(scs.getImageQuality(), StillCaptureSettings.QUALITY_DEFAULT, "Image quality is not default");
		assert.done();
	},
	toArgumentStringTest: function(assert) {
		var temp = OS.tmpdir() + Path.sep + "testcap.jpg";
		
		var scs = new StillCaptureSettings();
		scs.verbose = true;
		scs.outputFile = new FileInfo(temp);
		scs.imageSize = new Size(50, 40);
		scs.timeout = 5;
		
		var expected = ' --width 50 --height 40 --quality 75 --timeout 5 --output "' + temp + '" --verbose --encoding jpg';
		
		assert.expect(1);
		assert.equals(scs.toArgumentString(), expected, "Argument strings do not match");
		assert.done();
	}
};