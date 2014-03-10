db.user.drop();
db.routes.drop();
db.drive.drop();

users = [ {
	'password': '30274c47903bd1bac7633bbf09743149ebab805f',
	'uid' : 1,
	'email': 'mary@demo.org',
	"firstname" : "Thomas",
	"lastname" : "Davis",
	"age" : 12
}, {
	'password': '8843d7f92416211de9ebb963ff4ce28125932878',
	'uid': 2,
	'email': 'wendy@abc.com',
	"firstname" : "Wendy",
	"lastname" : "Chan",
	"age" : 33
}, {
	"_id": new ObjectId("52e9ce56977f8a8b113a09f9"),
	'password': '30274c47903bd1bac7633bbf09743149ebab805f',
	'email': 'dustin@demo.org',
	"firstname" : "Dustin",
	"lastname" : "Light",
	"age" : 35
}, {
	'password': '30274c47903bd1bac7633bbf09743149ebab805f',
	'email': 'luke@demo.org',
	"firstname" : "Luke",
	"lastname" : "Smith",
	"age" : 47
}];

routes = [{
	'from':'XYZ, kitchener, n2e4g6',
	'to':'ABC, north york, m2m1p2',
	'distance':111,
	'type':'business',
	'name':'home to toronto'
}, {
	'from':'toronto live',
	'to':'T&T north york promenade',
	'distiance':3.7,
	'type':'personal',
	'name':'toronto live to grocery'
}];

drives = [{
	'uid':
	'start':,
	'end':,
	'date':,
	'type':,
	'note':,
	'routes':
},{
	'uid':
	'start':,
	'end':,
	'date':,
	'type':,
	'note':,
	'routes':
}];

db.user.insert(users);
db.routes.insert(tags);
db.drive.insert(drives);