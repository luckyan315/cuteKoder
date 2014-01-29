//dependant module
var app = require('../../app.js').app;
var request = require('supertest');
var should = require('should');
var isDebugMode = require('../../config').debug;

//consts
var PORT = 8888;
var IP = 'http://127.0.0.1:' + PORT;

describe('BrowserIDE', function(){
  before(function(done){
    app.listen(PORT, function(err, result){
      if(err){
        done(err);
      } else {
        done();
      }
    });
  });

  describe('valid GET', function(){
    it('visit / should return status 200', function(done){
      request(app)
        .get('/')
        .expect(200, done);
    });

    it('visit /index should return status 200', function(done){
      request(app)
        .get('/index')
        .expect(200, done);
    });

    it('visit /index.html should return status 200', function(done){
      request(app)
        .get('/index.html')
        .expect(200, done);
    });

    //ipsetting need to connect emu, so only available in release mode
    !isDebugMode && it('visit /ipsetting should return status 200', function(done){
      request(app)
        .get('/ipsetting')
        .expect(200, done);
    });

    it('visit /findpwd should return status 200', function(done){
      request(app)
        .get('/findpwd')
        .expect(200, done);
    });
  });

  describe('invalid GET ', function(){
    it('visit /dash without session should return status 302', function(done){
      request(app)
        .get('/dash')
        .expect(302, done);
    });

    it('visit /dashboard should return status 400', function(done){
      request(app)
        .get('/dashboard')
        .expect(400, done);
    });

    it('visit /home should return status 400', function(done){
      request(app)
        .get('/home')
        .expect(400, done);
    });
    
  });


});
