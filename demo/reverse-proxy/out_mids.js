/**
 * Middlewares about dealing with outgoing stream (response) from target webserver
 *
 * Copyright (C) 2014 guanglin.an (lucky315.an@gmail.com)
 * 
 */

"use strict";

var logger = require('./logger.js');

var OutgoingMiddlewares = exports = module.exports;

[
  function beforeResponse(){
    //TODO:
    logger.debug('[out][BeforeResponse] middleware entered!');
  },
  function wrapResponse(){
    //TODO:
    logger.debug('[out][WrapResponse] middleware entered!');
  }
].forEach(function(middleware){
  OutgoingMiddlewares[middleware.name] = middleware;
});
