var fs = require('fs');

exports.walk = function(path, cb, over){
  var nLeft = 1;
  go(path, cb);
  if( !nLeft ){
    over();
  }

  
  function go(path, cb){
    fs.readdir(path, function(err, files){
      nLeft--;
      if( err ) return cb(err);

      for(var file in files){
        (function(){
          if(files[file][0] != '.'){
            nLeft++;
            var fullPath = path + '/' + files[file];
            fs.stat(fullPath, function(err, stats){
              if( err ) {
                nLeft--;
                return cb(err);
              }
              if( stats.isDirectory(fullPath) ){
                cb(null, fullPath);
                go(fullPath, cb);
              } else {
                nLeft--;
                cb(null, fullPath);
                if( !nLeft ){
                  over();
                }

              }
            });
          }
        })();
      }
    });
  }
};

