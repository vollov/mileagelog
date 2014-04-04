var redisService = require('./redis');

module.exports = {
	/**
	 * Add Access-Control-Allow-Headers in HTTP response
	 */
	header : function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
		res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, HEAD, OPTIONS');
		next();
	},
	
	/**
	 * Authentication each /api/* request with the tokenid
	 */
	authentication: function(req, res, next) {
		//console.log('in authentication');
		// check a undefined tid
		if(req.query == {} || !('tid' in req.query)){
			//console.log('in authentication, no tid');
			return res.send(401, { message : 'please login' });
		} else {
			var tokenid = req.query.tid;
			var query = [tokenid, 'email'];
			// console.log('in authentication, got tid=' + tokenid);
			redisService.hget(query, function(err, reply){
				if(reply != null) {
					// console.log('tid validation passed! tid=' + tokenid);
					// we are going to extend the expire time, if the expire 
					// is less than 60 seconds
					redisService.ttl(tokenid, function(err, reply){
						if(!err) {
							if(reply <= 60) {
								// reset session expire in 900 seconds = 15min
								redisService.expire(tokenid, 900, function(err, reply){
									if(err) {
										console.log(reply.toString());
									}
								});
							}
						}
					});
					// store email into local storage
					res.locals.email = reply;
					// TODO: store vids by email res.locals.vids and verify it for mileages
					next();
				} else {
					// console.log('tid validation failed! tid=' + tokenid);
					return res.send(401, { message : 'invalid tokenid' });
				}
			});
		}
	},
	
	/**
	 * Authorization: check if the user with tokenid has rights to access the api 
	 */
	authorization: function(tokenid, url) {
		//return {status: status_code, message : 'xxxx'}
		//if role is not admin
		
		//if url == get '/api/users/:id', then id must == uid.
		//if url == get '/api/mileages/:vid', then vid must belongs to user.email
		//if delete /api/vehicles/:id, then vid must belongs to user.email
	}	
}
