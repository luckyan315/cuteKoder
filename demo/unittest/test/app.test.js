//dependant module
require('should');

var app = require('../../app.js').app;
var request = require('supertest');
var isDebugMode = require('../../config').debug;
var logger = require('../util/log.js');

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
        .expect(404, done);
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
          //need to sign up db and system , maybe take some time...
          this.timeout(15000);
        
          request(app)
          .post('/reg')
          .send(user1)
          .expect(200)
          .end(function(err, res){
              var body = res.res.text;
              body.should.have.containEql('success_text');
              done();            
          });
        });

        it('should not create a user , if username is not alphanumeric', function(done){
          request(app)
            .post('/reg')
            .send({
              name: '_123abc3',
              password: '123456',
              secquestion: 'unittest',
              secanswer: 'unittest'
            })
            .expect(200)
            .end(function(err, res){
              var body = res.res.text;
              body.should.have.containEql('err_msg');
              done();
            });
        });

        it('should not create a user , if username.length is too much', function(done){
          request(app)
            .post('/reg')
            .send({
              name: '123abc332165465465465465464',
              password: '123456',
              secquestion: 'unittest',
              secanswer: 'unittest'
            })
            .expect(200)
            .end(function(err, res){
              var body = res.res.text;
              body.should.have.containEql('err_msg');
              done();
            });
        });

        it('should not create a user , if username is empty', function(done){
          request(app)
            .post('/reg')
            .send({
              name: '',
              password: '123456',
              secquestion: 'unittest',
              secanswer: 'unittest'
            })
            .expect(200)
            .end(function(err, res){
              var body = res.res.text;
              body.should.have.containEql('err_msg');
              done();
            });
        });


        it('should not create a user , password is empty', function(done){
          request(app)
            .post('/reg')
            .send({
              name: 'asdf123',
              password: '',
              secquestion: 'unittest',
              secanswer: 'unittest'
            })
            .expect(200)
            .end(function(err, res){
              var body = res.res.text;
              body.should.have.containEql('err_msg');
              done();
            });
        });
        
        
        it('should occur error as create twice', function(done){
          request(app)
          .post('/reg')
          .send(user1)
          .expect(200)
          .end(function(err, res){
            if (err) return done(err);

            var body = res.res.text;
            body.should.have.containEql('err_msg');
            done();            
          });
        });

      });

      describe('sign in', function(){
        it('should get ok', function(done){
          request(app)
          .get('/index') /* sign in via home page */
          .expect(200, done);
        });
        
        it('should redirect to /dash if valid input', function(done){
          request(app)
          .post('/login')
          .send({name: user1.name, password: user1.password})
          .expect(302)
          .end(function(err, res){
            if (err) return done(err);

            var location = res.res.headers.location;
            location.should.include('/dash');
            done();
          });
        });

        it('should redirect to home page, if invalid username ', function(done){
          request(app)
          .post('/login')
          .send({name: 'asdf1!@#234', password: 'asdf1234'})
          .expect(302)
          .end(function(err, res){
            if (err) return done(err);

            var location = res.res.headers.location;
            location.should.include('/');
            done();
          });
        });

        it('should redirect to home page, if invalid password ', function(done){
          request(app)
            .post('/login')
            .send({name: user1.name, password: 'asdf1234'})
            .expect(302)
            .end(function(err, res){
              if (err) return done(err);

              var location = res.res.headers.location;
              location.should.include('/');
              done();
            });
        });

      });

      describe('login ok', function(){

        describe('dashboard', function(){
          it('should get ok', function(done){
            request(app)
              .get('/dash')
              .query({username: user1.name}) /* query info just for unit test */
              .expect(200)
              .end(done);
          });
        });

      });

    });

    //ipsetting need to connect emu, so only available in release mode
    !isDebugMode && describe('Ip', function(){
      //TODO: need production mode 
    });

    describe('Project', function(){
      var user1 = {
        name: 'unittest1',
        password: '123456',
        secquestion: 'unittest',
        secanswer: 'unittest'
      };

      it('should not create project , if not logged in', function(done){
        request(app)
        .post('/api/ut_basic_project/create?type=basic')
        .send()
        .expect(401)
        .end(function(err, res){
          done();
        });        
      });

      
      it('should create a web app framework 2.0 project', function(done){
        request(app)
        .post('/api/ut_basic_project/create?type=basic&&username=' + user1.name)
        .send()
        .expect(200)
        .end(function(err, res){
          done();
        });
      });

      it('should create a javascript project', function(done){
        request(app)
        .post('/api/ut_js_project/create?type=javascript&&username=' + user1.name)
        .send()
        .expect(200)
        .end(function(err, res){
          done();
        });
      });

      it('should create a PNaCL project', function(done){
        //need to copy many files as create project..., took some time
        this.timeout(15000);

        request(app)
        .post('/api/ut_pnacl_project/create?type=pnacl&&username=' + user1.name)
        .send()
        .expect(200)
        .end(function(err, res){
          done();
        });
      });
      
      it('should occur error , as input invalid project_type', function(done){
        request(app)
        .post('/api/ut_invalid_project/create?type=xxxx&&username=' + user1.name)
        .send()
        .expect(405)
        .end(done);        
      });

      it('should not create the same project', function(done){
        request(app)
        .post('/api/ut_js_project/create?type=javascript&&username=' + user1.name)
        .send()
        .expect(500)
        .end(function(err, res){
          done();
        });        
      });

      it('should check project name available, The name already existed!', function(done){
        request(app)
        .post('/api/ut_js_project/check?username=' + user1.name)
        .send()
        .expect(500)
        .end(done);
      });

      it('should check project, vaild project name ', function(done){
        request(app)
        .post('/api/ut_new_js_project/check?username=' + user1.name)
        .send()
        .expect(200)
        .end(done);        
      });
      
      it('should remove the project', function(done){
        request(app)
        .post('/api/ut_js_project/remove?username=' + user1.name)
        .send()
        .expect(200)
        .end(done);
      });

      it('should remove one project twice ok, see detail [Fix: DF131221-00455]', function(done){
        request(app)
        .post('/api/ut_js_project/remove?username=' + user1.name)
        .send()
        .expect(200)
        .end(done);
      });

      
    });

    describe('404 Page ', function(){
      it('should get 404 Page', function(done){
        request(app)
        .get('/asdfasdf')
        .expect(404)
        .end(function(err, res){
          if (err) return done(err);
          var body = res.res.text;
          body.should.containEql('err_detail');
          done();
        });
      });
    });

    describe('Exit unit test', function(){
      //delete all cases for unittest
      describe('cleanup', function(){
        // it('should delete all users', function(done){
        //     request(app)
        //       .get('/delall')
        //       .expect(200)
        //       .end(done);         
        // });

        it('should sign out, redirect to home page', function(done){
          request(app)
            .get('/logout')
            .expect(302)
            .end(done);                   
        });

      });

    });
    
  });
});
