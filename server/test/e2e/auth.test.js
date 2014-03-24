'use strict';

var request = require('supertest')
	, should = require('should')
	, db = require('../../lib/db')
	, redisService = require('../../lib/redis')
	, app = require('../../mileage.server.5002').app;

// by default, test app.
var url = app;
var mode = process.env.mode;
if(mode == 'remote') {
	url = 'http://api.mileagelog.ca';
}


//var url = 'http://localhost:5002'

describe('Test auth service\n', function() {
	
	var url_login = '/public/login';
	
	describe('Test login api: POST->' + url_login, function() {
		it('should return HTTP 200 if authentication success', function(done) {
			
			var credentials = {
				username: 'mary@demo.org',
				password: 'passwd'
			}
			request(app)
			.post(url_login)
			.send(credentials)
			.expect('Content-Type', /json/)
			.expect('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
			.expect(200)
			.end(function(err,res){
				should.not.exist(err);
				
				//console.log('return from login ' + res.body);
				var token_id = res.body['tokenid'];
				token_id.length.should.equal(40);
				
				var query = [token_id, 'email'];
				redisService.hget(query, function(err, reply){
					should.not.exist(err);
					reply.should.equal('mary@demo.org');
				});
				
				redisService.remove(token_id, function(err, reply){
					should.not.exist(err);
				});
				if (err) return done(err);
				done();
			});
		});
		
		it('should return HTTP 401 if user is not in db', function(done) {
			
			var credentials = {
				username: 'mary.li@demo.org',
				password: 'passwd'
			}
			request(app)
			.post(url_login)
			.send(credentials)
			.expect('Content-Type', /json/)
			.expect('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
			.expect(401)
			.end(function(err,res){
				should.not.exist(err);
				res.body.should.have.property('message', 'user name is not existing');
				done();
			});
		});
		
		it('should return HTTP 401 if password is not correct', function(done) {
			
			var credentials = {
				username: 'mary@demo.org',
				password: 'wrongpasswd'
			}
			request(app)
			.post(url_login)
			.send(credentials)
			.expect('Content-Type', /json/)
			.expect('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
			.expect(401)
			.end(function(err,res){
				should.not.exist(err);
				res.body.should.have.property('message', 'incorrect password');
				done();
			});
		});
	});
});