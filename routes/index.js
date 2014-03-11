
/*
 * GET home page.
 */

module.exports = function(app){
	app.get('/', function(req, res){
		res.redirect('/login');
	});
	
	app.get('/settings', function(req, res){
		res.render('settings', {title: "Settings"});
	});
};
