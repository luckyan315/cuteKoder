var express = require('express');
var crypto = require('crypto');

var userStore = {};
var app = express();

app.use(express.bodyParser());

app.get('/', function(req, res){
  res.sendfile('regform.html');
});

app.post('/', function(req, res){
  if( req.body && req.body.user && req.body.passwd ){
    var hash = crypto.createHash('md5').update(req.body.passwd).digest('hex');
    userStore[req.body.user] = hash;
    res.send('Thanks for registering' + req.body.user);
    console.log(userStore);
  }

});

app.listen(3000);