var fork = require('child_process').fork;
var cpus = require('os').cpus();
var child = void 0;

for(var i = 0; i < cpus.length; ++i) {
  child = fork('./slaver.js');
  // child.send('slaver ' + parseInt(i+1, 10) + ' is created!');
  var index = 1;
  child.on('message', function(data){
    console.log('slaver [' + index++ +'] is listening on '+ data.port);
  });    
}
