var path = require("path");
var webpack = require("webpack");
module.exports = {
	cache: true,
    watch: true,
    devtool: 'source-map',
	entry: {
        main: './src/js/main.js'
	},
	output: {
		path: path.join(__dirname, "dist"),
		// publicPath: "dist/",
		filename: "[name].js",
		// chunkFilename: "[chunkhash].js"
	},
	module: {
		loaders: [
			{ test: /\.js$/, exclude: /(node_modules|bower_components)/, loader: 'babel', query: { presets: ['es2015'] }, cacheDirectory: true },
			{ test: /\.html$/, exclude: /(node_modules|bower_components)/, loader: 'mustache', query: { minify: true } },
			// { test: /\.html$/, exclude: /(node_modules|bower_components)/, loader: 'nunjucks-loader' },
		]
	},
	externals: {
        "jquery": "jQuery"
    },
	resolve: {
		alias: {
		}
	},
	plugins: [
		new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
		// new webpack.optimize.DedupePlugin(),
		// new webpack.optimize.OccurrenceOrderPlugin(),
		// new webpack.optimize.UglifyJsPlugin()
	]
};
