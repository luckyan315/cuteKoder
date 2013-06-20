
/*
 * GET home page.
 */

var user = require('./user');
var crypto = require('crypto');
var User = require('./model/user');
var Post = require('./model/post');

exports = module.exports = handleRoutes;

function handleRoutes(app){
  app.get('/', getIndex);
  app.get('/users', user.list);
  app.get('/reg', getReg);
  app.post('/reg', postReg);
  app.get('/login', getLogin);
  app.post('/login', postLogin);
  app.get('/logout', getLogout);
  app.get('/post', getBlog);
  app.post('/post', postBlog);
};

function getIndex(req, res){
  Post.get(null, function(err, posts){
    if( err ){
      posts = [];
    }
    res.render('index', {
      title: 'Blog',
      user: req.session.user,
      posts: posts,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });

};

function getReg(req, res){
  res.render('reg', {title: 'Blog'});
};

function postReg(req, res){
      var username = req.body.name;
  var pw = req.body.password;
  var pw_re = req.body['password-repeat'];
  var email = req.body.email;
  
  if( pw_re != pw ){
    req.flash('error', 'Password input twice is not the same!');
    return res.redirect('/reg');
  }

  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('hex');

  var newUser = new User({
    name: username,
    password: password,
    email: email
  });

  User.get(newUser.name, function(err, user){
    if( user ){
      err = 'User existed!';
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
    });

    req.session.user = newUser;
    req.flash('success', 'Registry Success!');
    res.redirect('/');
  });
};

function getLogin(req, res){
  res.render('login', {title: 'Blog'});
};

function postLogin(req, res){ 
  var md5 = crypto.createHash('md5');
  var pw = md5.update(req.body.password).digest('hex');

  User.get(req.body.name, function(err, user){
    if( err ){
      req.flash('error', 'User does not existed!');
      return res.redirect('/login');
    }

    if( user.password != pw ){
      req.flash('error', 'password error!');
      return res.redirect('/login');
    }

    req.session.user = user;
    req.flash('success', 'Login success!');
    res.redirect('/');
  });
};

function getLogout(req, res){
  req.session.user = null;
  req.flash('success', 'Logout Success!');
  res.redirect('/');
}

function getBlog(req, res){
  res.render('post', {title: 'Blog'});
}


function postBlog(req, res){
  var curUser = req.session.user;
  var post = new Post(curUser.name, req.body.title, req.body.post);
  post.save(function(err){
    if( err ){
      req.flash('error', err);
      return res.redirect('/');
    }

    req.flash('success', 'Post Success!');
    res.redirect('/');
  });
}