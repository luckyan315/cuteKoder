
/*
 * GET home page.
 */

var APF_PATH = './public/support/apf/';
var VIEWS_PATH = './views/';

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.apf = function(req, res){
  res.sendfile(VIEWS_PATH + 'index.html');
};
