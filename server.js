'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

if (process.env.NODE_ENV === 'development') {
	var browserSync = require('browser-sync').create();
}

var app = express();
require('dotenv').load();
require('./app/config/passport')(passport);

// Connect to database
// mongoose.connect(process.env.MONGO_URI, {useMongoClient: true});
mongoose.Promise = global.Promise;

// Use pug views
app.set('views', './views');
app.set('view engine', 'pug');

app.locals.pretty = true;

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
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
