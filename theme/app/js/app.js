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
		}).when('/mileage/new/123', {
			controller : 'MileageCtrl',
			templateUrl : 'views/mileage/detail.html'
		}).when('/mileage/123', {
			controller : 'MileageCtrl',
			templateUrl : '/views/mileage/list.html'
		}).when('/500', {
			templateUrl : '/views/public/500.html'
		}).otherwise({
			redirectTo : '/login'
		});
	});