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

var out_mids = require('./out_mids');
var logger = require('./logger.js');

var IncomingMiddlewares = exports = module.exports;

[
  function beforeRequest(req, res, opt){
    logger.debug('[in][BeforeRequest] middleware entered!' + opt.target);
    //TODO:
    
  },

  function wrapRequest(req, res, opt, proxy){
    logger.debug('[in][WrapRequest] middleware entered!');

    var arrOutMids = Object.keys(out_mids).map(function(func_name){
      return out_mids[func_name];
    });

    var options = mkRequestOptions(req, opt);
    var proxyReq = http.request(options);

    proxyReq.on('response', function(proxyRes){
      //TODO:
      
      arrOutMids.forEach(function(func){
        func.call(null, proxyRes);
      });
      
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
  var oURL = url.parse(opt.target);
  logger.debug('[oURL]', oURL);
  
  ['hostname', 'host', 'socketPath', 'port'].forEach(function(e){
    options[e] = oURL[e];
  });

  
  ['method', 'headers'].forEach(function(e){
    options[e] = req[e];
  });

  options.path = url.parse(req.url).pathname;
  
  options.headers.host = options.host;
  
  logger.debug('[Options]', options);
  
  return options;
}