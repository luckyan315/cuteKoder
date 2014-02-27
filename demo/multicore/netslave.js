process.on('message', function(message, handle){
  if(message === 'server'){
    var server = handle;
    
    server.on('connection', function(socket){
      socket.write('[slave] ' + process.pid);
    });    
  }

});