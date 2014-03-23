'use strict';

describe('Test vehicle Service', function() {
	
	var url = 'http://localhost:5002';
	var vehicleService, $httpBackend, scope;

	var vehicles=[{
		'email': 'mary@demo.org',
		'name': 'Lincon MKX'
	}, {
		'email': 'mary@demo.org',
		'name': 'Corolla'
	}];
	
	var vehicle = {
		'email': 'mary@demo.org',
		'name': 'Golf'
	};
	
	beforeEach(module('appServices'));
	
	beforeEach(inject(function(Vehicle, $rootScope, _$httpBackend_) {
		vehicleService = Vehicle;
		
		scope = $rootScope.$new();
		$httpBackend = _$httpBackend_;
	}));
	
	it('should be able to query vehicles', function() {
		
		$httpBackend.expectGET(url + '/api/vehicles?tid=f2cb3e8d653f46008272113c6c72422843902ef8')
		.respond(200, vehicles);
		vehicleService.query('f2cb3e8d653f46008272113c6c72422843902ef8', 
				function(data, status, headers, config){
			scope.vehicles = data;
		});

		$httpBackend.flush();
		//console.log('vehicles=%j', scope.vehicles);
		expect(scope.vehicles.length).toBe(2);
	});
	
	//
	it('should be able to save vehicle', function() {
		$httpBackend.expectPOST(url + '/api/vehicles?tid=f2cb3e8d653f46008272113c6c72422843902ef8', vehicle)
			.respond(200, vehicle);
		vehicleService.save('f2cb3e8d653f46008272113c6c72422843902ef8', vehicle, 
				function(data, status, headers, config){
			scope.vehicle = data;
		});

		$httpBackend.flush();
		//console.log('vehicle=%j', scope.vehicle);
		expect(scope.vehicle.name).toBe('Golf');
	});
});