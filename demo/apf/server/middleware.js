
/**
 * middleware 
 */

exports.ideProvider = function(){
  console.log('[middleware] ideProvider accessed! ');

  var socketIo = require('socket.io');
  var WebIde = require('./webide');
  var httpServer = module.parent.exports.server;

  /* pseudo terminal   process.env.SHELL */
  this.$pty = pty.fork('bash', [], {
    name: 'xterm',
    cols: 80,
    rows: 24,
    cwd: process.env.HOME
  });

  var io = socketIo.listen(httpServer);
  io.sockets.on("connection", function(client) {
    console.log('socket.io connected!');
  });

  var ide = new WebIde(httpServer);

  return function(req, res, next){
    ide.handle(req, res, next);
  };  
};
