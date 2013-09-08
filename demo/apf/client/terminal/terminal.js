//main entry
function main(){
  var term = new Terminal();

  
};

function Terminal(container, row, col){
  EventEmitter.call(this);

  //private
  
  this.$container = container | document.body;

  this.$row = row | Terminal.ROW;
  this.$col = col | Terminal.COL;

  //public
  
  this.document = document;
};

inherits(Terminal, EventEmitter);

Terminal.ROW = 80;
Terminal.COL = 24;

(function(){
  //public
  this.render = function(){
    var oRootDiv = this.document.createElement('div');
    var oRowDiv = null;

    for (var i = 0; i < this.$row; ++i)
    {
      oRowDiv = this.document.createElement('div');
      oRootDiv.appendChild(oRowDiv);
    }

    if( this.$container == false ){
      this.$container = this.document.body;
      this.$container.appendChild(oRootDiv);
    }

  };
  
  //private
  
}).call(Terminal.prototype);

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
  
  //private
  
}).call(EventEmitter.prototype);

//utils

function inherits(ctor, superCtor){
  function f(){
    this.constructor = ctor;
  };
  f.prototype = superCtor.prototype;
  ctor.prototype = new f();
  
}
