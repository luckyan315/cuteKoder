var MyObject = require('./build/Release/addon.node').MyObject;

var obj = new MyObject(10);

console.log(obj.plusOne());
console.log(obj.plusOne());
console.log(obj.plusOne());
console.log(obj.plusOne());
