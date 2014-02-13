var path = require('path');
var url = require('url');
var fs = require('fs');
var optimist = require('optimist');
var argv = optimist.argv;
var source_addr = argv.s || '127.0.0.1:8888';
var target_addr = argv.t;
var source_addr_port = getPort(source_addr);
var target_addr_port = getPort(target_addr);
var static_path = path.join(__dirname, argv.p || './');

var http = require('http');
var ws = require('ws');
var WebSocketServer = ws.Server;

var server = http.createServer(handleRequest);

server.listen(source_addr_port, function(){
  console.log('Websocket2TCP Proxy listen on ' + source_addr_port);
});

function handleRequest(req, res, next){
  var filename = path.join(static_path, url.parse(req.url).pathname);
  fs.exists(filename, function(exists){
    if (!exists) {
      return http_error(res, 404, '404 Not Found');
    }
    
    
  });
};

function getPort(addr){
  if (!addr) throw new Error('need to input addr!');

  return addr.split(':')[1];
};

function http_error(res, status_code, msg){
  res.writeHead(status_code, {'content-type': 'text/plain'});
  res.end(msg);
  return;
}