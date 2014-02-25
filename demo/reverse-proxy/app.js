var ReverseProxy = require('./reverse_proxy');
var logger = require('./logger.js');

var PORT = 3000;

var proxy = new ReverseProxy({target: 'http://localhost:8888'});

proxy.createServer();
proxy.listen(3000, function(){
  logger.log('Proxy Server is listening on ', PORT);
});
