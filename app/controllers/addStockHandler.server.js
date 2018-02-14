var Stocks = require('../models/stocks.js');
var axios = require('axios');

function AddStockHandler () {
  this.getStocks = function (req, res) {
    Stocks.findOne({ id: 'WIKI' })
      .exec(function (err, result) {
        if (err) { throw err; }
        res.json({ stocks: result.current });
      });
  }
  this.addStock = function (req, res) {
    Stocks
      .findOne({ id: 'WIKI' })
      .exec(function (err, result) {
        if (err) { throw err; }

        // Look up stock via symbol
        var stockInfo = result.codes.find(function (code) {
          return code.symbol === req.query.s.toUpperCase()
        });

        // Return error if no stock is found
        if (stockInfo === undefined) {
          return res.json({ error: 'No such stock found.' });
        }

        // Check if stock is already in current list
        for (var i = 0; i < result.current.length; i++) {
          if (result.current[i].symbol === stockInfo.symbol) {
            return res.json({ error: 'Stock is already on chart.' });
          }
        }

        var dt = new Date();
        var startDate = (dt.getFullYear() - 1) + '-' + (dt.getMonth() + 1 ) + '-' + dt.getDate();
        var endDate = dt.getFullYear() + '-' + (dt.getMonth() + 1 ) + '-' + dt.getDate();

        var quandlURL = 'https://www.quandl.com/api/v3/datasets/WIKI/' + stockInfo.symbol + '/data.json?'
                      + 'start_date=' + startDate + '&end_date=' + endDate
                      + '&api_key=' + process.env.QUANDL_API_KEY
        
        axios.get(quandlURL)
          .then(function (response) {
            if (result.current.length < 6) {
              result.current.push({
                name: stockInfo.name,
                symbol: stockInfo.symbol,
                data: response.data.dataset_data.data,
                updated: new Date()
              });
              result.save(function (err) {
                if (err) { throw err; }
                req.io.emit('reloadChart');
                res.status(200).json({ ok: stockInfo.symbol + ' added to chart.' });
              });
            } else {
              res.json({ error: 'Stock list is full. Try removing a stock to add a new one.' });
            }
          })
          .catch(function (error) {
            console.log(error);
            return res.json({ error: 'There was an error getting stock data. Please wait and try again.' })
          });
      });
  }
  this.deleteStock = function (req, res) {
    Stocks.findOne({ id: 'WIKI' })
      .exec(function (err, result) {
        if (err) { throw err; }
        var flag = false;
        for (var i = 0; i < result.current.length; i++) {
          if (result.current[i].symbol === req.query.s.toUpperCase()) {
            result.current.splice(i, 1);
            flag = true;
          }
        }
        if (flag === false) {
          return res.json({ error: 'Stock is not in list to remove.' });
        }
        result.save(function (err) {
          if (err) { throw err; }
          req.io.emit('reloadChart');
          return res.json({ ok: 'Stock removed from chart.' });
        });
      });
  }
}

module.exports = AddStockHandler;