var pty = require('pty.js');
var term = pty.spawn('bash', [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.env.HOME,
  env: process.env
});

term.on('data', function(data){
  console.log(data);
});

term.write('ls\r');
term.resize(100, 40);
term.write('ls /\r');

console.log(term.process);


/*****************************************************************************************************************/
// var EventEmitter = require('events').EventEmitter;
// var util = require('util');

// function a(c, name){
//   var $id = 'a';
//   c.on('cmd', function(msg){
//     console.log( $id + ':' + msg );
//   });
// };

// function b(c, name){
//   this.name = 'b';
//   var _this = this;
//   c.on('cmd', function(msg){
//     console.log( name + ':' + msg );
//   });
// }

// function d(c, name){
//   this.name = 'd';
//   var _this = this;
//   c.on('cmd', function(msg){
//     console.log( name + ':' + msg );
//   });
// }

// function ide(){
  
// }

// util.inherits(ide, EventEmitter);

// var oIde = new ide();
// a(oIde, 'a');
// b(oIde, 'b');
// d(oIde, 'd');

// oIde.emit('cmd', 'This msg emitted by oIde !!!!');
