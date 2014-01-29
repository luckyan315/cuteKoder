//dependant module
var app = require('../../app.js').app;
var request = require('supertest');
var should = require('should');
var isDebugMode = require('../../config').debug;

//consts
var PORT = 8888;
var HOST_ADDR = 'http://127.0.0.1:' + PORT;

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

  after(function(){
    //delete resources 
    request(app).get('/delall').expect(200);
  });
  
  describe('Routes', function(){
    
    /**
     * Home Suite
     */

    describe('Home', function(){
      it('should GET "/" status 200', function(done){
        request(app)
          .get('/')
          .expect(200, done);
      });

      it('should GET "/index" status 200', function(done){
        request(app)
          .get('/index')
          .expect(200, done);
      });

      it('should GET "/index.html" status 200', function(done){
        request(app)
          .get('/index.html')
          .expect(200, done);
      });

      it('should GET "/idx" invalid req ', function(done){
        request(app)
        .get('/idx')
        .expect(400, done);
      });
    });

    
    /**
     * User Suite
     */

    describe('User', function(){
      //users info
      var user1 = {
        name: 'unittest1',
        password: '123456',
        secquestion: 'unittest',
        secanswer: 'unittest'
      };

      describe('sign up', function(){

        it('should get signup page', function(done){
          request(app)
          .get('/reg')
          .expect(200, done);
        });
        
        it('should create a user', function(done){
          request(app)
          .post('/reg')
          .send(user1)
          .expect(200)
          .end(done);
        });

        it('should occur error as create twice', function(done){
          request(app)
          .post('/reg')
          .send(user1)
          .expect(200) // 200 ?
          .end(done);          
        });

      });

      describe('sign in', function(){
        it('should get ok', function(done){
          request(app)
          .get('/index') /* sign in via home page */
          .expect(200, done);
        });
        
        it('should post ok', function(done){
          request(app)
          .post('/login')
          .send({name: user1.name, password: user1.password})
          .expect(200)
          .end(done);
        });
      });

      describe('assume login succeed, valid username', function(){

        describe('dashboard', function(){
          it('should get ok', function(done){
            request(app)
              .get('/dash')
              .query({username: user1.name}) /* query info just for unit test */
              .expect(200, done);
          });
        });

      });

    });

    //ipsetting need to connect emu, so only available in release mode
    !isDebugMode && describe('Ip', function(){
      
    });

    describe('Project', function(){
      
    });

    describe('sign out', function(){
      
    });

    describe('404 Page ', function(){
      
    });

  });
});
