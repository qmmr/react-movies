'use strict'

var gulp = require('gulp')
var browserify = require('browserify')
var to5ify = require('6to5ify')
var source = require('vinyl-source-stream')
var globTests = require('../utils/globTests')

gulp.task('browserify-tests', [ 'clean:tmp' ], function() {
	var options = {
		fullPaths: false,
		debug: false,
		detectGlobals: true,
		noBuiltins: true
	}
	var testFiles = globTests()

	return browserify(testFiles, options)
		.transform(to5ify)
		.bundle()
		.pipe(source('tests.js'))
		.pipe(gulp.dest('./.tmp'))
})
