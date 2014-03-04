var factory = require('./build/Release/factory.node');

var myfunc = factory.createFunc();
var myObj = factory.createObject('name', 'angl');

console.log(myfunc());
console.log(myObj);
