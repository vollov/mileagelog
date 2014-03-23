'use strict';

angular.module('appModule', [ 'ngRoute', 'appControllers' ])
	.config(function($routeProvider) {
		$routeProvider.when('/settings', {
			controller : 'VehicleCtrl',
			templateUrl : '/views/settings.html'
		}).when('/registration', {
			controller : 'RegistrationCtrl',
			templateUrl : '/views/public/registration.html'
		}).when('/login', {
			controller : 'LoginCtrl',
			templateUrl : '/views/public/login.html'
		}).when('/registration/success', {
			controller : 'RegistrationCtrl',
			templateUrl : '/views/public/reg-success.html'
		}).when('/user/:id', {
			controller : 'EditUserCtrl',
			templateUrl : '/views/user/detail.html'
		}).when('/mileage/new/:vid', {
			controller : 'MileageCtrl',
			templateUrl : 'views/mileage/detail.html'
		}).when('/mileage/:vid', {
			controller : 'MileageCtrl',
			templateUrl : '/views/mileage/list.html'
		}).when('/500', {
			templateUrl : '/views/public/500.html'
		}).otherwise({
			redirectTo : '/settings'
		});
		
		//$locationProvider.html5Mode(true);
	})
	.config(function($httpProvider) {
		var logsOutUserOn401 = function($location, $q) {
			var success = function(response) {
				return response;
			};

			var error = function(response) {
				if (response.status === 401) {
					//SessionService.unset('authenticated');
					$location.path('/login');
					return $q.reject(response);
				} else {
					return $q.reject(response);
				}
			};
	
			return function(promise) {
				return promise.then(success, error);
			};
		};
	
		$httpProvider.responseInterceptors.push(logsOutUserOn401);
	})
	.run(function($rootScope, $location, AuthenticationService) {
		var routesThatRequireAuth = [ '/user','/settings' ];
	
		$rootScope.$on('$routeChangeStart', function(event, next, current) {
			
			if (_(routesThatRequireAuth).contains($location.path())
					&& !AuthenticationService.isLoggedIn()) {
				//$cookieStore.put('nextView', $location.path());
				$location.path('/login');
			}
		});
	});