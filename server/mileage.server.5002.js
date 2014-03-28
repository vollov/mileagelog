var express = require('express')
	, midware = require('./lib/midware')
	, winston = require('winston')
	, program = require('commander');

require('winston-mongodb').Mongo;

var app = exports.app = express();

/**
 * Parse the command line arguments
 */
program.version('0.0.1')
	.option('-m --mode [debug|prod|test]', 'set the running mode')
	.option('-d --db_name [name]', 'set the database name')
	.option('-p --port [5002]', 'set the listerning port')
	.parse(process.argv);

// default configuration
var db_name = 'mileage';
var logging_level = 'info';
var mode = 'prod';
var port = 5002;

app.configure('prod', function(){
	app.use(express.errorHandler());
});

// handle the mode via NODE_ENV, e.g. NODE_ENV=prod node mileage.server.5002.js
if (program.mode) mode = program.mode;
if (program.port) port = program.port;

// pick up the running mode, info by default
switch(mode){
	case 'test':
		db_name = 'mileage_test';
		logging_level = 'verbose';
	case 'debug':
		logging_level = 'debug';
	default:
		logging_level = 'info';
}

if (program.db_name) db_name = program.db_name;

//setup logger [silly, debug, verbose, info, warn, error]
var logger = new (winston.Logger)({
	transports : [ new (winston.transports.Console)({
		level : logging_level,
		timestamp : true,
		colorize : true
	}), new (winston.transports.File)({
		filename : 'logs/mileage.server.5002.log',
		level : logging_level,
		timestamp : true
	}), new winston.transports.MongoDB({ 
		db: 'mileage_log', 
		level: logging_level}) 
	]
});

app.configure(function(){
	app.use(express.favicon());
	//app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
});

// to use: $env NODE_ENV=test node mileage.server.5002.js
app.configure('test', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('debug', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('prod', function(){
	app.use(express.errorHandler());
});

app.all('*', midware.header);
app.options('/api/*', function(req,res){
	res.send(200);
});
app.all('/api/*', midware.authentication);

//API
require('./api/user')(app);
require('./api/auth')(app);
require('./api/vehicle')(app);

app.listen(port, '0.0.0.0');
logger.info('mileage server listening on '+ port +'...');
