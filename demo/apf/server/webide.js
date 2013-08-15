var EventEmitter = require('events').EventEmitter;
var jsDAV = require('jsDAV');
var jsDAV_Browser_Plugin = require("../node_modules/jsDAV/lib/DAV/plugins/browser");
var vfs = require('./vfs')({root: '/'});;
var jsDAV_Tree_Filesystem = require("./fs/tree").jsDAV_Tree_Filesystem;
var Url = require('url');
var util = require('util');

exports = module.exports = WebIde = function(server){
  EventEmitter.call(this);
  this.httpServer = server;

  var davOptions = {
    node: __dirname + '/../assets',
    mount: '/workspace',
    server: this.httpServer,
    plugins: [jsDAV_Browser_Plugin],
    standalone: false
  };

  jsDAV.debugMode = true;
  davOptions.tree = new jsDAV_Tree_Filesystem(vfs, davOptions.node);
  
  this.davServer = jsDAV.mount(davOptions);

  console.log('jsDAV server mount at: ' + davOptions.node);

};

util.inherits(WebIde, EventEmitter);

(function () {
  //public
  this.handle = function(req, res, next){
    console.log('ide handle accessed!');

    var path = Url.parse(req.url).pathname;
    var workspaceReg =  new RegExp('^/workspace');

    if( path.match(workspaceReg) ){
      this.davServer.exec(req, res);
    } else {
      next();
    }
  };

  
}).call(WebIde.prototype);