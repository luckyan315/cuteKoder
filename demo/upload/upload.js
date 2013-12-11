
/**
 * file upload/downlaod demo app
 */

var http = require('http');
var formidable = require('formidable');
var util = require('util');

var logger = require('./logger.js');

var PORT = 3001;

var server = http.createServer(function(req, res, next){

  var method = req.method;

  if (method === 'GET') {
    show(req, res, next);
  } else if (method === 'POST'){
    upload(req, res, next);
  }
  
});

function show(req, res, next){
  //TODO: render page
  var content =
    '<form method="post" id="" action="/upload" enctype="multipart/form-data">' + 
    '<p><input type="text" name="text" value="" /></p>' + 
    '<p><input type="file" name="file" value="" /></p>' +
    '<p><input type="submit" name="submit" value="upload" /></p>' +
    '</form>';
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(content));
  res.end(content);
}

function upload(req, res, next){
  //TODO: upload

  var form = new formidable.IncomingForm();

  form.uploadDir = './uploadDir';

  // form.parse(req, function(err, fields, files) {
  //   // TODO:
  //   if (err) {
  //     logger.error(err);
  //     res.writeHead(500, 'content-type', 'text/plain');
  //     return res.end('upload file occur error!:' +  err.toString());
  //   }

  //   res.writeHead(200, {'content-type': 'text/plain'});
  //   res.write('received upload:\n\n');
  //   res.end(util.inspect({fields: fields, files: files}));
  // });

  form.on('progress', function(byteReceived, bytesExprected){
    console.log('[progress]' + Math.floor((byteReceived / bytesExprected) * 100));
  });

  form.on('field', function(name , value){
    logger.info('[field]...');
    logger.log(util.inspect({name: name, value: value}));
  });

  form.on('file', function(name, file){
    logger.info('[file]...');
    logger.log(util.inspect({name: name, file: file}));
  });

  form.on('error', function(err){
    logger.error('[upload] ', err);
  });

  form.on('end', function(){
    logger.log('files upload complete!');
    return res.end('upload file success!');
  });
  
  form.parse(req);
  
  return;
}

server.listen(PORT, function(){
  logger.info('server listening at '+ PORT +' port...');
});