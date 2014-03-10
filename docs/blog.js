var db = require('../lib/db.js')
	, midware = require('../lib/midware.js')
	, security = require('../lib/security')
	, mongojs = require('mongojs');

module.exports = function(app) {
	
	app.get('/blog/new', function(req, res) {
		res.render('blog/new', {title: "New Blog"});
	});
	
	app.get('/blog/edit/:id', function(req, res) {
		var id = req.params.id;
		db.findOne('blog', {'_id': mongojs.ObjectId(id)},{}, function(err, blog) {
			if (!err) {
				//console.log('blog=>%j', blog);
				res.render('blog/edit', {
					title : 'Edit Blog', blog: blog
				});
			} else {
				res.render('500', {
					title : '500 Error page'
				});
			}
		});
	});
	
	/**
	 * Spec 1.1 get the blog by object id with GET
	 */
	app.get('/blog/:id', function(req, res) {
		var id = req.params.id;
		db.findOne('blog', {'_id': mongojs.ObjectId(id)},{}, function(err, blog) {
			if (!err) {
				//console.log('blog=>%j', blog);
				res.render('blog/detail', {
					title : 'Blog Detail', blog: blog
				});
			} else {
				res.render('500', {
					title : '500 Error page'
				});
			}
		});
	});
	
	/**
	 * Spec 1.2 get the most recent 20 blogs with GET
	 */
	app.get('/blog', function(req, res) {
		
		var sort = [['publish_date', 1]];
		db.find('blog',{sort:sort,limit:20}, function(err, blogs) {
			if (!err) {
				//console.log('blogs=>%j', blogs);
				res.render('blog/index', {
					title: 'blogs', blogs: blogs
				});
			} else {
				res.render('500', {
					title : '500 Error page'
				});
			}
		});
	});
	
	/**
	 * Spec 1.3 delete a user by object id with DELETE midware.authentication, 
	 */
	app.del('/blog/:id', function(req, res, next) {
		var id = req.params.id;
		db.remove('blog', {'_id': mongojs.ObjectId(id)}, function(err, numberOfRemovedDocs) {
			if (!err) {
				res.redirect('/blog');
			} else {
				res.render('500', {
					title : '500 Error page'
				});
			}
		});
	});
	
	/**
	 * Spec 1.4 add a new blog with POST
	 */
	app.post('/blog', function(req, res){
//		console.log('saving blog=' + req.body);
		db.save('blog', req.body)
		res.redirect('/blog');
	});
	
	/**
	 * Spec 1.5 edit a blog with PUT
	 */
	app.put('/blog', function(req, res){
		var id = req.body._id;
		delete req.body['_id']
		db.update('blog',  {'_id': mongojs.ObjectId(id)}, {$set: req.body},
			{upsert: false, multi:false}, function(){res.send(200,req.body);
		});
	});
};