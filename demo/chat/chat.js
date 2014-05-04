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

var jsmask = require('json-mask');

var app = exports.app = express();
var http = require('http');
var httpServer = exports.httpServer = http.createServer(app);
var io = exports.io = require('socket.io')(httpServer);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.send('Hello World');
});

if (process.env.NODE_ENV !== 'test') {
  httpServer.listen(port, function(){
    debug('Chatting server is listening port on %d', port);
  });
}

io.use(function(socket, next){
  var field = 'headers(host),url,method,_query';
  var handshakeData = socket.request;
  debug(jsmask(handshakeData, field));

  if (false) {
    return next(new Error('[hook] Not Auth'))
  }  
  // do some authorization...
  next();
});

io.on('connection', function(socket){
  debug('New client is connected...[socket id]:' + socket.id);

  socket.on('disconnect', function(){
    debug('A client disconnected...');
  });
});

io.on('error', function(err){
  debug('[socket.io][error] ', err);
});

process.on('uncaughtException', function(err) {
  debug(err);
  debug(err.stack);
  throw err;
});

