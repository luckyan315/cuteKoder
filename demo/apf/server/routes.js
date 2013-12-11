
var user = require('./user');
var sign = require('./control/sign');
var APF_PATH = './public/support/apf/';
var VIEWS_PATH = './views/';
var app = module.parent.exports.app;

/*show index page*/
app.get('/', getIndex);

/*register, login, logout*/
app.get('/reg', sign.getRegister);
app.post('/reg', sign.register);
app.get('/login', sign.getLogin);
app.post('/login', sign.login);
app.get('/logout', sign.logout);

app.get('/users', user.list);
app.get('/apf', getApf);
app.get('/dav', getWebdav);
app.get('/hello', getHello);
app.get('/term', getTerm);


function getIndex(req, res){
  res.render('index', { title: 'Express' });
}

function getApf(req, res){
  res.sendfile(VIEWS_PATH + 'index.html');
}

function getWebdav(req, res){
  res.sendfile(VIEWS_PATH + 'test_webdav.html');
}

function getHello(req, res){
  res.sendfile(VIEWS_PATH + 'helloworld.html');
}

function getTerm(req, res){
  res.sendfile(VIEWS_PATH + 'terminal/terminal.html');
}