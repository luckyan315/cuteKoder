// cluster sample code
var cluster = require('cluster');
var http = require('http');
var nCpus = require('os').cpus().length;

var port = 3000;

if(cluster.isMaster) {
  for(var i = 0; i < nCpus; ++i) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal){
    console.log('worker ' + worker.process.pid + ' died');
  });
} else {
  http.createServer(function(req, res){
    res.writeHead(200);
    res.end("hello world\n");
  }).listen(port, function(){
    console.log('cluster worker: ' + cluster.worker.id + ' listening port on ' + port);
  });;
}
