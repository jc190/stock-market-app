'use strict';

module.exports = function (app) {
	app.route('/')
		.get(function (req, res) {
			res.render('index');
		});
	app.route('/stocks')
		.get(function (req, res) {
			var stocks = [];
			// Access database and pull in stock info
			res.json({ stocks });
		})
		.post(function (req, res) {
			// Look up symbol/company
			// Look up stock history
			// Add to database
			// Trigger socket event
		})
		.delete(function (req, res) {
			// Look up stock in database and delete it
			// Trigger socket event
		});
};
