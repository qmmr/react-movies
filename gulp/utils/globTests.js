var glob = require('glob')

module.exports = function globTests() {
	return glob.sync('./test/spec/**/*.spec.{js,jsx}')
}
