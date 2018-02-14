'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');

if (process.env.NODE_ENV === 'development') {
	var browserSync = require('browser-sync').create();
}

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

require('dotenv').load();
require('./app/config/databaseInit.js')();

// Connect to database
mongoose.connect(process.env.MONGO_URI, {useMongoClient: true});
mongoose.Promise = global.Promise;

// Use pug views
app.set('views', './views');
app.set('view engine', 'pug');

app.locals.pretty = true;

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(function (req, res, next) {
	req.io = io;
	next();
});

routes(app);

var port = process.env.PORT || 8080;
server.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
	if (process.env.NODE_ENV === 'development') {
		// Listen to change events on .pug/.css/.js and reload
		browserSync.watch('./views/**/*.pug').on('change', browserSync.reload);
		browserSync.watch('./public/css/main.css').on('change', browserSync.reload);
		browserSync.watch('./app/common/**/*.js').on('change', browserSync.reload);
		browserSync.watch('./app/controllers/**/*.client.js').on('change', browserSync.reload);
		// Start browser-sync
		browserSync.init({
			proxy: 'http://localhost:' + port,
			open: false
		});
	}
});
