
/**
 * middleware 
 */

exports.ideProvider = function(){
  console.log('[middleware] ideProvider accessed! ');

  var socketIo = require('socket.io');
  var WebIde = require('./webide');
  var httpServer = module.parent.exports.server;
  var pty = require('pty.js');
  var socket = null;
  
  /* Pseudo terminal   process.env.SHELL */
  var term = pty.fork('bash', [], {
    name: 'xterm',
    cols: 80,
    rows: 24,
    cwd: process.env.HOME
  });
  term.on('data', function(data){
    if( socket ){
      socket.emit('data', data);
    }

  });
  
  
  var io = socketIo.listen(httpServer);
  
  io.sockets.on("connection", function(client) {
    console.log('socket.io connected!');

    socket = client;
    
    client.on('data', function(data){
      term.write(data);
    });

    client.on('disconnect', function(){
      socket = null;
    });
  });

  var ide = new WebIde(httpServer);

  return function(req, res, next){
    ide.handle(req, res, next);
  };  
};
