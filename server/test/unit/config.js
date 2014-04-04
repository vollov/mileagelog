'use strict';

/**
 * Use Class pattern to build object
 */

function Config(mode) {
	// default value
	this.logging_level = 'info';
	this.port = 5002;
	this.db_name = 'mileage';
	this.log_file = 'logs/mileage.server.5002.log';
	
	this.setRunningMode(mode);
}

Config.prototype.setRunningMode = function(mode){
	switch(mode){
		case 'test':
			this.db_name = 'mileage_test';
			this.logging_level = 'verbose';
			break;
		case 'debug':
			this.logging_level = 'debug';
			break;
		default:
			this.logging_level = 'info';
	}
};

Config.prototype.setPort = function(port){
	this.port = port;
};

Config.prototype.setLogFile = function(file){
	this.log_file = file;
};

Config.prototype.setDataBaseName = function(name){
	this.db_name = name;
};

module.exports = Config;