var add = require('./build/Release/funcargs.node').add;

var a = 1;
var b = 2;

console.log(a + ' + ' + b + ' = ' + add(a, b));
