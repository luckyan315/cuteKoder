/**
 * terminal.js - a browser pseudo terminal 
 * Copyright (c) 2013, guanglin.an (lucky315.an@gmail.com)
 */

/*
 * REF:
 *      http://en.wikipedia.org/wiki/ANSI_escape_code
 *      http://en.wikipedia.org/wiki/C0_and_C1_control_codes
 *      http://en.wikipedia.org/wiki/Control_Sequence_Introducer#Sequence_elements
 *      http://ttssh2.sourceforge.jp/manual/en/about/ctrlseq.html#CSI
 */

/* Definitions
 * |----+---------------------------------------------------|
 * | c  | The literal character c.                          |
 * |----+---------------------------------------------------|
 * | C  | A single (required) character                     |
 * |----+---------------------------------------------------|
 * | Ps | A single (usually optional) numeric parameter,    |
 * |    | composed of one of more digits.                   |
 * |----+---------------------------------------------------|
 * | Pm | A multiple numeric parameter composed of any      |
 * |    | number of single numeric parameters, separated    |
 * |    | by ; character(s). Individual values for the      |
 * |    | parameters are listed with Ps.                    |
 * |----+---------------------------------------------------|
 * | Pt | A text parameter composed of printable characters |
 * |----+---------------------------------------------------|
 */

/**
 *  Mode(Strandard)
 *
 * | Mode No. | Mnemoni  | Set(DECSET)                                   | Reset(DECRST)                |
 * |        2 | KAM      | Locks the keyboard                            | Unlonks the keyboard         |
 * |----------+----------+-----------------------------------------------+------------------------------|
 * |        4 | IRM      | Insert mode                                   | Replace mode                 |
 * |----------+----------+-----------------------------------------------+------------------------------|
 * |       12 | SRM      | Local echo off                                | Local echo on                |
 * |----------+----------+-----------------------------------------------+------------------------------|
 * |       20 | LNM      | New line mode.                                |                              |
 * |          |          | -Cursor moves to the first column of the next | Line feed mode               |
 * |          |          | line when the terminal receives an LF, FF or  | -Cursor moves to current     |
 * |          |          | VT character.                                 | column on the next line      |
 * |          |          | -New-line(Transmit)settting is changed to     | when the terminal receives   |
 * |          |          | "CR+LF"                                       | an LF, FF or VT character.   |
 * |          |          |                                               | - New-line(Transmit) setting |
 * |          |          |                                               | is changed to "CR"           |
 * |----------+----------+-----------------------------------------------+------------------------------|
 * |       33 | WYSTCURM | Steady cursor                                 | Blinking cursor.             |
 * |----------+----------+-----------------------------------------------+------------------------------|
 * |       34 | WYULCURM | Underline cursor                              | Block cursor                 |
 * |----------+----------+-----------------------------------------------+------------------------------|
 */

/**
 *  Character Atrributes.(SGR)
 *
 * |--------------------+----------------------------------------------------------------------------------|
 * |                No. | Attribute                                                                        |
 * |--------------------+----------------------------------------------------------------------------------|
 * |                  0 | Normal                                                                           |
 * |                  1 | Bold                                                                             |
 * |                  4 | Underlined                                                                       |
 * |                  5 | Blink                                                                            |
 * |                  7 | Inverse                                                                          |
 * |                 22 | Normal(heighter bold nor faint)                                                  |
 * |                 24 | Not underlined                                                                   |
 * |                 25 | Steady(not blinking)                                                             |
 * |                 27 | Positive(not inverse)                                                            |
 * |                 30 | Set foreground color to Black.                                                   |
 * |                 31 | Set foreground color to Red.                                                     |
 * |                 32 | Set foreground color to Green.                                                   |
 * |                 33 | Set foreground color to Yellow.                                                  |
 * |                 34 | Set foreground color to Blue                                                     |
 * |                 35 | Set foreground color to Magenta                                                  |
 * |                 36 | Set foreground color to Cyan                                                     |
 * |                 37 | Set foreground color to White                                                    |
 * |--------------------+----------------------------------------------------------------------------------|
 * | 38 ; 2 ; r ; g ; b |                                                                                  |
 * | 38 ; 2 ; r : g : b |                                                                                  |
 * | 38 ; 2 : r : g : b |                                                                                  |
 * | 38 : 2 : r : g : b | Set foreground color in RGB value, matching closest entry in 256 colors palette. |
 * |--------------------+----------------------------------------------------------------------------------|
 * |        38 ; 5 ; Ps |                                                                                  |
 * |        38 ; 5 : Ps |                                                                                  |
 * |        38 : 5 : Ps | Set foreground color to color number Ps.                                         |
 * |--------------------+----------------------------------------------------------------------------------|
 * |                    |                                                                                  |
 * |                 39 | Set foreground color to default.                                                 |
 * |                 40 | Set background color to Black. (Color No. 0)                                     |
 * |                 41 | Set background color to Red. (Color No. 1)                                       |
 * |                 42 | Set background color to Green. (Color No. 2)                                     |
 * |                 43 | Set background color to Yellow. (Color No. 3)                                    |
 * |                 44 | Set background color to Blue. (Color No. 4)                                      |
 * |                 45 | Set background color to Magenta. (Color No. 5)                                   |
 * |                 46 | Set background color to Cyan. (Color No. 6)                                      |
 * |                 47 | Set background color to White. (Color No. 7)                                     |
 * |--------------------+----------------------------------------------------------------------------------|
 * | 48 ; 2 ; r ; g ; b |                                                                                  |
 * | 48 ; 2 ; r : g : b |                                                                                  |
 * | 48 ; 2 : r : g : b |                                                                                  |
 * | 48 : 2 : r : g : b | Set background color in RGB value, matching closest entry in 256 colors palette. |
 * |--------------------+----------------------------------------------------------------------------------|
 * |        48 ; 5 ; Ps |                                                                                  |
 * |        48 ; 5 : Ps |                                                                                  |
 * |        48 : 5 : Ps | Set background color to color number Ps.                                         |
 * |--------------------+----------------------------------------------------------------------------------|
 * |                 49 | Set background color to default.                                                 |
 * |                 90 | Set foreground color to Gray. (Color No. 8)                                      |
 * |                 91 | Set foreground color to Bright Red. (Color No. 9)                                |
 * |                 92 | Set foreground color to Bright Green. (Color No. 10)                             |
 * |                 93 | Set foreground color to Bright Yellow. (Color No. 11)                            |
 * |                 94 | Set foreground color to Bright Blue. (Color No. 12)                              |
 * |                 95 | Set foreground color to Bright Magenta. (Color No. 13)                           |
 * |                 96 | Set foreground color to Bright Cyan. (Color No. 14)                              |
 * |                 97 | Set foreground color to Bright White. (Color No. 15)                             |
 * |                100 | Set background color to Gray. (Color No. 8)                                      |
 * |                101 | Set background color to Bright Red. (Color No. 9)                                |
 * |                102 | Set background color to Bright Green. (Color No. 10)                             |
 * |                103 | Set background color to Bright Yellow. (Color No. 11)                            |
 * |                104 | Set background color to Bright Blue. (Color No. 12)                              |
 * |                105 | Set background color to Bright Magenta. (Color No. 13)                           |
 * |                106 | Set background color to Bright Cyan. (Color No. 14)                              |
 * |                107 | Set background color to Bright White. (Color No. 15)                             |
 * |--------------------+----------------------------------------------------------------------------------|
 */


"use strict";

function main(){
    var term = new Terminal();
    var socket = io.connect('http://localhost:3000');

    //data recv from server
    socket.on('data', function(data){
	term.handleMessage(data);
    });

    //data send to server
    term.on('data', function(data){
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
	var row = []; //row
	for(var j=0; j<this.$nCol; j++){
	    row[j] = [' ', Terminal.DEFAULT_SGR_ATTR];
	}
	this.$rows.push(row);
    }
    
    /* line nums received from server */
    this.$curline = 0;
    
    /* coordinate of the cursor */
    this.$cursor = {
	x: 0,
	y: 0
    };

    /* save parameters as parsing csi sequence */
    this.$csiParams = [];
    this.$curParam = 0;

    this.$curAttr = 0;
    
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

/**
 * state of ANSI escape code,
 */
Terminal.COMMON = 0; //command charset
Terminal.ESC = 1; //ESC
Terminal.CSI = 2; //ESC [, CSI

//Select a single character from one of the alternate character sets.
Terminal.SS2 = 3; //ESC N, 
Terminal.SS3 = 4; //ESC O, 
//Privacy Message
Terminal.PM = 5;  //ESC ^,
//Application Program Command
Terminal.APC = 6; //ESC _,
//Device control string
Terminal.DCS = 7; //ESC P,
//operating system command
Terminal.OSC = 8; //ESC ], 

//default size of pty
Terminal.ROW = 24;
Terminal.COL = 80;

//
Terminal.DEFAULT_BACKGROUND_COLOR = 0;
Terminal.DEFAULT_FOREGROUND_COLOR = 7;
Terminal.DEFAULT_COMMON_TYPE = 0

//dark color, background = black, foreground = white, font
Terminal.DEFAULT_SGR_ATTR =
    0 << 12 |
    Terminal.DEFAULT_BACKGROUND_COLOR << 8 |
    Terminal.DEFAULT_FOREGROUND_COLOR << 4 |
    Terminal.DEFAULT_COMMON_TYPE;


(function(){

    //private
    var _this = this;  
    
    //public
    
    this.handleMessage = function(data){
	console.log('[Terminal]' + data.replace(/\x1b/g, 'u001b'));

	//init vars
	var content = data;
	var c = this.$cursor.x;
	var r = this.$cursor.y;
	
	this.$parse_state = this.$parse_state || Terminal.COMMON;
	
	for(var i=0; i<content.length; i++){
	    var ch = content[i];

	    switch(this.$parse_state){
	    case Terminal.COMMON:
		switch(ch){
		case '\x1b':
		    this.$parse_state = Terminal.ESC;
		    break;
		case '\t':
		    //TODO: next tab pos
		    break;
		case '\n':
		    r++;
		    break;
		case '\r':
		    c = 0;
		    break;
		case '\b':
		    if(c>0){
			c--;
		    }
		default:
		    if( c >= this.$nCol ){
			c = 0;
			r++;
		    }
		    this.$rows[r][c] = [ch, this.$curAttr];
		    c++;
		};
		break; /* Terminal.COMMON */
	    case Terminal.ESC:
		switch(ch){
		case '[':
		    this.$parse_state = Terminal.CSI;
		    break;
		case 'N':
		    //TODO: ESC N
		    this.$parse_state = Terminal.SS2;
		    break;
		case 'O':
		    //TODO: ESC O
		    this.$parse_state = Terminal.SS3;

		    break;
		case '^':
		    //TODO: ESC ^
		    this.$parse_state = Terminal.PM;
		    break;
		case '_':
		    //TODO: ESC _
		    this.$parse_state = Terminal.APC;
		    break;
		case 'P':
		    //TODO: ESC P
		    this.$parse_state = Terminal.DCS;
		    break;
		case ']':
		    //TODO: ESC ]
		    this.$parse_state = Terminal.OSC;
		    break;
		case '\x07':
		    //bell
		    
		    break;
		default:
		    //
		    throw new Error('Unkown PARSE_STATE:' + ch); 
		    break;
		};

		break; /* Terminal.ESC */
	    case Terminal.CSI:
		console.log('[BrowserIDE] CSI detacted!');
		
		switch(ch){
		case '0':/* 48 */
		case '1':
		case '2':
		case '3':
		case '4':
		case '5':
		case '6':
		case '7':
		case '8':
		case '9':
		    //a digit
		    this.$curParam = this.$curParam * 10 + ch.charCodeAt(0) - 48;
		    break;
		case '?':
		    //TODO: csi ?
		    break;
		case '>':
		    //TODO: csi >
		    break;
		case '$':
		    //TODO: csi $
		    break;
		case '\'':
		    //TODO: csi \
		    break;
		case ';':
		    //TODO: csi ;
		    this.$csiParams.push(this.$curParam);
		    this.$curParam = 0;
		    break;
		case 'A': 
		    //CUU, Moves cursor up Ps lines in the same column. 
		    break;
		case 'B':
		    //Moves cursor down Ps lines in the same column. 
		    break;
		case 'C':
		    //Moves cursor to the right Ps columns. 
		    break;
		case 'D':
		    //Moves cursor to the left Ps columns. 
		    break;
		case 'E':
		    //Moves cursor to the first column of Ps-th following line. 
		    break;
		case 'F':
		    //Moves cursor to the first column of Ps-th preceding line. 
		    break;
		case 'G':
		    //Moves cursor to the Ps-th column of the active line. 
		    break;
		case 'H':
		    //Moves cursor to the Ps1-th line and to the Ps2-th column. 
		    break;
		case 'I':
		    //Moves cursor to the Ps tabs forward. 
		    break;
		case 'J':
		    //Erase in display. The default value of Ps is 0.
		    //Ps = 0      Erase from cursor through the end of the display.
		    //   = 1      Erase from the beginning of the display through the cursor.
		    //   = 2      Erase the complete of display.
		    break;
		case 'K':
		    //Erase in line. The default value of Ps is 0.
		    // Ps = 0      Erase from the cursor through the end of the line.
		    //    = 1      Erase from the beginning of the line through the cursor.
		    //    = 2      Erase the complete of line.
		    
		    break;
		case 'L':
		    //Inserts Ps lines, stgarting at the cursor. The default 1. 
		    break;
		case 'M':
		    //Deletes Ps lines in the scrolling region, starting with the line
		    //that has the cursor, the default 1.
		    break;
		case 'P':
		    //Deletes Ps characters from the cursor position to the right.The default 1.
		    break;
		case 'S':
		    //Scroll up Ps lines. The default 1.
		    break;
		case 'T':
		    //Scroll down Ps lines. The default value of Ps is 1.
		    break;
		case 'X':
		    //Erase Ps characters, from the cursor positioon to the right.The default 1.
		    break;
		case 'Z':
		    //Moves cursor to the Ps tabs backward.The default 1.
		    break;
		case '\'': //single quote
		    //Moves cursor to the Ps-th columns of the active line. The default 1.
		    break;
		case 'a':
		    //Moves cursor to the right Ps columns.The default 1.
		    break;
		case 'c':
		    // Primary Device Attribute. The default value of Ps is 0.
		    // Ps = 0    Asks for the terminal's architectural class and basic attributes.
		    // Response: Depends the Terminal ID setting.
		    //   VT100     ESC [ ? 1 ; 2 c
		    //   VT100J    ESC [ ? 5 ; 2 c
		    //   VT101     ESC [ ? 1 ; 0 c
		    //   VT102     ESC [ ? 6 c
		    //   VT102J    ESC [ ? 15 c
		    //   VT220J    ESC [ ? 62 ; 1 ; 2 ; 5 ; 6 ; 7 ; 8 c
		    //   VT282     ESC [ ? 62 ; 1 ; 2 ; 4 ; 5 ; 6 ; 7 ; 8 ; 10 ; 11 c
		    //   VT320     CSI ? 63 ; 1 ; 2 ; 6 ; 7 ; 8 c
		    //   VT382     CSI ? 63 ; 1 ; 2 ; 4 ; 5 ; 6 ; 7 ; 8 ; 10 ; 15 c
		    //   VT420     CSI ? 64 ; 1 ; 2 ; 7 ; 8 ; 9 ; 15 ; 18 ; 21 c"
		    //   VT520     CSI ? 65 ; 1 ; 2 ; 7 ; 8 ; 9 ; 12 ; 18 ; 19 ; 21 ; 23 ; 24 ; 42 ; 44 ; 45 ; 46 c
		    //   VT525     CSI ? 65 ; 1 ; 2 ; 7 ; 9 ; 12 ; 18 ; 19 ; 21 ; 22 ; 23 ; 24 ; 42 ; 44 ; 45 ; 46 c
		    
		    break;
		case 'd':
		    //Move to the corresponding vertical position(line Ps) of the current column.
		    //The default value is 1.
		    break;
		case 'e':
		    //Moves cursor down Ps lines in the same column.
		    //The default value is 1.
		    break;
		case 'f':
		    //Moves cursor to the Ps1-th line and to the Ps2-th column.
		    //The default value is 1.
		    break;
		case 'g':
		    //Clears the tab stop. The default value of Ps is 0.
		    
		    break;
		case 'h':
 		    //Sets mode, detail info go to file comment .
		    
		    break;
		case 'i':
		    //Priting mode
		    //Ps = 0 Print screen
		    //   = 4 Turn off printer controller mode.
		    //   = 5 Turn on printer controller mode.
		    break;
		case 'j':
		    //Moves cursor to the left Ps columns.
		    //The default value is 1.
		    break;
		case 'k':
		    //Moves cursor up Ps lines in the same column.
		    //The default value is 1.
		    break;
		case 'l':
		    //Resets mode
		    break;
		case 'm':
		    //SGR, Character Atrributes, see more info at REF
		    this.$csiParams.push(this.$curParam);
		    this.setCharAttr();
		    this.clearCsiParams();
		    this.$parse_state = Terminal.COMMON;
		    
		    break;
		case 'n':
		    //Reports device status
		    //Ps = 5  Request the terminal's operation status report.
		    //        Always return 'CSI 0 n' (Terminal).
		    //  =  6  Request cursor position report.
		    //        Response: CSI r; cR
		    //         r     Line number
		    //         c     Column number
		    
		    
		    break;
		case 'r':
		    //Set top and bottom margins.
		    //Ps1   Line number for the top margin.
		    //      The default value is 1.
		    //Ps2   Line number for the bottom margin.
		    //      The default value is number of lines per screen.
		    
		    break;
		case 's':
		    //| CSI s        | Save cursor position. Same as DECSC.SCP  |
		    //|              | only works when DECLRMM is reset.        |
		    //|--------------+------------------------------------------|
		    //| CSI Ps1;Ps2s | Set left and right margins. DECSLRM only |
		    //|              | works when DECLRMM is set                |
		    
		    break;
		case 't':
		    //Window manipulation.
		    //
		    // Ps1 =  1    De-iconify window.
		    //     =  2    Minimize window.
		    //     =  3    Move window to [Ps2, Ps3].
		    //     =  4    Resize window to height Ps2 pixels and width Ps3 pixels.
		    //     =  5    Raise the window to the top of the stacking order.
		    //     =  6    Lower the window to the bottom of the stacking order.
		    //     =  7    Refresh window.
		    //     =  8    Resize window to Ps2 lines and Ps3 columns.
		    //     =  9    Change maximize state of window.
		    //             Ps2 = 0    Restore maximized window.
		    //                 = 1    Maximize window.
		    //
		    //     = 11    Reports window state.
		    //             Response: CSI s t
		    //               s = 1    Normal. (non-iconified)
		    //                 = 2    Iconified.
		    //
		    //     = 13    Reports window position.
		    //             Response: CSI 3 ; x ; y t
		    //               x    X position of window.
		    //               y    Y position of window.
		    //
		    //     = 14    Reports window size in pixels.
		    //             Response: CSI 4 ; y ; x t
		    //               y    Window height in pixels.
		    //               x    Window width in pixels.
		    //
		    //     = 18    Reports terminal size in characters.
		    //             Response: CSI 8 ; y ; x t
		    //               y    Terminal height in characters. (Lines)
		    //               x    Terminal width in characters. (Columns)
		    //
		    //     = 19    Reports root window size in characters.
		    //             Response: CSI 9 ; y ; x t
		    //               y    Root window height in characters.
		    //               x    Root window width in characters.
		    //
		    //     = 20    Reports icon label.
		    //             Response: OSC L title ST
		    //               title    icon label. (window title)
		    //
		    //     = 21    Reports window title.
		    //             Response: OSC l title ST
		    //               title    Window title.
		    //     = 22    Save window title on stack.
		    //             Ps2 = 0, 1, 2    Save window title.
		    //     = 23    Restore window title from stack.
		    //             Ps2 = 0, 1, 2    Restore window title.

		    break;
		case 'u':
		    //Restore cursor position. Same as DECRC.
		    
		    break;
		case 'r':
		    //if csiParam[0] == '<' && csiParam.length == 2 : Restore cursor position.Same as DECRC.
		    
		    break;
		case 's':
		    //if csiParam[0] == '<' && csiParam.length == 2 : Restore IME open state.
		    
		    break; 
		}

		break; /* Terminal.CSI */
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
	    default:

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
	
	this.renderMatric();
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

    this.setCharAttr = function(){
	console.log('[Parameters]:' + this.$csiParams);

	var curAttr = 0;

	if( this.$csiParams.length === 0 ){
	    curAttr = Terminal.DEFAULT_SGR_ATTR;
	} else {
	    //0-3 bit
	    var char_type = Terminal.DEFAULT_SGR_ATTR & 0xf;
	    //4-7 bit
	    var fg = Terminal.DEFAULT_SGR_ATTR >> 4 & 0xf;
	    //8-11 bit
	    var bg = Terminal.DEFAULT_SGR_ATTR >> 8 & 0xf;
	    //12th bit
	    var bright = Terminal.DEFAULT_SGR_ATTR >> 12 & 1;
	    
	    for(var i=0; i<this.$csiParams.length; i++){
		var param = this.$csiParams[i];
		if( param >=0 && param < 30 ){
		    switch(param){
		    case 0:
			//Normal
			char_type = 0;
			break;
		    case 1:
			//Bold
			char_type = 1;
			break;
		    case 4:
			//Underlined
			char_type = 2;
			break;
		    case 5:
			//Blink
			char_type = 3;
			break;
		    case 7:
			//Inverse
			char_type = 4;
			break;
		    case 22:
			//Normal(heighter bold nor faint)
			char_type = 5;
			break;
		    case 24:
			//Not underlined
			char_type = 6;
			break;
		    case 25:
			//Steady(not blinking)
			char_type = 7;
			break;
		    case 27:
			//Positive (not inverse)
			char_type = 8;
			break;
		    default:
			console.log('[BrowserIDE][SGR]Unknown character attribute:' + param);
			char_type = 0; //normal
		    }
		} else if(param >= 30 && param <= 39){
		    if (param >= 30 && param <= 37){
			//set foreground color
			// curAttr = (param - 30) << 4 | curAttr;
			fg = param - 30;
		    } else if (param === 38){
			//Set foreground color in RGB value, matching
			//closet entry in 256 colors palette.
			
		    } else {
			//param = 39, Set foreground color to default
			
		    }
		} else if(param >= 40 && param <= 49){
		    if( param >= 40 && param <= 47 ){
			//set background color
			// curAttr = (param - 40) << 8 | curAttr;
			bg = param - 40;
		    } else if(param === 48) {
			//Set background color in RGB value,
			//matching closet entry in 256 colors palette.
			
		    } else {
			//param = 49, Set background color to default
			
		    }
		} else if(param >= 90 && param <= 97){
		    //Set Bright foreground color
		    // curAttr = 1 << 12 | (param - 90) << 4 | curAttr;
		    bright = 1;
		    fg = param - 90;
		    
		} else if(param >= 100 && param <= 107){
		    //Set Bright background color
		    // curAttr = 1 << 12 | (param - 100) << 8 | curAttr;
		    bright = 1;
		    bg = param - 107;
		}
	    }

          curAttr = bright << 12 | bg << 8 | fg << 4 | char_type;
	}

	

	this.$curAttr = curAttr;
    };

    this.renderMatric = function(){
	
    };
    
    this.clearCsiParams = function(){
	this.$curParam = 0;
	this.$csiParams = [];
    };
    
    //send data to server
    this.send = function(data){
	this.emit('data', data);
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

function isDigit(ch){
    return ch >= '0' && ch <= '9';
}

Terminal.keyNames = {3: "Enter", 8: "Backspace", 9: "Tab", 13: "Enter", 16: "Shift", 17: "Ctrl", 18: "Alt",
                     19: "Pause", 20: "CapsLock", 27: "Esc", 32: "Space", 33: "PageUp", 34: "PageDown", 35: "End",
                     36: "Home", 37: "Left", 38: "Up", 39: "Right", 40: "Down", 44: "PrintScrn", 45: "Insert",
                     46: "Delete", 59: ";", 91: "Mod", 92: "Mod", 93: "Mod", 109: "-", 107: "=", 127: "Delete",
                     186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\",
                     221: "]", 222: "'", 63276: "PageUp", 63277: "PageDown", 63275: "End", 63273: "Home",
                     63234: "Left", 63232: "Up", 63235: "Right", 63233: "Down", 63302: "Insert", 63272: "Delete"};
