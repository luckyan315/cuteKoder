var net = require('net');

var server = net.createServer(function(socket){
  socket.write('Hello , this is TCP\n');
  socket.end();
  socket.on('data', function(data){
    console.log(data);
  });
}).listen(3000);

