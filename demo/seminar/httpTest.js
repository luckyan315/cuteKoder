var http = require('http');
var server = http.createServer(function(req, res){
  res.writeHeader(200, {'content-type': 'text/plain'});
  res.end('hello world!\n');
});

server.listen(3000);
console.log('Server is runnning !....');