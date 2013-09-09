/**
 *@file      terminal
 *@brief     pseudo terminal
 *@author    angl( guanglin.an@samsung.com), SCRC-SL
 *@date      Fri Sep  6 11:28:47 2013
 *
 * Copyright 2013 by Samsung Electronics, Inc.,
 *
 * This software is the confidential and proprietary information 
 * of Samsung Electronics, Inc. ("Confidential Information").  You
 * shall not disclose such Confidential Information and shall use
 * it only in accordance with the terms of the license agreement
 * you entered into with Samsung.
 */

"use strict";

var socket = io.connect('http://localhost:3000');

function main(){
  var term = new Terminal();

  // socket.on('message', function(data){
  //   console.log('');
  // });

  //socket.io circular emissions test
  socket.on('news', function(data){
    // document.write('<h1>' + data.title + '</h1>');
    // document.write('<p>' + data.contents + '</p>');

    term.write(data);
    
    // if(data.allowResponse) {
    //   socket.emit('scoop', {contents: 'News data received by client.'});
    // }
  });
  
  term.draw();
  
}


function Terminal(container, row, col){
  EventEmitter.call(this);
  
  this.$container = container | document.body;
  this.document = document;
  
  this.$row = row | Terminal.ROW;
  this.$col = col | Terminal.COL;

  this.$rows = [];
  
  //initialize
  
}

inherits(Terminal, EventEmitter);

Terminal.ROW = 100;
Terminal.COL = 40;

(function(){

  //public

  this.write = function(data){
    console.log('[Terminal]' + JSON.stringify(data));
    
    if( !data.title ){
      return;
    }

    var content = data.title;
    var iRow = 0;
    var i = 0;
    var ch = content[i];
    // var oTxt = this.document.createTextNode(content);
    
    while( ch ){
      
      switch(ch){
       case '\n':
        iRow++;
        break;
      };
      
      this.$rows[iRow].innerHTML += ch;
      ch = content[i++];
    }
    
  };

  
  this.draw = function(){
    var oRowDiv = null;
    var oRoot = this.document.createElement('div');
    
    for(var i = 0; i < this.$row; i++) {
      oRowDiv = this.document.createElement('div');
      oRoot.appendChild(oRowDiv);
      this.$rows.push(oRowDiv);
    }

    if( this.$container == false){
      this.$container = document.body;
      this.$container.appendChild(oRoot);
    }
  };  

  //private
  
}).call(Terminal.prototype);

//EventEmitter
function EventEmitter(){
  this.$events = {};
}

(function(){
  //public

  this.emit = function(type){
    if( !this.$events[type] ){
      return;
    }

    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < this.$events[type].length; ++i)
    {
      this.$events[type][i].call(this, args);
    }
  };

  this.addListener = function(type, listener){
    if( typeof listener !== 'function'){
      throw TypeError('listener must be a function!');
    }

    this.$events = this.$events || {};
    this.$events[type] = this.$events[type] || [];
    
    this.$events[type].push(listener);
  };

  this.on = this.addListener;

  this.removeListener = function(type, listener){
    if( !this.$events[type] ){
      return ;
    }

    if( typeof listener !== 'function'){
      throw TypeError('listener must be a function!');
    }
    
    for (var i = this.$events[type].length-1; i >= 0; --i)
    {
      if( this.$events[type][i] === listener ){
        return this.$events[type].splice(i, 1);
      }
    }
  };

  this.removeAllListeners = function(type){
    if( this.$events[type] ){
      delete this.$events[type];
    }
  };

  this.listeners = function(type){
    return this.$events[type] || [];
  };

}).call(EventEmitter.prototype);

//utils

/**
 * Inherit the prototype method from superCtor into ctor
 *
 * @param {function} ctor constructor obj need to inherit
 * @param {function} superCtor constructor function to inherit prototype from
 * @param {void}
 */
function inherits(ctor, superCtor) {
  function f() {
    this.constructor = ctor;
  }
  f.prototype = superCtor.prototype;
  ctor.prototype = new f();
}
