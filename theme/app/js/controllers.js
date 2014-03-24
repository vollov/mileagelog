'use strict';

angular.module('appControllers', ['ui.bootstrap'])
	.controller('RegistrationCtrl', function($scope, $location){
		$scope.register = function(){
//			User.save($scope.user, function() {
//				$location.path('/registration/success');
//			});
		};
		
		$scope.gotoLogin = function(){
			$location.path('/login');
		}
	})
	.controller('LoginCtrl',function ($scope, $location) {
		$scope.login = function() {
			//console.log('current path=' + $location.path);
			$location.path('/settings');
		};
		$scope.signup = function() {
			//console.log('current path=' + $location.path);
			$location.path('/registration');
		}
	})
	.controller('VehicleCtrl', function($scope, $location){
//		var tokenid = SessionService.get('tid');
//		if(!(tokenid == undefined)) {
//			Vehicle.query(tokenid, function(data, status, headers, config) {
//				$scope.vehicles = data;
//			});
//		}
//		
		$scope.saveVehicle = function(){

		};
		
		$scope.mileages = function(){
			console.log('Calling VehicleCtrl.mileages()');
			//console.log('current path=' + $location.path);
			$location.path('/mileage/123');
		};

		$scope.deleteVehicle = function () {
			console.log('delete vehicle vid=');
		}
	})
	.controller('MileageCtrl', function($scope, $location){
//		var tokenid = SessionService.get('tid');
//		var vid = $routeParams.vid;
//		if(!(tokenid == undefined)) {
//			Mileage.query(tokenid, vid, function(data, status, headers, config) {
//				$scope.mileages = data;
//			})
//		}
//		
		$scope.newMileage = function(){
			$location.path('/mileage/new/123');
		};
//		
		$scope.saveMileage = function(){
			console.log('saving mileage with vid=');
			console.log('saving mileage=%j',$scope.mileage);
//			$location.path('/mileage/' + vid);
//			Mileage.save(tokenid, vid, $scope.mileage, function(data, status, headers, config) {
//				$scope.mileages.push(data);
//				//$location.path('/mileage/' + vid);
//			});
		};
	})
	.controller("NavCtrl", function($scope, $location) {

		$scope.logout = function() {
			$location.path('/login');
		}
	});
//
//demoApp.controller('UserCtrl', function($scope, $location, $http, SessionService) {
//	console.log('querying users.....');
//	var tokenid = SessionService.get('tid');
//	// TODO: implement $http here
//	$http.get(api_url_root + '/api/users',{params: {tid: tokenid}})
//		.success(function(data, status, headers, config) {
//			$scope.users = data;
//		});
//	
////	$scope.users = User.query();
//
////	$scope.selectUser = function(row) {
////		$scope.selectedRow = row;
////	};
//});
//
//demoApp.controller('EditUserCtrl', function($scope, $location, $routeParams, User ) {
//
//	$scope.user = User.get({
//		id : $routeParams.id
//	});
//});
//

