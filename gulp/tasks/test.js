'use strict'

var gulp = require('gulp')
var karma = require('gulp-karma')
var globTests = require('../utils/globTests')
var browserify = require('browserify')
var to5ify = require('6to5ify')
var source = require('vinyl-source-stream')
var watchify = require('watchify')
var gutil = require('gulp-util')

gulp.task('test', [ 'browserify-tests' ], function() {
	return gulp.src([
			'./.tmp/tests.js'
		], { read: false })
		.pipe(karma({
			configFile: './karma.conf.js'
		}))
})

gulp.task('bundle-and-watch-tests', function() {
	var options = {
		cache: {},
		packageCache: {},
		fullPaths: false,
		debug: true,
		detectGlobals: true,
		noBuiltins: true
	}
	var testFiles = globTests()
	var bundler = browserify(testFiles, options)
	var bundle

	bundler.transform(to5ify)
	bundler = watchify(bundler)

	bundle = function() {
		return bundler
			.bundle()
			.on('error', function(err) {
				gutil.log(gutil.colors.red('Browserify Error'), err.message)
				this.emit('end')
			})
			.pipe(source('tests.js'))
			.pipe(gulp.dest('./.tmp'))
	}

	bundler.on('update', function() {
		gutil.log.apply(gutil, [ 'Browserify Update' ].concat(arguments))
		return bundle()
	})

	return bundle()
})

gulp.task('test:continuous', [ 'bundle-and-watch-tests' ], function() {
	return gulp.src([
			'./.tmp/tests.js'
		], { read: false })
		.pipe(karma({
			configFile: './karma.conf.js',
			action: 'watch',
			browsers: [ 'Chrome' ],
			reporters: [ 'progress' ]
		}))
		.on('error', function(err) {
			gutil.log(gutil.colors.yellow('Karma Error'), err)
		})
})
