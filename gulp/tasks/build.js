'use strict'

var gulp = require('gulp')

gulp.task('build', [ 'copy:css', 'copy:markup', 'browserify' ])
