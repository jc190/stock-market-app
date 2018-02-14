'use strict';

var AddStockHandler = require('../controllers/addStockHandler.server.js');
var addStockHandler = new AddStockHandler();

module.exports = function (app) {
	app.route('/')
		.get(function (req, res) {
			res.render('index');
		});
	app.route('/stocks')
		.get(addStockHandler.getStocks)
		.post(addStockHandler.addStock)
		.delete(addStockHandler.deleteStock);
};
