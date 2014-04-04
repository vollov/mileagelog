'use strict';

var request = require('supertest')
	, should = require('should')
	, nconf = require('nconf')
	, mongojs = require('mongojs');
	
/**
 * Test should not directly call db or redis lib
 */
describe('Test vehicle api\n', function() {
	nconf.argv().env();
	// Then load configuration from a designated file.
	nconf.file({ file: 'config.json' });
	var url = nconf.get('url');
	
	var vehicle_api_url = '/api/vehicles';
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
			//console.log('return from logout %j', res.body);
			done();
		});
	});
	
	/**
	 * Add vehicle requires
	 * 1) logged in
	 * 2) get user id via token id
	 */
	describe('Test add vehicle: http.post(' + vehicle_api_url + ')', function() {

		var vid;
		// console.log('in client tokenid=' + token_id);
		it('should be able to add vehicle ', function(done) {
			
			var vehicle = {
				'name' : 'mini copper'
			}
			
			request(url)
			.post(vehicle_api_url + '?tid=' + token_id)
			.send(vehicle)
			.expect('Content-Type', /json/)
			.expect('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
			.expect(200)
			.end(function(err,res){
				should.not.exist(err);
				//console.log('return from save vehicle= %j', res.body);
				res.body.should.have.property('email', 'mary@demo.org');
				vid = res.body['_id'];
				//console.log('in client it vid=' + vid);
				if (err) return done(err);
				done();
			});
		});
		
		//TODO: only admin/self should be able to remove vehicle inserted
		it('should be able to delete inserted vehicle', function(done) {
			//console.log('in client vid=' + vid);
			request(url)
			.del(vehicle_api_url + '/' + vid + '?tid='+ token_id)
			.expect('Content-Type', /json/)
			.expect('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
			.expect(200)
			.end(function(err,res){
				should.not.exist(err);
				//console.log(res.body);
				res.body.should.be.true;
				//res.body.should.have.lengthOf(3);
				if (err) return done(err);
				done();
			});
		});
	});
	
	describe('Test show vehicles: http.get(' + vehicle_api_url + ')', function() {
		it('should return 2 vehicles for url ', function(done) {
			request(url)
			.get(vehicle_api_url + '?tid=' + token_id)
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
	
	describe('Test add, list and delete vehicle mileages', function() {
		var vid, mid;
		// get the vehicle id
		it('should return 2 vehicles for url ', function(done) {
			request(url)
			.get(vehicle_api_url + '?tid=' + token_id)
			.expect('Content-Type', /json/)
			.expect('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
			.expect(200)
			.end(function(err,res){
				should.not.exist(err);
				res.body.should.have.lengthOf(2);
				res.body[0].should.have.property('name', 'Corolla');
				vid = res.body[0]._id;
				if (err) return done(err);
				done();
			});
		});
		
		var mileage = {
				//'vid': vid,
				'start': 1035093,
				//'end': 1035112,
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
				mid = res.body['_id'];
				if (err) return done(err);
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
				res.body.should.have.lengthOf(1);
				if (err) return done(err);
				done();
			});
		});
		
		//TODO: should be able to update mileage
//		it('should be able to update vehicle mileages', function(done) {
//			request(url)
//			.post(mileage_api_url + '/'+ vid + '?tid=' + token_id)
//			.send(mileage)
//			.expect('Content-Type', /json/)
//			.expect('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
//			.expect(200)
//			.end(function(err,res){
//				should.not.exist(err);
//				//console.log('return from save mileages= %j', res.body);
//				res.body.should.have.property('end', 1035112);
//				mid = res.body['_id'];
//				if (err) return done(err);
//				done();
//			});
//		});
		
		//TODO: only admin/self should be able to delete mileage
		it('should be able to delete mileage ' + mileage_api_url, function(done) {
			
			request(url)
			.del(mileage_api_url + '/' + mid + '?tid='+ token_id)
			.expect('Content-Type', /json/)
			.expect('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
			.expect(200)
			.end(function(err,res){
				should.not.exist(err);
				//console.log(res.body);
				res.body.should.be.true;
				//res.body.should.have.lengthOf(3);
				if (err) return done(err);
				done();
			});
		});
	});

});