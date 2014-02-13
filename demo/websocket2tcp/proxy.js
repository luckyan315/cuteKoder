/**
 * a proxy server for pipe websocket to tcp
 * Copyright (C) 2014 guanglin.an (lucky315.an@gmail.com)
 * 
 */

"use strict";

var path = require('path');
var url = require('url');
var fs = require('fs');
var argv = require('optimist')
  .usage('Usage: $0 -s [source_addr] -t [target_addr] -p [static_dir]')
  .demand(['s','t']).argv;
var source_addr = argv.s || '127.0.0.1:8888';
var target_addr = argv.t;
var source_addr_port = getPort(source_addr);
var target_addr_port = getPort(target_addr);
var static_path = path.join(__dirname, argv.p || './');

var http = require('http');
var ws = require('ws');
var WebSocketServer = ws.Server;
/* websocket server */
var wsServer = null; 

/* create web server */
var webServer = http.createServer(handleRequest);

webServer.listen(source_addr_port, function(){
  console.log('Websocket2TCP Proxy listen on ' + source_addr_port);

  wsServer = new WebSocketServer({server : webServer});
  wsServer.on('connection', handleConnection);
});

/* handle http request */
function handleRequest(req, res, next){
  var filename = path.join(static_path, url.parse(req.url).pathname);
  fs.exists(filename, function(exists){
    if (!exists) {
      return http_error(res, 404, '404 Not Found');
    }
    
    fs.readFile(filename, 'binary', function(err, file){
      if (err) return http_error(res, 500, err);

      res.writeHead(200);
      res.write(file, 'binary');
      res.end();
    });
  });
};

/* handle websocket connection */
function handleConnection(client){
  //TODO:
  console.log('a new client is connected!');
}


/**
 * utils funcs
 */

function getPort(addr){
  if (!addr) throw new Error('need to input addr!');

  return addr.split(':')[1];
};

function http_error(res, status_code, msg){
  res.writeHead(status_code, {'content-type': 'text/plain'});
  res.end(msg);
  return;
}