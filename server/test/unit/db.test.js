'use strict';

var	assert = require('assert')
	, should = require('should')
	, db = require('./db');

describe('Test db library\n', function() {
	
	var firstname = 'demo';

	afterEach(function(done) {
		db.remove('user', {'firstname': firstname}, false, function(err, numberOfRemovedDocs) {
			should.not.exist(err);
			// console.log('delete %j user', numberOfRemovedDocs);
			done();
		});
	});
	
	describe('Test find function', function() {
		it('should find 4 users in test db', function(done) {
			db.find('user', {projection:{'firstname' : 1,  'lastname':1}, limit: 10},function(err, users) {
				should.not.exist(err);
				//console.log('return ' + users.length + ' users.');
				users.should.have.lengthOf(4);
				done();
			});
		});
	});

	describe('Test save function', function() {
		it('should be able to insert a user', function(done) {
			var user = {'firstname': firstname, 'lastname': 'blah'};
			db.save('user', user, function(err, user){
				should.not.exist(err);
				db.find('user', {projection:{'firstname' : 1,  'lastname':1}, limit: 10}, function(err, users) {
					should.not.exist(err);
					users.should.have.lengthOf(5);
					done();
				});
			});
		});
	});

	describe('Test update function', function() {
		it('should be able to update a none existing user', function(done) {
			db.update('user',  {'firstname': firstname}, 
				{$set: {"lastname": 'lana'}}, 
				{multi:true, upsert: true, safe: true},
					function(err, doc){
						should.not.exist(err);
						//console.log('updated user = %j', doc);
						db.findOne('user', {'firstname': firstname},{'firstname' : 1,  'lastname':1}, function(err, user) {
							should.not.exist(err);
							should.exist(user);
							//console.log('return user %j',user[0]);
							//user[0].should.have.property('lastname', 'lana');
							//user[0].should.have.property('age', 31);
							done();
						});
			});
		});
	});
	
	describe('Test findAndModify function', function() {
		it('should be able to find and update user by email', function(done) {
			var user = {'firstname': firstname, 'lastname': 'blah'};
			db.save('user', user, function(err, user){
				should.not.exist(err);
			});
			
			db.findAndModify('user',  {'firstname': firstname}, 
				{$set: { lastname: 'Iana' }},
				function(err, doc){
					should.not.exist(err);
					//console.log('findAndModify user = %j', doc);
					
					db.findOne('user', {'firstname': firstname},{'firstname' : 1,  'lastname':1}, function(err, user) {
						should.not.exist(err);
						//console.log('return user ' + user);
						user.should.have.property('lastname', 'Iana');
						done();
					});
			});
		});
	});
});
