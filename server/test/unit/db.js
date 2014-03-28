var mongojs = require('mongojs')
	, _und = require('underscore');

var db = mongojs('localhost/mileage_test');

module.exports = {
	
	filterId : function(collections) {
		return _und.map(collections, function(item,key){
			item['id'] = item['_id'];
			delete item['_id'];
			return item;
		});
	},
	
	/**
	 * quest = {query:{},projection:{},sort:{},limit: 100 }
	 */
	find : function(collection, quest, callback) {
		var query,projection,limit;
		if(!('query' in quest)){
			query = {};
		} else {
			query = quest['query'];
		};
		if(!('projection' in quest)){
			projection = {};
		} else {
			projection = quest['projection'];
		};
		
		if(!('sort' in quest)){
			sort = {};
		} else {
			sort = quest['sort'];
		};
		
		if(!('limit' in quest)){
			db.collection(collection).find(query, projection).sort(sort).toArray(callback);
		} else {
			limit = quest['limit'];
			db.collection(collection).find(query, projection).sort(sort).limit(limit).toArray(callback);
		};
		//projection = (typeof projection === "undefined") ? {} : projection;
		//console.log('find db=> ' + db + ' , coll=> ' + collection);
	},
	// callback:function(err, doc) {...};
	findOne : function(collection, query, projection, callback) {
		var cursor = db.collection(collection).findOne(query, projection, callback);
	},
	//db.mycollection.save({created:'just now'})
	save : function(collection, body, callback) {
		//console.log('save into => ' + collection + ' with: ' +body);
		db.collection(collection).save(body, callback);
		//console.log('save db=> ' + db + ' , coll=> ' + collection);
	},
	// bulk insert
	insert : function(collection, body, callback) {
		db.collection(collection).insert(body, callback);
	},
	//db.mycollection.update({name:'mathias'}, {$inc:{level:1}}, {multi:true}, function() {});
	update : function(collection, query, body, options, callback) {
		db.collection(collection).update(query, body, options, callback);
	},
	
	/**
	 * collection.findAndModify(criteria, sort, update[, options, callback])
	 * options:
	 * remove - if set to true (default is false), removes the record from the collection. Callback function still gets the object but it doesn�t exist in the collection any more.
	 * new - if set to true, callback function returns the modified record. Default is false (original record is returned)
	 * upsert - if set to true and no record matched to the query, replacement object is inserted as a new record
	 */
	findAndModify : function(collection, query, update, callback) {
		db.collection(collection).findAndModify({
			query: query,
			update: update,
			new: true,
		}, callback);
		//db.collection(collection).findAndModify(query, {}, update, options, callback);
	},
	
	remove : function(collection, query, single, callback) {
		db.collection(collection).remove(query, single, callback);
	}
	
}
