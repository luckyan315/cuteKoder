/**
 * Middlewares about dealing with Incoming Messages
 *
 * Copyright (C) 2014 guanglin.an (lucky315.an@gmail.com)
 * 
 */

"use strict";

var http = require('http');
var url = require('url');
var util = require('util');

var IncomingMiddlewares = exports = module.exports;

[
  function before(req, res, opt){
    console.log('[Before] middleware entered!' + opt.target);
    //TODO:
    
  },

  function proxy(req, res, opt, proxy){
    // console.log('[Proxy] middleware entered!');
    var options = mkRequestOptions(req, opt);
    
    var proxyReq = http.request(options);

    proxyReq.on('response', function(proxyRes){
      //TODO:

      proxyRes.pipe(res);
    });

    proxyReq.on('error', function(err){
      //TODO:
      proxy.emit('error', err);
    });

    proxyReq.end();
  }
].forEach(function(middleware){
  IncomingMiddlewares[middleware.name] = middleware;
});

function mkRequestOptions(req, opt){
  var options = {};
  var oURL = url.parse(opt['target']);
  // console.log('[oURL]', oURL);
  
  ['hostname', 'host', 'socketPath'].forEach(function(e){
    options[e] = oURL[e];
  });

  
  ['method', 'headers'].forEach(function(e){
    options[e] = req[e];
  });

  // console.log('[Proxy Options]', options);
  return options;
}