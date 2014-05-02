/**
 * simple chatting room
 * Copyright (C) 2014 guanglin.an (lucky315.an@gmail.com)
 * 
 */

 "use strict";

var express = require('express');
var debug = require('debug')('Chat:app');
var config = require('./config');
var port = config.dev.port;

var app = exports = module.exports = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.send('Hello World');
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, function(){
    debug('Chatting server is listening port on %d', port);
  });
}

