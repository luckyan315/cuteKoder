/**
 * a simple reverse proxy server impl
 *
 * Copyright (C) 2014 guanglin.an (lucky315.an@gmail.com)
 * 
 */

"use strict";

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var http = require('http');

var in_mids = require('./in_mids.js');

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
    if (this.server) return this.server;

    function proxy_cb(target){
      var arrInMids = Object.keys(in_mids).map(function(func_name){
        return in_mids[func_name];
      })
      
      return function(req, res){
        arrInMids.forEach(function(func){
          func.call(this, req, res, target);
        });
      }
    };
    
    this.server = http.createServer(proxy_cb(this.target));
  };


  this.listen = function(port, cb){
    //TODO:
    this.server.listen(port, cb);
  };
  
  //private funcs
  this.onError = function(err){
    //TODO:
  };
  
}).call(ReverseProxy.prototype);
