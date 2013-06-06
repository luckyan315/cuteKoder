var connect = require('connect');
var app = connect();
var fs = require('fs');
var log = fs.createWriteStream(
  '/home/luckyan315/code/github/cuteKoder/demo/connect/app.log',
  {flags:'w', encoding:null, mode:666});

app.use(connect.logger({format:'dev', stream: log}));
app.use(connect.cookieParser('angl'));
app.use(connect.bodyParser());
app.use(connect.query());
app.use(logger);
app.use(hello);
app.listen(3000);

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
