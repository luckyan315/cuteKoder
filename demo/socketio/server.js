var http = require('http');
var clientHtml = require('fs').readFileSync('client.html');

var httpServer = http.createServer(function(req, res){
  res.writeHead(200, {'content-type': 'text/html'});
  res.end(clientHtml);
}).listen(8080);

var io = require('socket.io').listen(httpServer);

io.set('origins', ['localhost:8080', '127.0.0.1:8080']);

io.sockets.on('connection', function(socket){
  socket.on('message', function(msg){
    if( msg === 'hello' ){
      socket.send('It is socketio!!!!');
    }
  });
});