var https = require('https');
var fs = require('fs');

var PORT = 8888;

var options = {
  key: fs.readFileSync('../keys/server.key'),
  cert: fs.readFileSync('../keys/server.crt')
};

https.createServer(options, function(req, res){
  res.writeHead(200);
  res.end('hello world!\n');
}).listen(PORT, function(){
  console.log('https server is listening on ' + PORT);
});
