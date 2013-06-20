
/**
 * instance of user DAO mgr
 */

var model = require('../model');
var User = model.User;

exports.getUserByName = function(name, cb){
  User.findOne({'name': name}, cb);
};

exports.save = function (name, pass, email, cb) {
  var user = new User();
  user.name = name;
  user.password = pass;
  user.email = email;
  user.save(cb);
};
