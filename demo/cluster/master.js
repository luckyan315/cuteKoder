// cluster sample code
var cluster = require('cluster');
var nCpus = require('os').cpus().length;

//config master
cluster.setupMaster({
  exec: './worker.js',
  args: ['--use', 'https'],
  silent: true
});


for(var i = 0; i < nCpus; ++i) {
  cluster.fork();
}

Object.keys(cluster.workers).forEach(function(id){
  cluster.workers[id].on('message', function(msg){
    console.log('worker: ' + id + ' recv msg: ' + msg);
  });
});

cluster.on('exit', function(worker, code, signal){
  console.log('worker ' + worker.process.pid + ' died');
});
