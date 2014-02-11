var net = require('net');

var LOCAL_PORT = 8888;
var REMOTE_PORT = 9999;
var REMOTE_ADDR = '127.0.0.1';

var server = net.createServer(function(client){
  client.on('end', function(){
    console.log('disconnected!');
  });

  // console.log(client);

  client.on('data', function(data){
    //remote socket
    console.log('[local -> proxy]:' + data.toString());

    var rsock =  new net.Socket();
    rsock.connect(parseInt(REMOTE_PORT, 10), REMOTE_ADDR, function(){
      console.log('[proxy -> remote]:' + data.toString());
      rsock.write(data);
    });

    rsock.on('data', function(data){
      console.log('[remote -> proxy]:' + data.toString());
      client.write(data);
    });

    rsock.on('end', function(){
      console.log('Remote Server disconnected!');
    });

  });
});

server.listen(LOCAL_PORT, function(){
  console.log('net server is listening on ' + LOCAL_PORT);
});
