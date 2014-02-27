var http = require('http');
var port = parseInt((1 + Math.random()) * 1000, 10);

var server = http.createServer(function(req, res){
  res.setHeader('content-type', 'text/html');
  res.writeHead(200);
  res.end('hell world\n');
});

server.listen(port, function(){
  process.send({port: port});
});