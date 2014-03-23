'use strict';

var db = require('./lib/db');

function seeding(){
	var vid=null;
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
			},{
				'vid': vid,
				'start': 1035093,
				'end': 1035112,
				'date': new Date('2014/3/3'),
				'type': 'private',
				'note': 'custom'
			}];

			db.insert('mileage', mileages, function(err, insertedDocs){
				if(err){
					console.log(err);
				}
			});
		} else {
			console.log(err);
		}
	});
}

seeding();