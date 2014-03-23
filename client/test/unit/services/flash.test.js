'use strict';

describe('Test FlashService', function () {
	var flashService;//, rootScope;$injector
	
	beforeEach(function(){
		module('appServices');
		inject(function(FlashService) {
			//rootScope = $injector.get('$rootScope');
			flashService = FlashService;
		});
	});
	
	it('should be able to set/get/clear $rootScope.flash', function() {
		expect(flashService.get()).toBe(undefined);
		flashService.set('user name is not existing');
		//rootScope.$digest();
		expect(flashService.get()).toBe('user name is not existing');
		flashService.clear();
		expect(flashService.get()).toBe('');
	});
});