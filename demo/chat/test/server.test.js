
var should = require('should');
var request = require('supertest');
var http = require('http');
var debug = require('debug')('Chat:ServerTest');

var app = require('../server.js');
var config = require('../config');
var port = config.test.port;

describe('Chat Server', function(){
  before(function(done){
    app.listen(port, function(err, result){
      if (err) debug(err);
      done(err);
    });
  });
  
  it('should got 200 status code when visit get /', function(done){
    request(app)
      .get('/')
      .expect(200, done);
  });

  it('should work as a static server', function(done){
    request(app)
      .get('/index.html')
      .expect(200, done);
  });

});