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
  var socket_req_field = 'headers(host),url,method,_query';
  var handshakeData = socket.request;
  debug('Messages from HandshakeData:\n', jsmask(handshakeData, socket_req_field));

  // do some authorization...
  if(!handshakeData.uuid){
    handshakeData.uuid = 'wkrldi';
  }

  next();
});

io.on('connection', function(socket){
  debug('New client is connected...');
  var io_socket_field = 'rooms,id';
  debug(JSON.stringify(jsmask(socket, io_socket_field)));

  socket.on('disconnect', function(){
    debug('A client disconnected...');
  });
});

io.of('/user', function(socket){
  // todo: public user api
  
  socket.on('add', function(){
    socket.emit('user_added');
  });
});

io.of('/private', function(socket){
  debug(socket.nsp.name + ' --------a client is connected!');
  debug('[uuid] ', socket.request.uuid);

  //todo: private api

});

io.on('error', function(err){
  debug('[socket.io][error] ', err);
});

process.on('uncaughtException', function(err) {
  debug(err);
  debug(err.stack);
  throw err;
});

