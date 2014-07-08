var webrouter = require('..');
var connect = require('connect');
var should = require('should');
var debug = require('debug')('webrouter:test');

describe('webrouter', function(){
  var router;
  
  beforeEach(function(){
    router = webrouter();

  });
  
  it('should call constructor', function(done){
    router.should.be.type('function');
    done();
  });

  xit('should inherts event emitter', function(done){
    
  });
  
});