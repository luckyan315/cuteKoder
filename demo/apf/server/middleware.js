
/**
 * middleware 
 */

exports.ideProvider = function(){
  console.log('[middleware] ideProvider accessed! ');

  var socketIo = require('socket.io');
  var WebIde = require('./webide');
  var httpServer = module.parent.exports.server;

  var io = socketIo.listen(httpServer);
  io.sockets.on("connection", function(client) {
    console.log('socket.io connected!');
  });

  var ide = new WebIde(httpServer);

  return function(req, res, next){
    next();
  };  
};
