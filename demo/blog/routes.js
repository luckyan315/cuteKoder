
/*
 * GET home page.
 */

var user = require('./user');
var crypto = require('crypto');
var User = require('./model/user');

exports = module.exports = handleRoutes;

function handleRoutes(app){
  app.get('/', index);
  app.get('/users', user.list);
  app.get('/reg', getReg);
  app.post('/reg', postReg);
  app.get('/login', getLogin);
  app.post('/login', postLogin);
  
};

function index(req, res){
  res.render('index', { title: 'Blog' });
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

  newUser.get(newUser.name, function(err, user){
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
 console.log('postLogin accessed!'); 
};

