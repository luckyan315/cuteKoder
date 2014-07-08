var common = require('../common');
var should = require('should');
var debug = require('debug')('test:webrouter');

describe('common funcs', function(){
  it('should merge b to a', function(done){
    var a = {name: 'angl', age: 27};
    var b = {sex: 'm', hobby: 'fuk'};

    var c = common.merge(a, b);
    c.name.should.eql('angl');
    c.sex.should.eql('m');
    done();
  });
});

