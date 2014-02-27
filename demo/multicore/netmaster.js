var PORT = 8888;

var server = require('net').createServer(function(socket){
  socket.write('[master] ' + process.pid);
});

var fork = require('child_process').fork;
var slave1 = fork('./netslave.js');
var slave2 = fork('./netslave.js');

server.listen(PORT, function(){
  console.log('TCP Master server is listening on ' + PORT);

  // package message with a handle object
  slave1.send('server', server);
  slave2.send('server', server);
  server.close();
});
