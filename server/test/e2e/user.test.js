'use strict';

var request = require('supertest')
	, should = require('should')
	, nconf = require('nconf')
	, mongojs = require('mongojs');

/**
 * Test should not directly call db or redis lib
 */
describe('Test users api\n', function() {
	nconf.argv().env();
	// Then load configuration from a designated file.
	nconf.file({ file: 'config.json' });
	
	var url = nconf.get('url');
	var url_user_api = '/api/users';
	var url_login = '/public/login';
	
	describe('Test query users without token: GET->' + url_user_api, function() {
		it('should return 401 without token ', function(done) {
			request(url)
			.get(url_user_api)
			.expect('Content-Type', /json/)
			.expect('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
			.expect(401)
			.end(function(err,res){
				should.not.exist(err);
				res.body.should.have.property('message', 'please login');

				if (err) return done(err);
				done();
			});
		});
	});
	
	describe('Test query users with fake token: GET->' + url_user_api, function() {
		it('should return 401 with fake token ', function(done) {
			request(url)
			.get(url_user_api + '?tid=invalidid')
			.set('SessionToken', 'aabbcc')
			.expect('Content-Type', /json/)
			.expect('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
			.expect(401)
			.end(function(err,res){
				should.not.exist(err);
				res.body.should.have.property('message', 'invalid tokenid');
				if (err) return done(err);
				done();
			});
		});
	});
	
	describe('Test get users: GET->' + url_user_api, function() {
		var token_id;
		it('should return HTTP 200 if authentication success', function(done) {
			
			var credentials = {
				username: 'mary@demo.org',
				password: 'passwd'
			}
			request(url)
			.post(url_login)
			.send(credentials)
			.expect('Content-Type', /json/)
			.expect('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
			.expect(200)
			.end(function(err,res){
				should.not.exist(err);
				//console.log('return from login =%j',res.body);
				token_id = res.body['tokenid'];
				token_id.length.should.equal(40);
				res.body.should.have.property('email', 'mary@demo.org');
				done();
			});
		});
		
		//console.log('in client tokenid=' + token_id);
		it('should return 4 users for url ', function(done) {
			request(url)
			.get(url_user_api + '?tid=' + token_id)
			.expect('Content-Type', /json/)
			.expect('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
			.expect(200)
			.end(function(err,res){
				should.not.exist(err);
				
				//console.log('return from get list=%j ', res.body);
				res.body.should.have.lengthOf(4);
				res.body[0].should.have.property('firstname', 'Dustin');
				if (err) return done(err);
				done();
			});
		});
		
		/**
		 * should be able to query user by id
		 */
		it('should be able to query user by id', function(done) {
			request(url)
			.get(url_user_api + '/52e9ce56977f8a8b113a09f9?tid=' + token_id)
			.expect('Content-Type', /json/)
			.expect('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
			.expect(200)
			.end(function(err,res){
				should.not.exist(err);
				
				res.body.should.have.property('firstname', 'Mary');
				if (err) return done(err);
				done();
			});
		});
		
		/**
		 * TODO: User should only be able to query it self
		 */
//		it('should only be able to query it self', function(done) {
//			request(url)
//			.get(url_user_api + '/52e9ce56977f8a8b113a09e8?tid=' + token_id)
//			.expect('Content-Type', /json/)
//			.expect('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
//			.expect(401)
//			.end(function(err,res){
//				should.not.exist(err);
//				
//				res.body.should.have.property('message', 'user are not authorized to access the data');
//				if (err) return done(err);
//				done();
//			});
//		});
		
	});
	
	describe('Test add user: POST -> /public/users', function() {
		
		var url_add_user_api = '/public/users';
//		afterEach(function(done) {
//			db.remove('user', {'firstname': "Bill"}, true, function(err, numberOfRemovedDocs) {
//				should.not.exist(err);
//				// console.log('delete %j user', numberOfRemovedDocs);
//				done();
//			});
//			
//		});
		
		it('should be able to add user ' + url_add_user_api, function(done) {
			
			var user = {
				"firstname" : "Bill",
				"lastname" : "Gates",
				"email" : "bill@msn.com",
				'password': 'passwd'
			}
			
			request(url)
			.post(url_add_user_api)
			.send(user)
			.expect('Content-Type', /json/)
			.expect('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
			.expect(200)
			.end(function(err,res){
				should.not.exist(err);
				
				res.body.should.have.property('message', 'user registration success');
				if (err) return done(err);
				done();
			});
		});

		var token_id, uid;
		it('should return HTTP 200 if authentication success', function(done) {
			
			var credentials = {
				username: 'bill@msn.com',
				password: 'passwd'
			}
			request(url)
			.post(url_login)
			.send(credentials)
			.expect('Content-Type', /json/)
			.expect('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
			.expect(200)
			.end(function(err,res){
				should.not.exist(err);
				//console.log('return from login =%j',res.body);
				token_id = res.body['tokenid'];
				token_id.length.should.equal(40);
				res.body.should.have.property('email', 'bill@msn.com');
				uid = res.body['uid'];
				done();
			});
		});
		
		//TODO: only admin/self should be able to delete user
		it('should be able to delete user ' + url_user_api, function(done) {
			
			request(url)
			.del(url_user_api + '/' + uid + '?tid='+ token_id)
			.expect('Content-Type', /json/)
			.expect('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
			.expect(200)
			.end(function(err,res){
				should.not.exist(err);
				//console.log(res.body);
				res.body.should.be.true;
				//res.body.should.have.lengthOf(3);
				if (err) return done(err);
				done();
			});
		});
	});
});