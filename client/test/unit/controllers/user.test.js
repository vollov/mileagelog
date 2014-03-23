'use strict';

describe('User related controllers', function() {
	var resourceRoot = 'http://localhost:3000';
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
	
	describe('UserCtrl', function() {
		var scope, ctrl, $httpBackend;
		beforeEach(module('appModule'));

		beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
			$httpBackend = _$httpBackend_;
			$httpBackend.expectGET(resourceRoot + '/api/users').respond(users);
			scope = $rootScope.$new();
			ctrl = $controller('UserCtrl', {
				$scope : scope
			});
		}));

		it('users model should have 4 users', function() {
			//expect(scope.users).toBeUndefined();
			expect(scope.users.length).toBe(0);
			$httpBackend.flush();
			expect(scope.users.length).toBe(2);
			//expect(scope.users[0].email).toBe('mary@demo.org');
		});
	});
});