'use strict'

var gulp = require('gulp')
var config = require('../config')

gulp.task('copy', [ 'copy:css', 'copy:markup' ])

gulp.task('copy:css', function() {
	return gulp
		.src(config.css.src)
		.pipe(gulp.dest(config.css.dest))
})

gulp.task('copy:markup', function() {
	return gulp
		.src(config.markup.src)
		.pipe(gulp.dest(config.markup.dest))
})
