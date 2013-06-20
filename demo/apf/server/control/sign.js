var User = require('../dao').User;
var md5 = require('../common').md5;

exports.getRegister = function(req, res){
  //TODO: render reg.ejs
};

exports.register = function(req, res, next){
  var name = req.body.name;
  var pw = req.body.password || "fake_pw_";
  var email = req.body.email || "fake_email@173.com_";
  // var pw_re = req.body.password_repeat;
  
  res.send("Receive msg :" + name +" " + pw + '\n');
  User.save(name, md5.encrypt(pw), email, function(err){
    if( err ){
      console.log('could not save the user!');
      next(err);
    } else {
      console.log('User:'+ name + ' Save success!');
    }
    
  });
};

exports.getLogin = function(req, res){
  //TODO: render login.ejs
};

exports.login = function(req, res){
  var name = req.body.name;
  var pw = req.body.password;
  if( !name || !pw ){
    return res.end('input name and password!');
  }

  User.getUserByName(name, function(err, user){
    if( err ){
      return next(err);
    }

    if( user.password !== md5.encrypt(pw) ){
      return res.end('The password inputed is wrong!\n');
    }

    req.session.user = user;
    res.end(user.name + ' login success!\n');
  });

};


exports.logout = function(req, res){
  console.log('logout()');
};
