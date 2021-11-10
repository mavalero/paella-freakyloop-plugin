const path = require('path');
const config = require('./webpack.common');

config.entry = './src/index.js',
config.output = {
	path: path.join(__dirname, "dist"),
	filename: 'paella-freakyloop-plugin.js',
	library: 'paella-freakyloop-plugin',
	libraryTarget: 'umd'
	},
config.module = {
	rules: [
		{
			test: /\.js$/,
			exclude: /(node_modules)/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env']
				}
			}
		},

		{
			test: /\.css$/,
			use:  [
				'style-loader',
				'css-loader'
			]
		},

		{
			test: /\.svg$/i,
			use: {
				loader: 'svg-inline-loader'
			}
		}
	]
};


module.exports = config;