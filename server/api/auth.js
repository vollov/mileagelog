var db = require('../lib/db.js')
	//, mongojs = require('mongojs')
	, security = require('../lib/security')
	, redisService = require('../lib/redis');
module.exports = function(app) {
	/** 
	 * login logic:
	 * 		if db has email and password:
	 *			generate token id, save it in db, and send back
	 * 		else:
	 *			return 401 and error message
	 */
	app.post('/public/login', function(req, res){
//		console.log('getting credential from login = %j', req.body)
		var username = req.body.username;
		var password = req.body.password;
		db.findOne('user', {'email': username}, {'password':1, 'email': 1}, function(err, user){
//			console.log('findOne return a user = %j', user);
			if(!err) {
				if(user == null){
					// console.log('user not in db');
					return res.send(401, { message : 'user name is not existing' });
				}else{
					if(security.hash(password) == user['password']) {
						var uuid = security.uuid();
						var token_id = security.hash(username + uuid);
//						console.log('return token:' + token_id);
						
						var record = [token_id, 'uid', user._id, 'email', username];
						redisService.save(token_id, record, function(err, reply){
							// console.log(reply.toString());
						});
						
						redisService.save(token_id, record, function(err, reply){
							if(!err){
								// session expire in 900 seconds = 15min
								redisService.expire(token_id, 900, function(err, reply){
									if(err) {
										console.log(reply.toString());
									}
								});
							} 
//							else {
//								console.log(reply.toString());
//							}
						});
						
						return res.send(200, { tokenid : token_id, uid : user._id, email : username});
					}else{
						return res.send(401, { message : 'incorrect password' });
					}
				}
			} else {
				return res.send(500, { message : 'Error when querying database' });
			}
		});
	});
	
	app.get('/api/logout', function(req, res){
		var tokenid = req.query.tid;
		redisService.remove(tokenid, function(err, reply){
			//console.log(reply.toString());
			if(err){
				console.log('error in db level=%j', err);
				return res.send(401, { message : 'invalid tokenid' });
			}else{
				//console.log('valid tokenid! tokenid=' + tokenid);
				return res.send(200, { message : 'logged out' });
			}
		});
	});
	
	app.get('/public/routes', function(req, res){
		return res.send(200, {routes: ['/','/login','/logout','/postcodes','/about']});
	});
}
