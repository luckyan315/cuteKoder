var jsDAV = require('jsDAV');
var httpServer = module.parent.exports.server;
var jsDAV_Browser_Plugin = require("../node_modules/jsDAV/lib/DAV/plugins/browser");

jsDAV.debugMode = true;

var davOption = {
  node: __dirname + '/../assets',
  mount: 'workspace',
  server: httpServer,
  plugins: [jsDAV_Browser_Plugin]
};

jsDAV.mount(davOption);
console.log('jsDAV server mount at: ' + davOption.node);
