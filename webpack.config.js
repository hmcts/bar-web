var  webpack = require('webpack')
var path  = require('path')

module.exports = {

    entry: __dirname + '/src/frontend/index.js',
    output: {
		filename: 'build.min.js',
		path: path.resolve(__dirname, 'src', 'main', 'public', 'dist')
    },
    module: {
		loaders: [
			{ test: /\.js$/, loader: 'babel-loader', query: { presets: ['es2015'] }, exclude: /node_modules/ },
			{ test: /\.html$/, loader: 'raw-loader' },
            { test: /\.vue$/, loader: 'vue-loader' }
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
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js'
        }
    },
	devtool: 'source-map'
}
