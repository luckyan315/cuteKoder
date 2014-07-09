/**
 * Web Router
 * 
 * Copyright (C) 2014 guanglin.an (lucky315.an@gmail.com)
 */

var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var merge = require('../common').merge;
var debug = require('debug')('webrouter:webrouter');

exports = module.exports = createServer;

function createServer(){
  function router(){
    
  };

  merge(router, EventEmitter.prototype);
  
  debug('webrouter constructor...');

  return router;
}

