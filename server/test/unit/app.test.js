'use strict';

var	assert = require('assert')
	, should = require('should')
	, app = require('./app').app;
//	, db = require('./db');

describe('Test if application can be loaded\n', function() {
	
	it('running mode should be loaded', function(done) {
		app.should.have.property('running_mode', 'test');
		done();
	});
	
	
	it('config object should be loaded', function(done) {
		app.config.should.have.property('db_name', 'mileage_test');
		app.config.should.have.property('logging_level', 'verbose');
		app.config.should.have.property('port', 5002);
		done();
	});

});
