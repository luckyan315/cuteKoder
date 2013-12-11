var http = require('http');

var server = http.createServer(function(req, res){
  if( req.url !== '/favicon' ){
    res.setHeader('Content-Type', 'text/html');

    setTimeout(function(){
    res.end('Connection End!\n');
    }, 5000);

    res.write('hello world\n');
    req.on('data', function(err, data){
      console.log(JSON.stringify(data));
    });
  }

});

server.listen(3000);