var http = require('http');
var port = 3000;

http.createServer(function(req, res){
  res.writeHead(200);
  res.end('hello world!\n');
}).listen(port, function(){
  process.send('worker: ' + process.pid + ' is listening port on ' + port);
});