'use strict';

describe('Test config module\n', function() {
	var Config = require('./config');
	var config;
	
	beforeEach(function(done) {
		config = new Config('prod');
		done();
	});
	
	it('should have default config', function(done) {
		config.should.have.property('logging_level', 'info');
		config.should.have.property('port', 5002);
		config.should.have.property('db_name', 'mileage');
		done();
	});
	
	it('should be able to set port', function(done) {
		config.should.have.property('logging_level', 'info');
		config.should.have.property('port', 5002);
		config.should.have.property('db_name', 'mileage');
		
		config.setPort(5003);
		config.should.have.property('port', 5003);
		done();
	});
	
	it('should be switch config to test mode', function(done) {
		config.should.have.property('logging_level', 'info');
		config.should.have.property('port', 5002);
		config.should.have.property('db_name', 'mileage');
		
		config.setRunningMode('test');
		//config = require('./config')('test');
		config.should.have.property('logging_level', 'verbose');
		config.should.have.property('db_name', 'mileage_test');
		
		done();
	});
});