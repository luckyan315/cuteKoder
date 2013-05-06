var Emitter = require('events').EventEmitter;
var fs = require('fs');
var common = require('./common');
var rootEntry = undefined;

exports.loadfile = function(path){
  var emitter = new Emitter();

  fs.stat(path, function(err, stats) {
    if( err ){
      emitter.emit('fail', err);
    } else {
      if( stats.isDirectory() ){
        searchFiles(path);
      }else {
        emitter.emit('fail', 'It is not a valid dir path:' + path);
      }
    }
  });

  function searchFiles(filePath){

    var aFrag = filePath.split('/');
    rootEntry = {
      name: aFrag[aFrag.length-1],
      type: 'dir',
      path: filePath,
      children: {}      
    };
    
    common.walk(rootEntry['path'],
                function(err, pathWalk) {
                  if (err) return  console.error(err);

                  fs.stat(pathWalk, function(err, stats) {
                    if (err) return  console.warn(err)

                    if (stats.isFile()) {
                      fillEntries(pathWalk);
                    } else {
                      fillEntries(pathWalk + '/.');
                    }
                  })
                }, function(){
                  emitter.emit('success', rootEntry);
                });

        function fillEntries(pathEntry){
          var aFragments = pathEntry.substr(filePath.length + 1).split('/');
          var curEntry = rootEntry;
          
          for(var i=0; i<aFragments.length-1; i++){
            if( !curEntry.children[aFragments[i]] ){
              curEntry.children[aFragments[i]] = {
                name: aFragments[i],
                type: 'dir',
                path: curEntry.path + '/' + aFragments[i],
                children: {}
              };
            }

            curEntry = curEntry.children[aFragments[i]];
          }
          
          if( aFragments[i] != '.' ){
            curEntry.children[aFragments[i]] = {
              name: aFragments[i],
              type: 'file',
              path: curEntry.path + '/' + aFragments[i],
              children: {}
            }
          }
        };
  };
  return emitter;
};
