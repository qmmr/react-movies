var src = './src'
var dest = './dist'

module.exports = {

	browserify: {
		debug: true,
		src: src,
		dest: dest + '/js',
		bundleConfigs: [
			{
				// Specify the entry point of your app
				entries: src + '/App.jsx',
				dest: dest + '/js',
				outputName: 'bundle.js',
				// cache: {},
				// packageCache: {},
				// fullPaths: true,
				extensions: [ '.js', '.es6', '.jsx' ]
			}
		]
	},

	browserSync: {
		server: {
			baseDir: [ dest ]
		},
		port: 8000
		// files: [
		// 	dest + '/**/*',
		// 	'!' + dest + '/**/*.map'
		// ]
	},

	markup: {
		src: src + '/htdocs/**',
		dest: dest
	},

	css: {
		src: src + '/css/**',
		dest: dest + '/css'
	}

}
