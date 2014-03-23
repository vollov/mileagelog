var midware = require('../lib/midware.js')
	, db = require('../lib/db.js');

module.exports = function(app){
	/**
	 * Spec 4.1 HTTP DELETE for vehicle
	 */
	app.del('/vehicle/:id', midware.authentication, function(req, res, next) {
		var id = req.params.id;
		db.remove('user', {'_id': mongojs.ObjectId(id)}, function(err, numberOfRemovedDocs) {
			if (!err) {
				res.redirect('/user');
			} else {
				res.render('500', {
					title : '500 Error page'
				});
			}
		});
	});
	
	/**
	 * Spec 4.2 HTTP GET for a mileages form
	 */
	app.get('/mileage/new', function(req, res) {
		res.render('mileage/new', {title: "Mileages"});
	});
	
	/**
	 * Spec 4.3 list top 20 mileages
	 */
	app.get('/mileage/:vid', midware.authentication, function(req, res) {
		var vid = req.params.vid;
		var sort = [['date', 1]];
		db.find('mileage',{query:{'vehicleId':vid}, sort:sort,limit:20}, function(err, mileages) {
			if (!err) {
				//console.log('users=>%j', users);
				res.render('mileage/index', {
					title: 'Mileages', mileages: mileages
				});
			} else {
				res.render('500', {
					title : '500 Error page'
				});
			}
		});
	});
	
	/**
	 * Spec 4.4 HTTP GET for find mileages of a vehicle
	 */
	app.get('/mileage/:id', midware.authentication, function(req, res) {
		var id = req.params.id;
		//'firstname' : 1,  'lastname':1, 'age': 1
		db.findOne('mileages', {'_id': mongojs.ObjectId(id)},{}, function(err, user) {
			if (!err) {
				//console.log('user=>%j', user);
				res.render('user/profile', {
					title : 'User profile', user: user
				});
			} else {
				res.render('500', {
					title : '500 Error page'
				});
			}
		});
	});
};