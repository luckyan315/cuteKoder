/**
 * Middlewares about dealing with outgoing stream (response) from target webserver
 *
 * Copyright (C) 2014 guanglin.an (lucky315.an@gmail.com)
 * 
 */

"use strict";

var OutgoingMiddlewares = exports = module.exports;

[
  function beforeResponse(){
    //TODO:
    
  },
  function wrapResponse(){
    //TODO:
  }
].forEach(function(middleware){
  OutgoingMiddlewares[middleware.name] = middleware;
});
