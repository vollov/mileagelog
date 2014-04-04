'use strict';

var	assert = require('assert')
	, should = require('should')
	, app = require('./app').app;

describe('Test logger module\n', function() {
	
	var logger = (require('./logger')(app)).logger;
	
	it('should be able to log', function(done) {
		logger.info('Test logger info module');
		logger.warn('Test logger warn module');
		done();
	});
});