var addon = require('./build/Release/addon.node');

var o1 = addon.createObject(10);
var o2 = addon.createObject(20);

console.log(addon.add(o1, o2));