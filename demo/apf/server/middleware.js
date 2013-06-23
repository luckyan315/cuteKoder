var socketIo = require('socket.io');
var WebIde = require('./webide');
var httpServer = module.exports.server;

exports.ideProvider = function(){
  var ide = new WebIde();
  var io = socketIo.listen(httpServer);
  io.sockets.on("connection", function(client) {
    console.log('socket.io connected!');
  });
  
  return function(req, res, next){
    console.log('[middleware] ideProvider accessed! ');
    next();
  };  
};
