var express = require('express')
	, midware = require('./lib/midware')
	, Config = require('./lib/config')
	, program = require('commander');

var app = exports.app = express();

// Parse the command line arguments
program.version('0.0.1')
	.option('-m --mode [debug|prod|test]', 'set the running mode')
	.option('-d --db_name [name]', 'set the database name')
	.option('-p --port [5002]', 'set the listerning port')
	.parse(process.argv);

// global variable to hold default configuration
app.running_mode = 'prod';
// read the running_mode from command parameter
if (program.mode) app.running_mode = program.mode;

// load the configuration
app.config = new Config(app.running_mode);

// final set the configuration if have command parameters
if (program.port) app.config.setPort(program.port);
if (program.db_name) app.config.setDataBaseName(program.db_name);

//import logger
app.logger = (require('./lib/logger')(app)).logger;

app.configure(function(){
	app.use(express.favicon());
	app.use(express.logger());
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
require('./api/auth')(app);
require('./api/user')(app);
require('./api/vehicle')(app);

app.listen(app.config.port, '0.0.0.0');
app.logger.info('mileage server listening on '+ app.config.port +'...');
