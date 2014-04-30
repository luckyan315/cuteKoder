/**
 * a proxy server for pipe websocket to tcp
 * Copyright (C) 2014 guanglin.an (lucky315.an@gmail.com)
 * 
 */

 "use strict";

var http = require('http');
var debug = require('debug')('ChatServer');

var port = 3000;

var server = http.createServer(function(res, req){
  res.end('hello world');
});

server.listen(port, function(){
  debug('http server is listening on port %d', port);
});