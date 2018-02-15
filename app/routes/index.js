'use strict';

var { validationResult, query } = require('express-validator/check');
var { sanitize } = require('express-validator/filter');

var AddStockHandler = require('../controllers/addStockHandler.server.js');
var addStockHandler = new AddStockHandler();

function isVaild (req, res, next) {
	var errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ error: 'Please provide vaild input.' });
  }
	next();
}

module.exports = function (app) {
	app.route('/')
		.get(function (req, res) {
			res.render('index');
		});
	app.route('/stocks')
		.get(addStockHandler.getStocks)
		.post([query('s').isAlpha(), sanitize('s').trim()], isVaild, addStockHandler.addStock)
		.delete([query('s').isAlpha(), sanitize('s').trim()], isVaild, addStockHandler.deleteStock);
};
