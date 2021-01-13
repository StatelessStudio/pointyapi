const path = require('path');

module.exports = {
	entry: './src/index.ts',
	target: 'node',
	devtool: 'inline-source-map',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'dist'),
	},
	externals: {
		bufferutil: 'bufferutil',
		'utf-8-validate': 'utf-8-validate'
	},
};
