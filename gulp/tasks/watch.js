'use strict'

var gulp = require('gulp')
var config = require('../config')

gulp.task('watch', [ 'watchify', 'browserSync' ], function() {
	gulp.watch(config.markup.src, [ 'copy:markup' ])
	gulp.watch(config.css.src, [ 'copy:css' ])
})
