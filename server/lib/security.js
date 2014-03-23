var crypto = require('crypto');
var uuid = require('node-uuid');

module.exports = {
	hash : function(value){
		var hash = crypto.createHash('sha1');
		return hash.update(value).digest('hex');
	},
	
	uuid : function() {
		return uuid.v4();
	}
}

