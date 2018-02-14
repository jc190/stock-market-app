var Stocks = require('../models/stocks.js');
var csv = require('csvtojson');

module.exports = function () {

  var csvFile = process.cwd() + '/app/common/WIKI-datasets-codes.csv';
  
  Stocks
    .findOne({ id: 'WIKI' })
    .exec(function (err, result) {
      if (err) { throw err; }
      if (result) { return }

      var codes = [];

      csv({ noheader: true, headers: ['symbol', 'name'] })
        .fromFile(csvFile)
        .on('json', function (jsonObj) {
          jsonObj.symbol = jsonObj.symbol.slice(jsonObj.symbol.indexOf('/') + 1);
          jsonObj.name = jsonObj.name.slice(0, jsonObj.name.indexOf('(') - 1);
          codes.push(jsonObj);
        })
        .on('done', function (error) {
          if (error) { throw error; }
          // logic here
          var newStock = new Stocks({
            id: 'WIKI',
            codes: codes,
            current: []
          });
          newStock.save(function (err) {
            if (err) { throw err; }
            console.log('End');
          });
        });
    });
}

