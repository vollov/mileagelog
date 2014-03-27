'use strict';

var request = require('supertest')
	, should = require('should')
	, mongojs = require('mongojs')
	, db = require('../../lib/db')
	, redisService = require('../../lib/redis');
	
describe('Test vehicle api\n', function() {
	var url = process.env.url;
	var api_url = '/api/vehicles';
	var mileage_api_url = '/api/mileages'
	var login_url = '/public/login';
	var logout_url = '/api/logout';
	
	// Login 
	var token_id;
	before(function(done){
		var credentials = {
				username: 'mary@demo.org',
				password: 'passwd'
			}
		request(url)
		.post(login_url)
		.send(credentials)
		.expect('Content-Type', /json/)
		.expect('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
		.expect(200)
		.end(function(err,res){
			should.not.exist(err);
			//console.log('return from login %j', res.body);
			token_id = res.body.tokenid;
			token_id.length.should.equal(40);
			done();
		});
	});
	
	after(function(done){
		request(url)
		.get(logout_url + '?tid=' + token_id)
		.expect('Content-Type', /json/)
		.expect('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
		.expect(200)
		.end(function(err,res){
			should.not.exist(err);
			//console.log('return from login %j', res.body);
			done();
		});
	});
	
	/**
	 * Add vehicle requires
	 * 1) logged in
	 * 2) get user id via token id
	 */
	describe('Test add vehicle: http.post(' + api_url + ')', function() {

		// console.log('in client tokenid=' + token_id);
		it('should be able to add vehicle ', function(done) {
			
			var vehicle = {
				'name' : 'mini copper'
			}
			
			request(url)
			.post(api_url + '?tid=' + token_id)
			.send(vehicle)
			.expect('Content-Type', /json/)
			.expect('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
			.expect(200)
			.end(function(err,res){
				should.not.exist(err);
				//console.log('return from save vehicle= %j', res.body);
				res.body.should.have.property('email', 'mary@demo.org');
				if (err) return done(err);
				db.remove('vehicle', {'name': "mini copper"}, true, function(err, numberOfRemovedDocs) {
					should.not.exist(err);
					// console.log('delete %j user', numberOfRemovedDocs);
					done();
				});
			});
		});
	});
	
	describe('Test show vehicles: http.get(' + api_url + ')', function() {
		it('should return 2 vehicles for url ', function(done) {
			request(url)
			.get(api_url + '?tid=' + token_id)
			.expect('Content-Type', /json/)
			.expect('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
			.expect(200)
			.end(function(err,res){
				should.not.exist(err);
				res.body.should.have.lengthOf(2);
				res.body[0].should.have.property('name', 'Corolla');
				if (err) return done(err);
				done();
			});
		});
	});
	
	describe('Test add vehicle mileages', function() {
		var vid = null;
		// 
		before(function(done) {
			
			db.findOne('vehicle', {'email': 'mary@demo.org'}, {'_id': 1}, function(err, vehicle){
				if (!err) {
					vid = vehicle._id.toString();
					//console.log('before add mileage with vid=' + vid);
					
					done();
				} else {
					console.log(err);
					return done(err);
				}
			});
		});	
		
		after(function(done){
			//console.log('after add mileage with vid=' + vid);
			db.remove('mileage', {'vid': vid }, false, function(err, numberOfRemovedDocs) {
				should.not.exist(err);
				//console.log('delete %j mileage', numberOfRemovedDocs);
				done();
			});
		});
		
		var mileage = {
				//'vid': vid,
				'start': 1035093,
				'end': 1035112,
				'date': new Date('2014/3/3'),
				'type': 'private',
				'note': 'custom'
			};
		
		it('should be able to add vehicle mileages', function(done) {
			request(url)
			.post(mileage_api_url + '/'+ vid + '?tid=' + token_id)
			.send(mileage)
			.expect('Content-Type', /json/)
			.expect('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
			.expect(200)
			.end(function(err,res){
				should.not.exist(err);
				//console.log('return from save mileages= %j', res.body);
				res.body.should.have.property('end', 1035112);
				if (err) return done(err);
				done();
			});
		});
		
	});
	
	describe('Test list vehicle mileage: http.get(' + mileage_api_url + '/:vid)', function() {
		// console.log('in client tokenid=' + token_id);
		var vid = null;
		// 
		beforeEach(function(done) {
			

			db.findOne('vehicle', {'email': 'mary@demo.org'}, {'_id': 1}, function(err, vehicle){
				if (!err) {
					vid = vehicle._id.toString();
					//console.log('getting vehicle id=' + vid);
					var mileages = [{
						'vid': vid,
						'start': 1035002,
						'end': 1035042,
						'date': new Date('2014/3/1'),
						'type': 'private',
						'note': 'home to walmart'
					},{
						'vid': vid,
						'start':1035042,
						'end': 1035093,
						'date': new Date('2014/3/2'),
						'type': 'business',
						'note': 'home to toronto live'
					}];
					
					
					db.insert('mileage', mileages, function(err, insertedDocs){
						if (err) return done(err);
						//console.log('before list mileage with vid=' + vid);
						done();
					});
				} else {
					console.log(err);
					return done(err);
				}
			});
		});	
		
		afterEach(function(done){
			//console.log('after list mileage with vid=' + vid);
			db.remove('mileage', {'vid': vid}, false, function(err, numberOfRemovedDocs) {
				should.not.exist(err);
				// console.log('delete %j user', numberOfRemovedDocs);
				done();
			});
		});
		
		it('should be able to list mileage by vehicle id', function(done) {
			request(url)
			.get(mileage_api_url + '/'+ vid +'?tid=' + token_id)
			.expect('Content-Type', /json/)
			.expect('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
			.expect(200)
			.end(function(err,res){
				should.not.exist(err);
				//console.log('return from save vehicle= %j', res.body);
				//res.body.should.have.property('email', 'mary@demo.org');
				res.body.should.have.lengthOf(2);
				if (err) return done(err);
				done();
			});
		});
	});
});