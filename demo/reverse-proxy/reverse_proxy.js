/**
 * a simple reverse proxy server impl
 *
 * Copyright (C) 2014 guanglin.an (lucky315.an@gmail.com)
 * 
 */

"use strict";

var EventEmitter = require('events').EventEmitter;
var util = require('util');


var ReverseProxy = exports = module.exports = function(opt){
  EventEmitter.call(this);

  /* target url */
  this.target = opt.target;
  
};

util.inherits(ReverseProxy, EventEmitter);

(function(){
  //public funcs
  this.createServer = function(){
    //TODO:
    console.log('create server');
  };


  this.listen = function(){
    //TODO:
    console.log('listening...' + this.target);
  };
  
  
}).call(ReverseProxy.prototype);


