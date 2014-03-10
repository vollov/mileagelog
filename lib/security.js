var crypto = require('crypto');

module.exports = {
	hash : function(value){
		var hash = crypto.createHash('sha1');
		return hash.update(value).digest('hex');
	}
}
