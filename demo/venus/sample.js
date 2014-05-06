/**
 * @venus-library mocha
 * Run via venus: venus run -t sample.js -e ghost
 */

 describe('First unit test using venus.js', function(){
  it('should run test available from command line', function(done){
    expect(2 + 2).to.be(4);
    done();
  });
 });