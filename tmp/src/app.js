
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path');

var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// app.use(express.cookieParser());
// app.use(express.session({
//   secret: settings.cookieSecret,
//   store: new MongoStore({
//     db: settings.db
//   })
// }));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', routes.index);
app.get('/u/:user', routes.user);
app.post('/post', routes.post);
app.get('/reg', routes.reg);
app.post('/reg', routes.doReg);
app.get('/login', routes.login);
app.post('/login', routes.doLogin);
app.get('/project', routes.project);
app.post('/loadfile', routes.loadfile);
app.get('/logout', routes.logout);
app.get('/users', user.list);

var httpServer = http.createServer(app);


//configure socket.io server
var io = require('socket.io').listen(httpServer);
var project = require('./project');
io.sockets.on('connection', function(socket){

  //current workding directory
  var cwd = process.cwd();
  
  socket.on('sdk-init', function(data){
    // console.log(data);
    var fullPath = cwd + data['path'];
    project.loadfile(fullPath).on('success', function(data){
      socket.emit('loadfile', data);
    });

    project.loadfile(fullPath).on('fail', function(data){
      console.error(data);
    });
  });
});

httpServer.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

