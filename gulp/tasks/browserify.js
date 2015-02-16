'use strict'

var gulp = require('gulp')
var gutil = require('gulp-util')
var source = require('vinyl-source-stream')
var sourcemaps = require('gulp-sourcemaps')
var buffer = require('vinyl-buffer')
var watchify = require('watchify')
var browserify = require('browserify')
var browserSync = require('browser-sync')
var handleErrors = require('../utils/handleErrors')
var bundleLogger = require('../utils/bundleLogger')
var to5ify = require('6to5ify')
var _ = require('lodash')
var config = require('../config')

var browserifyTask = function(cb, devMode) {
	var queueLength = config.browserify.bundleConfigs.length
	var createBundle

	createBundle = function(options) {
		var bundler, bundle, reportFinished

		bundle = function() {
			// Log when bundling starts
			bundleLogger.start(options.entries)

			return bundler
				.transform(to5ify)
				.bundle()
				// Report compile errors
				.on('error', handleErrors)
				// Use vinyl-source-stream to make the stream gulp compatible.
				// Specifiy the desired output filename here.
				.pipe(source(options.outputName))
				// sourcemaps
				.pipe(buffer())
				// loads map from browserify file
				.pipe(sourcemaps.init({ loadMaps: true }))
				.pipe(sourcemaps.write('./'))
				// Specify the output destination
				.pipe(gulp.dest(options.dest))
				.on('end', reportFinished)
				// relad your browser
				.pipe(browserSync.reload({ stream: true }))
		}

		if (devMode) {
			// Add watchify args and debug (sourcemaps) option
			_.extend(options, watchify.args, { debug: true })
			// A watchify require/external bug that prevents proper recompiling,
			// so (for now) we'll ignore these options during development
			options = _.omit(options, [ 'external', 'require' ])
		}

		bundler = browserify(options)
		bundler.on('update', bundle)

		if (devMode) {
			// Wrap with watchify and rebundle on changes
			bundler = watchify(bundler)
			// Rebundle on update
			bundler.on('log', function (msg) {
				gutil.log(msg)
			})

			bundleLogger.watch(options.outputName)
		} else {
			// Sort out shared dependencies. bundler.require exposes modules externally
			if (options.require) {
				bundler.require(options.require)
			}
			// bundler.external excludes modules from the bundle, and expects they'll be available externally
			if (options.external) {
				bundler.external(options.external)
			}
		}

		reportFinished = function() {
			// Log when bundling completes
			bundleLogger.end(options.entries)

			if (queueLength) {
				queueLength -= 1
				if (queueLength == 0) {
					cb()
				}
			}
		}

		return bundle()
	}

	// create bundle for each bundleConfig
	config.browserify.bundleConfigs.forEach(createBundle)
}

gulp.task('browserify', browserifyTask)

module.exports = browserifyTask
