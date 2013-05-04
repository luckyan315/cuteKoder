var Emitter = require('events').EventEmitter;
var fs = require('fs');

exports.loadfile = function(path){
  var emitter = new Emitter();

  fs.stat(path, function(err, stats) {
    if( err ){
      emitter.emit('fail', err);
    } else {
      if( stats.isDirectory() ){
        var files = searchFiles(path);
        emitter.emit('success', files);
      }else {
        emitter.emit('fail', 'It is not a valid dir path:' + path);
      }
    }
  });

  return emitter;
};

function searchFiles(path){
      var files = {};

  return files;
};
