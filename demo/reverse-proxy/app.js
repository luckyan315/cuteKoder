var ReverseProxy = require('./reverse_proxy');

var PORT = 3000;

var proxy = new ReverseProxy({target: 'localhost:8888'});

proxy.createServer();
proxy.listen(3000, function(){
  console.log('Proxy Server is listening on ' + PORT);
});
