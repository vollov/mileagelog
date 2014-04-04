var express = require('express')
	, Config = require('./config');

/**
 * Simulate a dummy express js server
 */
var app = exports.app = express();

app.running_mode = 'test';
app.config = new Config(app.running_mode);
app.logger = (require('./logger')(app)).logger;