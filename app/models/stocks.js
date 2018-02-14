'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Stock = new Schema({
  id: String,
  codes: Array,
  current: [{
    symbol: String,
    name: String,
    data: Array,
    updated: Date
  }]
});

module.exports = mongoose.model('Stock', Stock);
