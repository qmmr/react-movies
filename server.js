'use strict'

var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var path = require('path')
var PORT = process.env.PORT || 8000
var HOST = process.env.HOST || 'localhost'

app
	.use(bodyParser.urlencoded({ extended: true }))
	.use(express.static('./dist'))
	.get('/', function (req, res) {
		res.sendFile(path.join(__dirname, 'index.html'))
	})
	.listen(PORT, HOST, function() {
		console.log('Express server is running on http://%s:%d ', HOST, PORT)
	})


