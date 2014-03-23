
/**
 * Module dependencies.
 */
var express = require('express')
	, midware = require('./lib/midware');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = exports.app = express();
var MongoStore = require('connect-mongo')(express);

// all environments
app.set('port', process.env.PORT || 3002);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));

app.use( express.cookieParser());
app.use(express.bodyParser());

app.use(express.json());
app.use(express.urlencoded());

app.use(express.session({
	secret: 'asdfds1^*4567890QWERTY',
	// session expiration in every 15 minutes cookie: {  }
	cookie: {maxAge: 1000 * 60 * 5, httpOnly: false},
	store: new MongoStore({
		url:'localhost/mileage'
		//clear_interval: 3600
	}),
}));

app.use(function(req, res, next) {
	req.session._garbage = Date();
	req.session.touch();
	next();
});

app.use(express.methodOverride());

app.use(function(req, res, next){
	res.locals.session = req.session;
	next();
});

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

require('./routes/index')(app);
require('./routes/user')(app);
//require('./routes/blog')(app);
require('./routes/auth')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
