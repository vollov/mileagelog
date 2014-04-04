'use strict';

var request = require('supertest')
	, should = require('should')
	, nconf = require('nconf')
	, redisService = require('../../lib/redis');

describe('Test auth service\n', function() {
	
	nconf.argv().env();
	// Then load configuration from a designated file.
	nconf.file({ file: 'config.json' });
	
	var url = nconf.get('url');
	var url_login = '/public/login';
	
	describe('Test login api: POST->' + url_login, function() {
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
				
				var token_id = res.body['tokenid'];
				token_id.length.should.equal(40);
				
				res.body.should.have.property('email', 'mary@demo.org');
				if (err) return done(err);
				done();
			});
		});
		
		it('should return HTTP 401 if user is not in db', function(done) {
			
			var credentials = {
				username: 'mary.li@demo.org',
				password: 'passwd'
			}
			request(url)
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
			request(url)
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