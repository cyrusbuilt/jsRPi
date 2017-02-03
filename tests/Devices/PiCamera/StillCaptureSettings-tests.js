'use strict';

const OS = require('os');
const Path = require('path');
const StillCaptureSettings = require('../../../src/lib/Devices/PiCamera/StillCaptureSettings.js');
const FileInfo = require('../../../src/lib/IO/FileInfo.js');
const Size = require('../../../src/lib/Size.js');

module.exports.StillCaptureSettingsTests = {
	setGetImageQualityTest: function(assert) {
		let scs = new StillCaptureSettings();
		scs.imageQuality = StillCaptureSettings.QUALITY_DEFAULT;

		assert.expect(1);
		assert.equals(scs.imageQuality, StillCaptureSettings.QUALITY_DEFAULT, "Image quality is not default");
		assert.done();
	},
	toArgumentStringTest: function(assert) {
		let temp = OS.tmpdir() + Path.sep + "testcap.jpg";

		let scs = new StillCaptureSettings();
		scs.verbose = true;
		scs.outputFile = new FileInfo(temp);
		scs.imageSize = new Size(50, 40);
		scs.timeout = 5;

		let expected = ' --width 50 --height 40 --quality 75 --timeout 5 --output "' + temp + '" --verbose --encoding jpg';

		assert.expect(1);
		assert.equals(scs.toArgumentString(), expected, "Argument strings do not match");
		assert.done();
	}
};
