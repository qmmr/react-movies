'use strict'

var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var path = require('path')
var listen

app
	.use(bodyParser.urlencoded({ extended: true }))
	.use(express.static('./dist'))
	.get('/', function (req, res) {
		res.sendFile(path.join(__dirname, 'index.html'))
	})

listen = exports.listen = function listen(port, host) {
	app.listen(port, host, function() {
		console.log('Express server is running on http://%s:%d ', host, port)
	})
}

if (require.main === module) {
	listen(
		process.env.PORT || 8000,
		process.env.HOST || "localhost"
	)
}
