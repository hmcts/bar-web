var  webpack = require('webpack')
var path  = require('path')

// yarn add webpack 
// yarn add babel-cli babel-loader
// yarn add babel-preset-es2015
// yarn add babel-preset-env --dev
// yarn add raw-loader --dev

module.exports = {

    entry: __dirname + '/src/frontend/index.js',
    output: {
		filename: 'build.min.js',
		path: path.resolve(__dirname, 'src', 'main', 'public', 'dist')
    },
    module: {
		loaders: [
			{ test: /\.js$/, loader: 'babel-loader', query: { presets: ['es2015'] }, exclude: /node_modules/ },
			{ test: /\.html$/, loader: 'raw-loader' } // npm install --save-dev raw-loader
		]
	},
	stats: {
		colors: true
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				drop_console: false,
			}
		})
	],
	devtool: 'source-map'

}