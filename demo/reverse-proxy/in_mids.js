/**
 * Middlewares about dealing with Incoming Messages
 *
 * Copyright (C) 2014 guanglin.an (lucky315.an@gmail.com)
 * 
 */

"use strict";

var IncomingMiddlewares = exports = module.exports;

[
  function before(req, res, target){
    console.log('[Before] middleware entered!' + target);
  },

  function proxy(req, res, target){
    console.log('[Proxy] middleware entered!');
  }
].forEach(function(middleware){
  IncomingMiddlewares[middleware.name] = middleware;
});