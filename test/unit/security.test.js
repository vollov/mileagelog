'use strict';

var	assert = require('assert')
	, should = require('should')
	, security = require('../../lib/security');


describe('Test security library\n', function() {

	//hash('foobar')=8843d7f92416211de9ebb963ff4ce28125932878
	//hash('blah')=5bf1fd927dfb8679496a2e6cf00cbe50c1c87145
	//hash('passwd')=30274c47903bd1bac7633bbf09743149ebab805f
	describe('Test hash function', function() {
		it('should create correct hash value', function(done) {
			var hashValue = security.hash('passwd');
			hashValue.should.equal('30274c47903bd1bac7633bbf09743149ebab805f');
			done();
		});
	});

});
