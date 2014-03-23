3var express = require('express')
	, path = require('path');

var app = express();

app.configure(function(){
  
  app.use(express.favicon());
  //app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/app'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.get('*', function(req,res){
  res.sendfile('index.html', { root: path.resolve(__dirname + '/app') });
});

app.listen(3002, '0.0.0.0');
console.log("Express server listening...");
