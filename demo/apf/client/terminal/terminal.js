"use strict";


function main(){
    var term = new Terminal();
    var socket = io.connect('http://localhost:3000');

    //data from server
    socket.on('data', function(data){
	term.handleMessage(data);
    });

    //data from user inputted via terminal
    term.on('message', function(data){
	// socket.send(JSON.stringify({msg: data, command: 'shell'}));
	socket.emit('data', data);
    });
    
    term.draw();

}


function Terminal(container, r, c){
    EventEmitter.call(this);
    
    this.$container = container | document.body;
    this.$root = null;
    this.document = document;
    
    this.$nRow = r | Terminal.ROW;
    this.$nCol = c | Terminal.COL;

    /* char content to be rendered */
    this.$rows = [];
    for(var i=0; i<this.$nRow; i++){
	var r = []; //row
	for(var j=0; j<this.$nCol; j++){
	    r[j] = ' ';
	}
	this.$rows.push(r);
    }
    
    /* line nums received from server */
    this.$curline = 0;
    
    /* coordinate of the cursor */
    this.$cursor = {
	x: 0,
	y: 0
    };

    this.$parse_state = Terminal.COMMON;
    
    var _this = this;
    
    //initialize listeners

    //ascii ansi... digitals
    this.document.onkeypress = function(e){

	var keycode = 0;
	var ch = null;
	e = e || event;
	
	keycode = e.keyCode || e.which || e.charCode;
	
	ch = String.fromCharCode(keycode);
	_this.send(ch);
	stopBubbling(e);
	// console.log(String.fromCharCode(keycode) + ' keycode: ' + keycode);
    };

    //
    this.document.onkeydown = function(e){
	var keycode = 0;
	var ch = null;
	e = e || event;
	
	keycode = e.keyCode || e.which || e.charCode;
	
	switch(keycode){
	case 3:
	    //cancel

	    break;
	case 6:
	    //help
	    
	    break;
	case 8:
	    //backspace
	    ch = '\x7f';
	    
	    break;
	case 9:
	    //tab
	    ch = '\t';
	    break;
	case 13:
	    //Return/Enter key
	    ch = '\r';
	    break;
	case 16:
	    //shift
	    
	    break;
	case 17:
	    //control
	    
	    break;
	case 18:
	    //alt
	    
	    break;
	    
	default:
	    if( e.ctrlKey ){
		if (e.keyCode >= 65 && e.keyCode <= 90) {
		    ch = String.fromCharCode(e.keyCode - 64);
		}
	    }

	}

	if( ch ){
	    _this.send(ch);
	    stopBubbling(e);
	}
    };
};

inherits(Terminal, EventEmitter);


//state of ANSI escape code, REF://http://en.wikipedia.org/wiki/ANSI_escape_code
Terminal.COMMON = 1; //command charset
Terminal.ESC = 2; //ESC
//Select a single character from one of the alternate character sets.
Terminal.SS2 = 3; //ESC N, 
Terminal.SS3 = 4; //ESC O, 
//These each take a single string of text, terminated by ST (ESC \ ). They are ignored by xterm.
Terminal.PM = 5;  //ESC ^,
Terminal.APC = 6; //ESC _,
//Device control string
Terminal.DCS = 7; //ESC P,
//operating system command
Terminal.OSC = 8; //ESC ], 

//default size of pty
Terminal.ROW = 24;
Terminal.COL = 80;


(function(){

    //private
    var _this = this;  
    
    //public
    
    this.handleMessage = function(data){
	console.log('[Terminal]' + data.replace(/\x1b/g, '^['));

	//init vars
	var content = data;
	this.$parse_state = this.$parse_state || Terminal.COMMON
	
	for(var i=0; i<content.length; i++){
	    var ch = content[i];
	    switch(this.$parse_state){
	    case Terminal.COMMON:
		switch(ch){
		case '\x001b':
		    this.$parse_state = Terminal.ESC;
		    break;
		case '\n':
		    this.$cursor.y += 1;
		    break;
		case '\r':
		    this.$cursor.x = 0
		    break;
		default:
		    
		};

		break;
	    case Terminal.ESC:
		break;
	    case Terminal.SS2:
		break;
	    case Terminal.SS3:
		break;
	    case Terminal.PM:
		break;
	    case Terminal.APC:
		break;
	    case Terminal.DCS:
		break;
	    case Terminal.OSC:
		break;
		
	    }
	    
	    // switch(ch){
	    // case '\r':
	    // 	ch = '';
	    // 	break;
	    // case '\n':
	    // 	this.$curline++;
	    // 	this.$cursor.y++;
	    // 	ch='';
	    // 	break;
	    // }
	    
	    // this.$rows[this.$curline].innerHTML += ch;
	}
	
    };
    
    this.draw = function(){
	var oRowDiv = null;
	this.$root = this.document.createElement('div');
	this.$root.className = 'terminal';
	
	for(var i = 0; i < this.$row; i++) {
	    oRowDiv = this.document.createElement('div');
	    this.$root.appendChild(oRowDiv);
	    // this.$rows.push(oRowDiv);
	}

	if( this.$container == false){
	    this.$container = document.body;
	    this.$container.appendChild(this.$root);
	}
    };  

    //send data to server
    this.send = function(data){
	this.emit('message', data);
    };

}).call(Terminal.prototype);

//EventEmitter , node.js style api
function EventEmitter(){
    this.$events = {};
}

(function(){
    //public

    this.emit = function(type){
	if( !this.$events || !this.$events[type] ){
	    return;
	}

	var args = Array.prototype.slice.call(arguments, 1);
	for (var i = 0; i < this.$events[type].length; ++i)
	{
	    var fn = this.$events[type][i];
	    switch(args.length){
	    case 1:
		fn.call(this, args[0]);
		break;
	    case 2:
		fn.call(this, args[0], args[1]);
		break;
	    default:
		fn.call(this, args);
	    };
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

function stopBubbling(e){
    if (e.preventDefault){
	e.preventDefault();
	e.returnValue = false;;
    }
    if (e.stopPropagation){
	e.stopPropagation();
	e.cancelBubble = true;
    }
}

function getStyle(element, attr_name){
    if( element.currentStyle ){
	return element.currentStyle[attr_name];
    } else {
	return getComputedStyle(element, false)[attr_name];
    }
}


Terminal.keyNames = {3: "Enter", 8: "Backspace", 9: "Tab", 13: "Enter", 16: "Shift", 17: "Ctrl", 18: "Alt",
                     19: "Pause", 20: "CapsLock", 27: "Esc", 32: "Space", 33: "PageUp", 34: "PageDown", 35: "End",
                     36: "Home", 37: "Left", 38: "Up", 39: "Right", 40: "Down", 44: "PrintScrn", 45: "Insert",
                     46: "Delete", 59: ";", 91: "Mod", 92: "Mod", 93: "Mod", 109: "-", 107: "=", 127: "Delete",
                     186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\",
                     221: "]", 222: "'", 63276: "PageUp", 63277: "PageDown", 63275: "End", 63273: "Home",
                     63234: "Left", 63232: "Up", 63235: "Right", 63233: "Down", 63302: "Insert", 63272: "Delete"};
