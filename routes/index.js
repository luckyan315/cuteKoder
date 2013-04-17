var crypto = require('crypto');
var User = require('../models/user.js');
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
  // console.log('reg!');
  res.render('reg', {title: 'Home'});

};

exports.doReg = function(req, res){
  // console.log('doReg!');
  var md5 = crypto.createHash('md5');
  var pw = md5.update(req.body.password).digest('base64');

  var newUser = new User({
    name: req.body.username,
    password: pw
  });

  User.get(newUser.name, function(err, user){
    if( user ){
      err = 'User already exists';
    }

    if( err ){
      req.flash('error', err);
      return res.redirect('/reg');
    }

    newUser.save(function(err){
      if( err ){
        req.flash('error', err);
        return res.redirect('/reg');
      }
      req.session.user = newUser;
      req.flash('success', 'Login Success!');
      res.redirect('/');
    });
  });
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






