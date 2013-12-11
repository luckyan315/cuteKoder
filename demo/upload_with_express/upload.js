
/**
 * upload demo use express server
 */

var express = require('express');
var logger = require('../util/logger.js');

var app = express();

var PORT = 3001;

app.configure(function () {
    app.use(express.static(__dirname + "/media"));
    app.use(express.bodyParser({
          keepExtensions: true,
          limit: 10000000, // 10M limit
          defer: true              
    }));
})

app.get('/', function(req, res, next){
  //TODO: render upload page
  var content =
    '<form method="post" id="" action="/upload" enctype="multipart/form-data">' + 
    '<p><input type="text" name="text" value="" /></p>' + 
    '<p><input type="file" name="file" value="" /></p>' +
    '<p><input type="submit" name="submit" value="upload" /></p>' +
    '</form>';
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(content));
  res.end(content);
});

app.post('/upload', function (req, res) {
  req.form.on('progress', function(bytesReceived, bytesExpected) {
    console.log(((bytesReceived / bytesExpected)*100) + "% uploaded");
  });
  req.form.on('end', function() {
    console.log(req.files);
    res.send("well done");
  });
})

app.listen(3001, function(){
  logger.log('server listening at 3001 port...');
});