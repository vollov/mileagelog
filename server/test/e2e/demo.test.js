'use strict';
describe('Test demo api\n', function() {
	
	var token_id;
	
	before(function(done){
		token_id = 0;
		//console.log('connect db from before()');
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
			//console.log('Testing add=' + token_id);
			done();
		});
	});
	
	describe('Test list', function() {
		it('should be able to list', function(done) {
			//console.log('Testing list=' + token_id);
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