// Provides gulp style logs to the bundle method in browserify.js
var gutil = require('gulp-util')
var prettyHrtime = require('pretty-hrtime')
var startTime

module.exports = {
	start: function(filepath) {
		startTime = process.hrtime()
		gutil.log(gutil.colors.cyan('Bundling'), gutil.colors.green(filepath), gutil.colors.cyan('...'))
	},

	watch: function(bundleName) {
		gutil.log('Watching files required by: ', gutil.colors.yellow(bundleName))
	},

	end: function(filepath) {
		var taskTime = process.hrtime(startTime)
		var prettyTime = prettyHrtime(taskTime)
		gutil.log(gutil.colors.cyan('Bundled!'), gutil.colors.green(filepath), 'in', gutil.colors.magenta(prettyTime))
	}
}
