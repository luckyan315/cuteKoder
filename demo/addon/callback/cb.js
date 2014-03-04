var callback = require('./build/Release/callback.node');

callback(function(msg){
  console.log(arguments);
});