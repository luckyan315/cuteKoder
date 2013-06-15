var A = function(name){
  this.name = name;
  return {
    get: function(){
      console.log('new get');
    }
  };
}();

// A.prototype = {
//   get : function(){
//     console.log('get');
//   }
// };


A.get();