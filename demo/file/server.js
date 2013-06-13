var http = require('http');
var path = require('path');
var fs =  require('fs');

var cache = {};

var server = http.createServer(function(req, res){
  if( req.url === '/favicon.ico' ){
    res.end();
    return;
  }

  
  var lookup = path.basename(decodeURI(req.url));
  console.log(lookup);
  if(lookup){
    routingFile(lookup, function(err, data){
      if( err ){
        res.writeHead(404, {'content-Type': 'text/plain'});
        res.end(data);
        return;
      }

      res.writeHead(200, {'Content-Type': 'text/js'});
      res.end(data);
    });
    return;
  }
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('hello!');
});

function routingFile(basename, cb){
  if( !cache[basename] ){
    fs.readFile(basename, function(err, data){
      if( err ){
        return cb(err, 'Server can not read file:' + basename );
      }
      cache[basename] = data;
      cb(null, cache[basename]);
    });
    return;
  }
  console.log('Loading ' + basename + ' from cache!');
  cb(null, cache[basename]);
};



server.listen(8787);
console.log('Server is running!');
