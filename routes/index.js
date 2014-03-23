var midware = require('../lib/midware.js')
	, db = require('../lib/db.js');

module.exports = function(app){
	/**
	 * Spec 3.1 HTTP GET for default page
	 */ 
	app.get('/', midware.authentication, function(req, res){
		res.redirect('/settings');
	});

	/**
	 * Spec 3.2 fetch settings page, listing vehicles
	 * quest = {query:{},projection:{},sort:{},limit: 100 }
	 * function(collection, quest, callback)
	 */
	app.get('/settings', midware.authentication, function(req, res){
		var uid = req.session.user.uid;
		
		var sort = [['name', 1]];
		db.find('vehicle',{query:{'uid': uid}, sort:sort,limit:20}, function(err, vehicles) {
			if (!err) {
				//console.log('vehicles=>%j', vehicles);
				res.render('settings', {title: "Settings", uid: uid, vehicles: vehicles});
			} else {
				res.render('500', {
					title : '500 Error page'
				});
			}
		});
	});

	/**
	 * Spec 3.3 save a vehicle with POST
	 */
	app.post('/vehicle', midware.authentication, function(req, res){
		req.body.uid = req.session.user.uid;
		console.log('saving vehicle =%j',req.body);
		db.save('vehicle', req.body, function(err, insertedDoc){
			if(!err) {
				res.redirect('/settings');
			} else {
				console.log('saving vehicle err=%j',err);
				res.render('500', {
					title : '500 Error page'
				});
			}
		});
	});
};
