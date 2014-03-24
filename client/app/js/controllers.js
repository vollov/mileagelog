'use strict';

angular.module('appControllers', [ 'appServices', 'ui.bootstrap' ])
	.controller('RegistrationCtrl', function($scope, $location, User){
		$scope.register = function(){
			User.save($scope.user, function() {
				$location.path('/registration/success');
			});
		};
		
		$scope.gotoLogin = function(){
			$location.path('/login');
		}
	})
	.controller('LoginCtrl',function ($scope, $location, AuthenticationService, FlashService) {
		$scope.credentials = { username: "", password: ""};
		$scope.message = "Please sign in";
		
		$scope.login = function() {
			//console.log('Calling login func');
			AuthenticationService.login($scope.credentials).success(function() {
				$location.path('/settings');
			}).error(function(){
				$scope.message = FlashService.get();
			});
		};
		
		$scope.signup = function(){
			$location.path('/registration');
		}
		
	})
	.controller('VehicleCtrl', function($scope, $location, SessionService, Vehicle){
		var tokenid = SessionService.get('tid');
		if(!(tokenid == undefined)) {
			Vehicle.query(tokenid, function(data, status, headers, config) {
				$scope.vehicles = data;
			});
		}
		
		$scope.mileages = function(vid){
			//console.log('Calling VehicleCtrl.mileages()');
			//console.log('current path=' + $location.path);
			$location.path('/mileage/' + vid);
		};
		
		$scope.saveVehicle = function(){
			Vehicle.save(tokenid, $scope.vehicle, function(data, status, headers, config) {
				$scope.vehicles.push(data);
				//$location.path('/settings');
			});
		};

		$scope.deleteVehicle = function (vehicle, index) {
			//console.log('delete vehicle vid='+ vehicle._id);
//			var confirm = confirm('Delete vehicle ' + vehicle.name + ' will remove it mileages, please confirm to proceed!');
//			if (confirm) {
			Vehicle.remove(tokenid, vehicle._id, function(data, status, headers, config) {
				//console.log('Vehicle remove returned, delete index='+ index);
				$scope.vehicles.splice(index, 1);
				//$scope.vehicles = data;
			});
//			}
		}
	})
	.controller('MileageCtrl', function($scope, $location, $routeParams, SessionService, Mileage){
		var tokenid = SessionService.get('tid');
		var vid = $routeParams.vid;
		if(!(tokenid == undefined)) {
			Mileage.query(tokenid, vid, function(data, status, headers, config) {
				$scope.mileages = data;
			})
		}
		
		$scope.newMileage = function(){
			$location.path('/mileage/new/' + vid);
		};
		
		$scope.saveMileage = function(){
			//var mileage = $scope.mileage;
			//mileage.date = new Date($scope.mileage.date);
			console.log('saving mileage with vid=' + vid);
			console.log('saving mileage=%j', $scope.mileage);
			
			Mileage.save(tokenid, vid, $scope.mileage, function(data, status, headers, config) {
				//$scope.mileages.push(data);
				console.log('saving mileage return data=%j', data);
				$location.path('/mileage/' + vid);
			});
		};
		$scope.removeMileage = function(mileage, index){
			
			Mileage.remove(tokenid, mileage._id, function(data, status, headers, config) {
				//console.log('Vehicle remove returned, delete index='+ index);
				$scope.mileages.splice(index, 1);
				//$scope.vehicles = data;
			});
		};
	})
	.controller("NavCtrl", function($scope, $location, AuthenticationService, SessionService) {
		var tokenid = SessionService.get('tid');
		$scope.logout = function() {
			console.log('calling logout in NavCtrl.....');
			AuthenticationService.logout(tokenid).success(function() {
				$location.path('/login');
			}).error(function(data, status, headers, config){
				console.log('[client] NavCtrl.logout().error() data=%j', data);
				console.log('[client] NavCtrl.logout().error() status=%j', status);
			});
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

