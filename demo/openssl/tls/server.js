var tls = require('tls');
var fs = require('fs');

var PORT = 8888;

var options = {
  key: fs.readFileSync('./keys/server.key'),
  cert: fs.readFileSync('./keys/server.crt'),
  requestCert: true,
  ca: [fs.readFileSync('./keys/ca.crt')]
};

var server = tls.createServer(options, function(stream){
  console.log('server connected ', stream.authorized ? 'authorized' : 'unauthorized');

  stream.write('welcome!\n');
  stream.setEncoding('utf8');
  stream.pipe(stream);
});

server.listen(PORT, function(){
  console.log('TLS Server is listening on ' + PORT);
});