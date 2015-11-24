var APP_VER = JSON.stringify(require('./package.json').version).replace(/\"/g, "");

module.exports = {
	target: 'node',
	entry: './src/jsrpi.js',
	output: {
		path: './build',
		filename: 'jsrpi-' + APP_VER + '-bundle.js'
	},
	module: {
		loaders: [
			{
				test: /\.node$/,
				loader: "node-loader"
			}
		]
	},
	resolve: {
		extensions: ['', '.js', '.node']
	}
};