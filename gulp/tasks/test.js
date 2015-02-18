var gulp = require('gulp')
var karma = require('karma').server
var path = require('path')

/** Run test once and exit */
gulp.task('test', function(done) {
	karma.start({
		configFile: path.join(__dirname, '../..', '/karma.conf.js'),
		singleRun: true
	}, done)
})
