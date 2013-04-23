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
  res.render('reg', {title: 'Register'});

};

exports.doReg = function(req, res){
  console.log('doReg!');
};

exports.login = function(req, res){
  // console.log('login');
  res.render('login', {title: 'login'});
};

exports.doLogin = function(req, res){
  console.log('doLogin');
  res.render('ide', {title: 'ide'});
};

exports.logout = function(req, res){
  console.log('logout!');
};

