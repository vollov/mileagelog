'use strict';

describe('Test User Service', function() {
	
	var url = 'http://localhost:5002';
	var userService, $httpBackend, scope;

	var users = [ {
		"id" : "524ae33f2e75106200ade071",
		"firstname" : "lana",
		"lastname" : "Smith",
		"age" : 27
	}, {
		"id" : "524ae33f2e75106200ade072",
		"firstname" : "Karina",
		"lastname" : "Kage",
		"age" : 24
	} ];
	
	var user = {
		"firstname" : "lana",
		"lastname" : "Smith",
		"age" : 27
	};
	
	beforeEach(module('appServices'));
	
	beforeEach(inject(function(User, $rootScope, _$httpBackend_) {
		userService = User;
		
		scope = $rootScope.$new();
		$httpBackend = _$httpBackend_;
	}));
	
	it('should be able to query users', function() {
		
		$httpBackend.expectGET(url + '/api/users?tid=f2cb3e8d653f46008272113c6c72422843902ef8')
		.respond(200, users);
		userService.query('f2cb3e8d653f46008272113c6c72422843902ef8', 
				function(data, status, headers, config){
			scope.users = data;
		});

		$httpBackend.flush();
		//console.log('users=%j', scope.users);
		expect(scope.users.length).toBe(2);
	});
	
	it('should be able to save user', function() {
		$httpBackend.expectPOST(url + '/public/users', {data: user})
			.respond(200, user);
		userService.save(user, 
				function(data, status, headers, config){
			scope.user = data;
		});

		$httpBackend.flush();
		//console.log('user=%j', scope.user);
		expect(scope.user.lastname).toBe('Smith');
	});
});