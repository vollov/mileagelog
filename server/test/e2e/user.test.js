'use strict';

var request = require('supertest')
	, should = require('should')
	, mongojs = require('mongojs')
	, db = require('../../lib/db')
	, redisService = require('../../lib/redis');
	//, app = require('../../mileage.server.5002').app;
	
	
describe('Test users api\n', function() {
	var url = process.env.url;
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
	
	describe('Test get a list of users: GET->' + url_user_api, function() {
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
				//console.log('return from login ' + res.body);
				token_id = res.body['tokenid'];
				token_id.length.should.equal(40);
				done();
			});
		});
		
		console.log('in client tokenid=' + token_id);
		it('should return 4 users for url ', function(done) {
			request(url)
			.get(url_user_api + '?tid=' + token_id)
			.expect('Content-Type', /json/)
			.expect('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
			.expect(200)
			.end(function(err,res){
				should.not.exist(err);
				res.body.should.have.lengthOf(4);
				res.body[0].should.have.property('firstname', 'Dustin');
				if (err) return done(err);
				
				redisService.remove(token_id, function(err, reply){
					//console.log(reply.toString());
					done();
				});
			});
		});
	});
	
	describe('Test get user by id: GET-> /api/users/52e9ce56977f8a8b113a09f9', function() {
		var token_id = 'f2cb3e8d653f46008272113c6c72422843901ef3';
		var email = 'mary@demo.org';
		
		beforeEach(function(done) {
			var record = [token_id, 'uid', '52e9ce56977f8a8b113a09f9', 'email', email];
			redisService.save(token_id, record, function(err, reply){
				//console.log(reply.toString());
				done();
			});
		});
		
		afterEach(function(done){
			redisService.remove(token_id, function(err, reply){
				//console.log(reply.toString());
				done();
			});
		});
		
		/**
		 * User should only be able to query it self
		 */
		it('should be able to query user by id ', function(done) {
			request(url)
			.get(url_user_api + '/52e9ce56977f8a8b113a09f9?tid=' + token_id)
			.expect('Content-Type', /json/)
			.expect('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
			.expect(200)
			.end(function(err,res){
				should.not.exist(err);
				
				res.body.should.have.property('firstname', 'Dustin');
				if (err) return done(err);
				done();
			});
		});
		
		
	});
	
	describe('Test add user: POST -> /public/users', function() {
		
		var url_add_user_api = '/public/users';
		afterEach(function(done) {
			db.remove('user', {'firstname': "Bill"}, true, function(err, numberOfRemovedDocs) {
				should.not.exist(err);
				// console.log('delete %j user', numberOfRemovedDocs);
				done();
			});
		});
		
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
	});

	/**
	 * should be only delete user self
	 */
	describe('Test delete user: DELETE -> /api/users/52e9ce56977f8a8b113a09f9', function() {
		
		var token_id = 'f2cb3e8d653f46008272113c6c72422843901ef3';
		var email = 'mary@demo.org';
		
		beforeEach(function(done) {
			var record = [token_id, 'uid', '52e9ce56977f8a8b113a09f9', 'email', email];
			redisService.save(token_id, record, function(err, reply){
				//console.log(reply.toString());
				done();
			});
		});
		
		afterEach(function(done) {
			
			var user = {
				"_id": new mongojs.ObjectId("52e9ce56977f8a8b113a09f9"),
				'password': '30274c47903bd1bac7633bbf09743149ebab805f',
				'email': 'dustin@demo.org',
				"firstname" : "Dustin",
				"lastname" : "Light"
			}
			
			db.save('user', user, function(err, numberOfRemovedDocs) {
				should.not.exist(err);
				// console.log('delete %j user', numberOfRemovedDocs);
				redisService.remove(token_id, function(err, reply){
					//console.log(reply.toString());
					done();
				});
			});
		});
		
		
		
		it('should be able to delete user ' + url_user_api, function(done) {
			
			request(url)
			.del(url_user_api + '/52e9ce56977f8a8b113a09f9?tid='+ token_id)
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