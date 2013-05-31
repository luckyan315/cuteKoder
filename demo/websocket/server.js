var WsServer = require('websocket').server;
var http = require('http');
var clientHtml = require('fs').readFileSync('client.html');

var httpServer = http.createServer(function(req, res){
  console.log((new Date()) + 'Received req for' + req.url);
  res.writeHead(200, {'content-type' : 'text/html'});
  res.end(clientHtml);
}).listen(8080, function(){
  console.log((new Date()) + 'Server is listening on port 8080');
});

var webSocketServer = new WsServer({
  httpServer: httpServer
});

webSocketServer.on('request', function(req){
  req.origin = req.origin || '*';
  var websocket = req.accept(null, req.origin);

  websocket.on('message', function(msg){
    console.log('Recieved "' + msg.utf8Data + '" from' + req.origin);
    if( msg.utf8Data === 'hello' ){
      websocket.send('world');
    }
  });

  websocket.on('close', function(code, desc){
    console.log('Disconnect:' + code + '-' + desc);
  });
});