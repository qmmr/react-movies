'use strict'

var gulp = require('gulp')
var del = require('del')
var config = require('../config')
var fs = require('fs')
var path = require('path')
var distCSSDir = path.join(__dirname, '../../dist/css')

gulp.task('clean', function (done) {
	del([
		config.markup.dest + '/index.html',
		config.css.dest + '/*.css',
		config.browserify.dest + '/bundle.js'
	], function () {
		fs.exists(distCSSDir, function (exists) {
			// console.log(exists ? 'yes' : 'no')
			// console.log(distCSSDir)
			// if (!exists) {
			// 	fs.mkdirSync(distCSSDir);
			// }
		})

		done()
	})
})
