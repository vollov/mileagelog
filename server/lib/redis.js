var redis = require("redis"),
	client = redis.createClient();

module.exports = {
	/** 
	 * save or overwrite key-value pairs
	 * 
	 * values : 	a list like ['key', 'subkey1', 'v1', 'subkey2', 737]
	 * call back:	function like:
	 * function (err, reply) {console.log(reply.toString());}
	 */
	save : function(key, values, callback){
		client.hmset(values, callback);
		// Expire in 3600 seconds
		// client.expire(key, 3600);
	},
	expire : function(key, seconds, callback){
		client.expire(key, seconds, callback);
	},
	ttl : function(key, callback) {
		// the seconds will stored in variable reply 
		client.ttl(key, callback);
	},
	persist : function(key, callback) {
		client.persist(key, callback);
	},
	remove : function(key, callback){
		client.del(key, callback);
	},
	exists : function(key, callback){
		client.exists(key, callback);
	},
	
	/** 
	 * get key-value pairs
	 * 
	 * key : 	key
	 * call back:	function like:
	 * function (err, replies) {
	 * 	replies.forEach(function (reply, i) {
	 * 		console.log("    " + i + ": " + reply);
	 * 	});
	 * }
	 */
	subkeys : function(key, callback){
		client.hkeys(key, callback);
	},
	
	/** 
	 * delete a sub key key-value pairs
	 * 
	 * values : 	a list like ['key', 'subkey1']
	 * call back:	function like:
	 * function (err, reply) {console.log(reply.toString());}
	 */
	removeSubkey: function(values, callback){
		client.hdel(values, callback);
	},
	
	hget: function(values, callback){
		client.hget(values, callback);
	},
	
	/** 
	 * check if a sub key key-value pair is set
	 * 
	 * values : 	a list like ['key', 'subkey1']
	 * call back:	function like:
	 * function (err, reply) {console.log(reply.toString());}
	 */
	subkeyExists: function(values, callback){
		client.hexists(values, callback);
	}
}

//client.hset("hash key", "hashtest 1", "some value", redis.print);
//client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
//client.hmset(["dustin", "hashtest 3", "xs value"], redis.print);
//client.hdel(['goku','race'], redis.print);
//client.hexists(['goku','race'], redis.print);
//client.hexists(["dustin", "hashtest 3"], redis.print);
//client.quit();