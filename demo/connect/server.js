var connect = require('connect');
var app = connect();
var fs = require('fs');
var log = fs.createWriteStream(
  '/home/luckyan315/code/github/cuteKoder/demo/connect/app.log',
  {flags:'w', encoding:null, mode:666});

var html = undefined;
fs.readFile('client.html', function(err, data){
  if( err ){
    throw err;
  }
  html = data;
});

app.use(connect.logger('dev'));
// app.use(connect.logger({format:'dev', stream: log}));
app.use(connect.cookieParser('angl'));
app.use(connect.session());
app.use(connect.bodyParser());
app.use(connect.query());
app.use(sessionback);
// app.use(roleback);
// app.use(update);
// app.use(logger);
// app.use(hello);
app.listen(3000);


function sessionback(req, res, next){
 var ses = req.session;
  console.log(ses);
  if( ses.views ){
    res.setHeader('content-type', 'text/html');
    res.write('<p> views:' + ses.views + '</p>');
    res.write('<p>expires in: ' + (ses.cookie.maxAge/1000) + 's</p>');
    res.write('<p>httpOnly: ' + ses.cookie.httpOnly + '</p>');
    res.write('<p>path: ' + ses.cookie.path + '</p>');
    res.write('<p>domain: ' + ses.cookie.domain + '</p>');
    res.write('<p>secure: ' + ses.cookie.secure + '</p>');

    res.end();
    ses.views++;
  } else {
    ses.views = 1;
    res.end('hello session!');
  }

}

function logger(req, res, next){
  console.log(req.query);
  // console.log(JSON.stringify(req.query));
  // console.log(req.cookies);
  // console.log(req.signedCookies);
  next();
}

function hello(req, res, next){
  res.setHeader('content-type', 'text/plain');
  res.end('hello world!\n');
}

function roleback(req, res, next){
  console.log('roleback' + req.method);
  if( req.method != 'GET' ){
    next();
  }
  res.setHeader('content-type', 'text/html');
  res.write(html);
  res.end();
}

function update(req, res, next){
  console.log('update');
  if( req.method != 'PUT' ){
    next();
  }
  res.end('Updated user name :' + req.body.user.name);
}
