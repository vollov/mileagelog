var db = require('../lib/db')
	, midware = require('../lib/midware')
	, security = require('../lib/security')
	, mongojs = require('mongojs');

/*
 * GET users listing.
 */

module.exports = function(app) {
	
	app.get('/user/new', function(req, res) {
		res.render('user/new', {title: "Registeration"});
	});
	
	app.get('/user/:id', midware.authentication, function(req, res) {
		var id = req.params.id;
		//'firstname' : 1,  'lastname':1, 'age': 1
		db.findOne('user', {'_id': mongojs.ObjectId(id)},{}, function(err, user) {
			if (!err) {
				//console.log('user=>%j', user);
				res.render('user/profile', {
					title : 'User profile', user: user
				});
			} else {
				res.render('500', {
					title : '500 Error page'
				});
			}
		});
	});
	
	app.get('/user', midware.authentication, function(req, res) {
		
		var sort = [['firstname', 1]];
		db.find('user',{sort:sort,limit:20}, function(err, users) {
			if (!err) {
				//console.log('users=>%j', users);
				res.render('user/index', {
					title: 'Users', users: users
				});
			} else {
				res.render('500', {
					title : '500 Error page'
				});
			}
		});
	});
	
	app.del('/user/:id', midware.authentication, function(req, res, next) {
		var id = req.params.id;
		db.remove('user', {'_id': mongojs.ObjectId(id)}, function(err, numberOfRemovedDocs) {
			if (!err) {
				res.redirect('/user');
			} else {
				res.render('500', {
					title : '500 Error page'
				});
			}
		});
	});
	
	/**
	 * Spec 2.1 add a new user with POST, create session.user
	 */
	app.post('/user', function(req, res){
		req.body.password = security.hash(req.body.password);
		console.log('saving user=%j',req.body);
		db.save('user', req.body, function(err, insertedUser){
			if(!err) {
				var user = {
					'uid': insertedUser._id
				};
				req.session.user = user;
				console.log('inserted user=' + insertedUser._id);
				res.redirect('/settings/'+ insertedUser._id);
			} else {
				res.render('500', {
					title : '500 Error page'
				});
			}
		});
	});
	
	/**
	 * Spec 1.4 edit a user with PUT
	 */
//	app.put('/api/users', function(req, res){
//		var id = req.body._id;
//		delete req.body['_id']
//		db.update('user',  {'_id': mongojs.ObjectId(id)}, {$set: req.body},
//			{upsert: false, multi:false}, function(){res.send(200,req.body);
//		});
//	});
};