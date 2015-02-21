'use strict'

var gulp = require('gulp')
var browserifyTask = require('./browserify')

gulp.task('watchify', [ 'clean' ], function(cb) {
	// start browserify with devMode
	browserifyTask(cb, true)
})
