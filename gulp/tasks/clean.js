'use strict'

var gulp = require('gulp')
var del = require('del')
var config = require('../config')

gulp.task('clean', [ 'clean:css', 'clean:markup', 'clean:js', 'clean:tmp' ])

gulp.task('clean:css', function(done) {
	del([ config.css.dest + '/*.css' ], done)
})

gulp.task('clean:markup', function(done) {
	del([ config.markup.dest + '/index.html' ], done)
})

gulp.task('clean:js', function(done) {
	del([ config.browserify.dest + '/bundle.js' ], done)
})
gulp.task('clean:tmp', function(done) {
	del([ '.tmp' ], done)
})
