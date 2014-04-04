var winston = require('winston');
//require('winston-mongodb').Mongo;

//setup logger [silly, debug, verbose, info, warn, error]
module.exports = function(app){
	
	//console.log('app.config=%j', app.config);
	
	var logger = new (winston.Logger)({
		transports : [ new (winston.transports.Console)({
			level : app.config.logging_level,
			timestamp : true,
			colorize : true
		}), new (winston.transports.File)({
			filename : app.config.log_file,
			json: false,
			level : app.config.logging_level,
			timestamp : true
		})
//		, new winston.transports.MongoDB({ 
//			db: 'mileage_log', 
//			level: app.config.logging_level}) 
		]
	});
	
	return {
		logger: logger
	};
}