var tls = require('tls');
var fs = require('fs');

var PORT = 8888;

var options = {
  key: fs.readFileSync('./keys/client.key'),
  cert: fs.readFileSync('./keys/client.crt'),
  ca: [fs.readFileSync('./keys/ca.crt')]
};

var stream = tls.connect(PORT, options, function(){
  console.log('client connected', stream.authorized ? 'authorized' : 'unauthorized');

  process.stdin.pipe(stream);
});

stream.setEncoding('utf8');

stream.on('data', function(data){
  console.log(data);
});

stream.on('end', function(){
  stream.close();
});