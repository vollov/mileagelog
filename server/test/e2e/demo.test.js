'use strict';

var url = 'http://api.mileagelog.ca';

describe('Test demo api\n', function() {
	var url = process.env.url;
	var token_id;
	
	before(function(done){
		token_id = 0;
		console.log('connect db from before() url=' + url);
		done();
	});
	
	after(function(done){
		token_id = 0;
		//console.log('disconnect db from after()');
		done();
	});
	
	beforeEach(function(done){
		token_id++;
		//console.log('login from beforeEach()');
		done();
	});
	
	describe('Test add', function() {
		it('should be able to add', function(done) {
			console.log('Testing add=' + token_id + ' url = ' + url);
			done();
		});
	});
	
	describe('Test list', function() {
		it('should be able to list', function(done) {
			console.log('Testing list=' + token_id);
			done();
		});
	});
	
	describe('Test remove', function() {
		it('should be able to remove', function(done) {
			//console.log('Testing remove=' + token_id);
			done();
		});
	});
});