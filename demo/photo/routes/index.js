
/*
 * GET home page.
 */
var photos = [{name: 'Node.js Logo', path: 'http://nodejs.org/images/logos/nodejs-green.png'},
             {name: 'Ryan Speaking', path: 'http://nodejs.org/images/ryan-speaker.jpg'}];

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.list = function(req, res){
  res.render('photos', { title: 'Express',
                       photos: photos});
};