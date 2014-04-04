var DB = require('../lib/db')
	, midware = require('../lib/midware')
	, security = require('../lib/security')
	, mongojs = require('mongojs');

module.exports = function(app) {
	var db = new DB(app);
	var logger = app.logger;

	logger.info('loading module user');
	
	/**
	 * Spec b1.1 add a new user with POST, create session.user
	 */
	app.post('/public/users', function(req, res){
		req.body.password = security.hash(req.body.password);
		logger.debug('saving user=%j',req.body);
		//return res.send(200, {message:'user registration success'});
		db.save('user', req.body, function(err, insertedUser){
			if(!err) {
				return res.send(200, {message:'user registration success'});
			} else {
				return res.send(500, {message:'user registration failed'});
			}
		});
	});
	
	/**
	 * Spec 1.1 get the most recent 20 users with GET
	 */
	app.get('/api/users', function(req, res) {
		// order by 'firstname' with aescendant. 
		var sort = [['firstname', 1]];
		db.find('user',{sort:sort,limit:20}, function(err, users) {
			if (!err) {
				//var result = db.filterId(users);
				return res.send(200,users);
			} else {
				return console.log(err);
			}
		});
	});

	/**
	 * Spec 1.2 get the user by object id with GET
	 */
	app.get('/api/users/:id', function(req, res){
		var id = req.params.id;
		db.findOne('user', {'_id': mongojs.ObjectId(id)}, {}, function(err, user){
			if (!err) {
				return res.send(200,user);
			} else {
				return console.log(err);
			}
		});
	});
	
	/**
	 * Spec 1.4 edit a user with PUT
	 */
	app.put('/api/users', function(req, res){
		var id = req.body._id;
		delete req.body['_id']
		db.update('user',  {'_id': mongojs.ObjectId(id)}, {$set: req.body},
			{upsert: false, multi:false}, function(){res.send(200,req.body);
		});
	});
	
	/**
	 * Spec 1.5 delete a user by object id with DELETE
	 */
	app.delete('/api/users/:id', function(req, res){
		var id = req.params.id;
		db.remove('user', {'_id': mongojs.ObjectId(id)}, true, function(err, message){
			if (!err) {
				res.json(true);
			} else {
				console.log(err);
				res.json(false);
			}
		});
	});
};
