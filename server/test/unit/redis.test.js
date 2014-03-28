'use strict';

var assert = require('assert')
  , should = require('should')
  , redisService = require('./redis');

describe('Test redis session service:\n', function() {
	var uuid = '110ec58a-a0f2-4ac4-8393-c866d813b8d1';
	var email = 'mary@demo.org';
	var token_id = 'f2cb3e8d653f46008272113c6c72422843902ef8';
	
	beforeEach(function(done) {
		var record = [token_id, 'email', email, 'role', 1];
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
	
	describe('Test save a token', function() {
		var uuid1 = '110ec58a-a0f2-4ac4-8393-c866d813b8d1';
		var email1 = 'wendy@abc.com';
		var token_id1 = '8843d7f92416211de9ebb963ff4ce28125932878';
		var record1 = [token_id1, 'email', email1, 'role', 2];
		
		it('should be able to query sub keys', function() {
			redisService.save(token_id1, record1, function(err, reply){
				should.not.exist(err);
//				console.log(reply.toString());
			});
			
			var query = [token_id1, 'email'];
			redisService.hget(query, function(err, reply){
				//console.log('look up sub key =' + reply.toString());
				should.not.exist(err);
				reply.should.equal('wendy@abc.com');
			});
			
			redisService.remove(token_id1, function(err, reply){
				should.not.exist(err);
//				console.log(reply.toString());
			});
		});
	});

	describe('Test look up subkey if key does not exists', function() {
		it('should not be able to find a sub key if key does not exists', function(done) {
			var query = ['dummykey', 'email'];
			redisService.hget(query, function(err, reply){
				should.not.exist(err);
				//console.log('reply is->' + reply);
				//reply.should.equal(1);
				done();
				
			});
		});
	});
	
	describe('Test check if key in hash value', function() {
		it('should be able to find a existing key', function(done) {
			redisService.exists(token_id, function(err, reply){
				should.not.exist(err);
				reply.should.equal(1);
				done();
				//console.log('reply is->' + reply.toString());
			});
		});
	});
	
	describe('Test number of subkeys', function() {
		it('should be able to get total number of subkeys', function(done) {
			redisService.subkeys(token_id, function(err, reply){
				should.not.exist(err);
				reply.should.have.lengthOf(2);
				done();
			});
		});
	});
});