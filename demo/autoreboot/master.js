var fork = require('child_process').fork;
var cpus = require('os').cpus();
var net = require('net');

var PORT = 8888;

var server = net.createServer();
server.listen(PORT);

var slaves = {};

function createServer() {
  var slave = fork('./slave.js');

  slave.send('server', server);
  slaves[slave.pid] = slave;

  slave.on('exit', function(){
    createServer();
  });

  console.log('Create a slave ' + slave.pid);
}

for(var i = 0; i < cpus.length; ++i) {
  createServer();
}

process.on('SIGTERM', function(){
  //kill child processes
  for(var pid in slaves){
    console.log('[Slave] ' + pid + ' is killed!');
    slaves[pid].kill();
  }

  //master quit
  process.exit(1);
});

process.on('uncaughtException', function(e){
  console.log('[uncaughtException] ' + e);
});
