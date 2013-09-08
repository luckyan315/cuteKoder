#!/usr/bin/env node
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var config = require('./config');
var app = exports.app = express();
var util = require('util');
var middleware = require('./server/middleware');

var term = require('term.js');

var server = exports.server = http.createServer(app);

// all environments
app.set('port', process.env.PORT || config.port || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('BrowserIde'));
app.use(express.session());
app.use(term.middleware());
app.use(middleware.ideProvider());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, 'client/lib')));
app.use(express.static(path.join(__dirname, 'client/support/apf')));
app.use(express.static(path.join(__dirname, 'client/support/demo')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/**
 * routes
 */

require('./server/routes');

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

/**
 * Handle exceptions
 */

process.on('uncaughtException', function(err){
  console.log('Exception: ' + err.stack);
});