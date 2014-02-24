var ReverseProxy = require('./reverse_proxy');

var proxy = new ReverseProxy({target: 'localhost:8888'});

proxy.createServer();
proxy.listen();
