var db = require('../lib/db.js')
	, security = require('../lib/security');

module.exports = function(app) {
	
	/**
	 * Spec 1.1 HTTP GET for display login page
	 */ 
	app.get('/login', function(req, res) {
		res.render('auth/login', {title: "Please login"});
	});
	
	/**
	 * Spec 1.2 HTTP POST for login, create session.user
	 */
	app.post('/login', function(req, res) {
		
		var username = req.body.username;
		var password = req.body.password;
		db.findOne('user', {'email': username}, {'password':1, '_id':1}, function(err, user){
			console.log('findOne return a user = %j', user);
			if(!err) {
				// if user not in DB
				if(user == null){
					console.log('user name ['+ username +'] is not in db');
					res.redirect('/login');
				}else{
					console.log('found user-> %j', user);
					// if password match, save user in to session
					if(security.hash(password) == user['password']) {
						var user = {
							'uid': user['_id'].toString()
						};
						req.session.user = user;
						console.log('login success, session-> %j', req.session.user);
						res.redirect('/settings');
					}else{
						console.log('incorrect password');
						res.redirect('/login');
					}
				}
			} else {
				console.log('Error when querying database');
				res.redirect('/login');
			}
		});
	});
	
	/**
	 * Spec 1.3 HTTP GET for logout
	 */ 
	app.get('/logout', function(req, res, next) {
		console.log('logout session id->'+ req.session.user.uid);
		req.session.destroy();
		res.redirect('/');
	});
}