var crypto 	= require('crypto');
var User 	= require('../models/user.js');
var Project	= require('../models/project.js');

var USER = "wayland";

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

exports.project = function(req, res){ 
	// console.log('project!');
	
	var prjs = ["Facebook3","GoogleTalk","SocialTV2","Twitter3"];
	
	var data = Project.loadProject(USER,prjs);
	res.render('project', data );
};

exports.loadfile = function(req, res){ 
	// console.log('project!');
	Project.loadFile( USER, req.param("file"), function(data){
		res.send(data);
	});
};


exports.logout = function(req, res){
  console.log('logout!');
};

