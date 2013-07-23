var socketIO = require('socket.io');
var httpServer = module.parent.exports.server;

var io = socketIO = socketIO.listen(httpServer);

io.sockets.on('connection', function(socket){
  console.log('A client is connected!');
});