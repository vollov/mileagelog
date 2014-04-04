'use strict';

var mongojs = require('mongojs')
	, Config = require('./config');


/**
 * db defined as a protptype
 * @param app object {config:object, running_mode: 'prod', logger: object}
 * @returns
 */
function DB(app) {
	this.logger = app.logger;
	this.db = mongojs('localhost/' + app.config.db_name);
}

/**
 * quest = {query:{},projection:{},sort:{},limit: 100 }
 */
DB.prototype.find = function(collection, quest, callback){
	var sort, query, projection, limit;
	
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
	
	this.logger.debug('db.find() with collection=%j, quest=%j', collection, quest);
	
	if(!('limit' in quest)){
		this.db.collection(collection).find(query, projection).sort(sort).toArray(callback);
	} else {
		limit = quest['limit'];
		this.db.collection(collection).find(query, projection).sort(sort).limit(limit).toArray(callback);
	};
};

// callback:function(err, doc) {...};
DB.prototype.findOne = function(collection, query, projection, callback) {
	var cursor = this.db.collection(collection).findOne(query, projection, callback);
},

//db.mycollection.save({created:'just now'})
DB.prototype.save = function(collection, body, callback) {
	//this.logger.debug('save into => ' + collection + ' with: ' +body);
	this.db.collection(collection).save(body, callback);
},

// bulk insert
DB.prototype.insert = function(collection, body, callback) {
	this.db.collection(collection).insert(body, callback);
},

//db.mycollection.update({name:'mathias'}, {$inc:{level:1}}, {multi:true}, function() {});
DB.prototype.update = function(collection, query, body, options, callback) {
	this.db.collection(collection).update(query, body, options, callback);
},

/**
 * collection.findAndModify(criteria, sort, update[, options, callback])
 * options:
 * remove - if set to true (default is false), removes the record from the collection. Callback function still gets the object but it doesn�t exist in the collection any more.
 * new - if set to true, callback function returns the modified record. Default is false (original record is returned)
 * upsert - if set to true and no record matched to the query, replacement object is inserted as a new record
 */
DB.prototype.findAndModify = function(collection, query, update, callback) {
	this.db.collection(collection).findAndModify({
		query: query,
		update: update,
		new: true,
	}, callback);
	//db.collection(collection).findAndModify(query, {}, update, options, callback);
},

DB.prototype.remove = function(collection, query, single, callback) {
	this.db.collection(collection).remove(query, single, callback);
}

module.exports = DB;
