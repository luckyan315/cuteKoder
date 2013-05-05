var fs = require('fs');

exports.walk = function(path, cb){
  function go(path, cb){
    fs.readdir(path, function(err, files){
      if( err ) return cb(err);

      for(var file in files){
        (function(){
          if(files[file][0] != '.'){
            var fullPath = path + '/' + files[file];
            fs.stat(fullPath, function(err, stats){
              if( err ) return cb(err);
              if( stats.isDirectory(fullPath) ){
                cb(null, fullPath);
                go(fullPath, cb);
              } else {
                cb(null, fullPath);
              }
            });
          }
        })();
      }
    });
  }
  go(path, cb);
};

