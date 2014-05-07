var async = require('async');

async.series({
  one: function(callback){
    setTimeout(function(){
      console.log('print 11111');
      callback(null, 1);
    }, 200);
  },
  two: function(callback){
    setTimeout(function(){
      console.log('print 222222');
      callback(null, 2); 
    }, 100);
  }
},function(err, result){
  console.log(result);
});
