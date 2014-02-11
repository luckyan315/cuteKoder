var net = require('net');

var LOCAL_PORT = 9999;

var server = net.createServer(function(socket){
  socket.on('data', function(msg){
    console.log('[Remote server recv]:', msg.toString());

    //inform client
    socket.write('Remote Server recv msg Success!');
  });

  socket.on('end', function(){
    console.log('Remote server disconnected!');
  });
});

server.listen(LOCAL_PORT, function(){
  console.log('Remote TCP server is listening on ' + LOCAL_PORT);
});