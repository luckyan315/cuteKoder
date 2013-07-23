var EventEmitter = require('events').EventEmitter;
var jsDAV = require('jsDAV');
var jsDAV_Browser_Plugin = require("../node_modules/jsDAV/lib/DAV/plugins/browser");

exports = module.exports = WebIde = function(server){
  EventEmitter.call(this);
  this.httpServer = server;

  var davOptions = {
    node: __dirname + '/../assets',
    mount: 'workspace',
    server: this.httpServer,
    plugins: [jsDAV_Browser_Plugin]
  };

  jsDAV.mount(davOptions);

  console.log('jsDAV server mount at: ' + davOptions.node);

};
