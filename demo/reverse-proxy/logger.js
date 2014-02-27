/**
 * logger util 
 *
 * Copyright (C) 2014 guanglin.an (lucky315.an@gmail.com)
 * 
 */

"use strict";

var logger = exports = module.exports = {};

//open all
logger.LEVEL = 'debug';

//color mapping
logger.LEVEL_TABLE = {
  'debug': 32,
  'log' : 32,
  'info' : 34,
  'warn' : 33,
  'error' : 31
};

logger.init = function(level){
  logger.debug = logger.log = logger.info = logger.warn = logger.error = function(msg){};

  var unshift = Array.prototype.unshift;
  
  switch(level){
    case 'debug':
    logger.debug = function(){
      var prefix = '\x1b[' + logger.LEVEL_TABLE['debug'] + 'm' + 'debug' + '\x1b[m';
      unshift.call(arguments, prefix);
      console.log.apply(console, arguments);
    };
    case 'log' : logger.log = function(){
      var prefix = '\x1b[' + logger.LEVEL_TABLE['log'] + 'm' + 'log' + '\x1b[m';
      unshift.call(arguments, prefix);
      console.log.apply(console, arguments);
    };
    case 'info' : logger.info = function(){
      var prefix = '\x1b[' + logger.LEVEL_TABLE['info'] + 'm' + 'info' + '\x1b[m';
      unshift.call(arguments, prefix);
      console.info.apply(console, arguments);  
    };
    case 'warn' : logger.warn = function(){
      var prefix = '\x1b[' + logger.LEVEL_TABLE['warn'] + 'm' + 'warn' + '\x1b[m';
      unshift.call(arguments, prefix);      
      console.warn.apply(console, arguments);
    };
    case 'error' : logger.error = function(){
      var prefix = '\x1b[' + logger.LEVEL_TABLE['error'] + 'm' + 'error' + '\x1b[m';
      unshift.call(arguments, prefix);            
      console.error.apply(console, arguments);
    };
    break;
    default: throw new Error('Undefined log level');
  };
};

logger.init(logger.LEVEL);
