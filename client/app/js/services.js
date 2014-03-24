'use strict';

var api_host_url = 'http://mileagelog.ca';

angular.module('appServices', ['ngResource', 'ngCookies'])
	.factory('SessionService', function(){
		return {
			get: function(key){
				return sessionStorage.getItem(key);
			},
			set: function(key,value){
				return sessionStorage.setItem(key, value);
			},
			unset: function(key){
				return sessionStorage.removeItem(key);
			}
		}
	})
	.factory("FlashService", ['$rootScope', function($rootScope) {
		return {
			set: function(message) {
				$rootScope.flash = message;
			},
			clear: function() {
				$rootScope.flash = "";
			},
			get: function(){
				return $rootScope.flash;
			}
		}
	}])
	.factory('User', function($http) {
		return {
			query : function(tokenid, successCallBack){
				// return a future object
				return $http.get(api_host_url + '/api/users',{params: {'tid': tokenid}})
					.success(successCallBack);
			},
			save : function(user, successCallBack){
				return $http.post(api_host_url + '/public/users',{data: user})
				.success(successCallBack);
			},
			update : function(tokenid, successCallBack){
				return null;
			},
			remove : function(tokenid, successCallBack){
				return null;
			}
		}
	})
	.factory('Vehicle', function($http) {
		return {
			query : function(tokenid, successCallBack){
				// return a future object
				return $http.get(api_host_url + '/api/vehicles',{ params: {'tid': tokenid}})
					.success(successCallBack);
			},
			save : function(tokenid, vehicle, successCallBack){
				return $http.post(api_host_url + '/api/vehicles', vehicle, {params: {'tid': tokenid}})
				.success(successCallBack);
			},
			update : function(tokenid, successCallBack){
				return null;
			},
			remove : function(tokenid, vid, successCallBack){
				return $http.delete(api_host_url + '/api/vehicles/'+vid, {params: {'tid': tokenid}})
				.success(successCallBack);
			}
		}
	})
	.factory('Mileage', function($http) {
		return {
			query : function(tokenid, vehicleid, successCallBack){
				console.log('in Mileage.query() vid=' + vehicleid);
				// return a future object
				return $http.get(api_host_url + '/api/mileages/' + vehicleid, 
						{params: {'tid': tokenid}}).success(successCallBack);
			},
			save : function(tokenid, vid, mileage, successCallBack){
				return $http.post(api_host_url + '/api/mileages/' + vid, 
						mileage, {params: {'tid': tokenid}}).success(successCallBack);
			},
			update : function(tokenid, successCallBack){
				return null;
			},
			remove : function(tokenid, mid, successCallBack){
				return $http.delete(api_host_url + '/api/mileages/' + mid, {params: {'tid': tokenid}})
				.success(successCallBack);
			}
		}
	})
	.factory('AuthenticationService', function($http, $location,
		SessionService, FlashService) {
		var cacheSession = function(response) {
			//console.log('[cacheSession] before response.tokenid=' + response.tokenid);
			SessionService.set('tid', response.tokenid);
			//console.log("[cacheSession] after SessionService.get('tid')=" + SessionService.get('tid'));
			//SessionService.set('email', response.email);
		};
	
		var uncacheSession = function() {
			SessionService.unset('tid');
			//console.log("[uncacheSession] after SessionService.get('tid')=" + SessionService.get('tid'));
			//SessionService.unset('email');
		};
		
		var loginError = function(response) {
			//console.log('calling AuthenticationService.loginError!');
			FlashService.set(response.message);
		};
	
		return {
			login : function(credentials) {
				return $http.post(api_host_url + '/public/login', credentials).
				success(function(response,status){
					if(status == 200){
						//console.log('auth login good, return id=' + response.tokenid);
						cacheSession(response);
						FlashService.clear();
					}else{
						loginError(response);
					}
				}).
				error(function(response,status){
					loginError(response);
				});
			},
			logout : function(tokenid) {
				var logout = $http.get(api_host_url + '/api/logout',
						{params: {tid: tokenid}});
				logout.success(uncacheSession);
				return logout;
			},
			isLoggedIn : function() {
				return !(SessionService.get('tid') == undefined);
			}
		};
	});
	