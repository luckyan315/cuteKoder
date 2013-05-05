var Emitter = require('events').EventEmitter;
var fs = require('fs');
var common = require('./common');

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

  function searchFiles(filePath){
    var rootEntry = {
      name: '',
      type: 'dir',
      path: filePath,
      children: {}      
    };

    common.walk(rootEntry[path], function(err, path) {
      if (err) return  console.error(err);

      fs.stat(path, function(err, stats) {
        if (err) return  console.warn(err)

        if (stats.isFile()) {
          
        } else {
          
        }
      })
    })

    return files;
  };
  return emitter;
};


