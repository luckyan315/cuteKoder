/**
 * a proxy server for pipe websocket to tcp
 * Copyright (C) 2014 guanglin.an (lucky315.an@gmail.com)
 * 
 */

"use strict";

var path = require('path');
var url = require('url');
var fs = require('fs');
var net = require('net');
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
  log('Websocket2TCP Proxy listen on ' + source_addr_port);

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
  log('a new client is connected!');

  var remote = net.createConnection(target_addr_port, target_addr, function(){
    log('Remote TCP Server is connected!');
  });

  remote.on('data', function(data){
    log('[Remote --> Proxy] ' + data);
    if (client.protocol === 'base64') {
      client.send(new Buffer(data).toString('base64'));
    } else {
      client.send(data, {binary : true});
    }
    
  });
  
  remote.on('end', function(){
    log('Remote TCP Server disconnected!');
  });
  
  client.on('message', function(msg){
    //TODO:
    log('[Client --> Proxy] ' + msg);
    
  });

  client.on('close', function(){
    //TODO:
    
    remote.end();
  });
}


/**
 * utils funcs
 */

function log(msg){
  return process.env.NODE_ENV === 'production'
    ? null : console.log('\x1b[32m[debug] \x1b[m ' + msg);
}

function getPort(addr){
  if (!addr) throw new Error('need to input addr!');

  return addr.split(':')[1];
};

function http_error(res, status_code, msg){
  res.writeHead(status_code, {'content-type': 'text/plain'});
  res.end(msg);
  return;
}


