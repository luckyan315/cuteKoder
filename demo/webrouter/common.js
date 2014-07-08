/**
 * Common Utils func
 * 
 * Copyright (C) 2014 guanglin.an (lucky315.an@gmail.com)
 */

exports.merge = function(a, b){
  if (a && b) {
    for (var key in b){
      a[key] = b[key];
    }
  }

  return a;
};