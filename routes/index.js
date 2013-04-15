
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {title: 'Home'});
};

exports.user = function(req, res){
  console.log('user!');
};

exports.post = function(req, res){
  console.log('post!');

};

exports.reg = function(req, res){ 
  console.log('reg!');
};

exports.doReg = function(req, res){
  console.log('doReg!');
};

exports.login = function(req, res){
  console.log('login');
};

exports.doLogin = function(req, res){
  console.log('doLogin');
};

exports.logout = function(req, res){
  console.log('logout!');
};






