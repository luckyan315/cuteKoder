/* 
*	editor.js
*	
*	editor view : show ACE and tabs for multi-document.
*
*	
*/

console.log("editor.js");
define(function(require, exports, module){

var TAB_TEMPLATE = "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>";
var ACE_ID	= "editor-ace";
var TABS_ID	= "editor-tabs";

var editor 	= null;
var tabs	= null
var counter = 0;

exports.init = function( cb )
{
	// initialize tabs
	var tabsElement = document.createElement("div");
	tabsElement.setAttribute("id",TABS_ID);
	$("#editor").append(tabsElement);
	$("#"+TABS_ID).html("<ul></ul><div id='"+ACE_ID+"'></div>");
	
	// initialize ACE
	editor = ace.edit(ACE_ID);
	tabs = $("#"+TABS_ID).tabs({ collapsible: false });
	
	// close icon: removing the tab on click
	tabs.delegate( "span.ui-icon-close", "click", function() {
		var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
		//$( "#" + panelId ).remove();
		tabs.tabs( "refresh" );
		counter--;
	});

	tabs.bind( "keyup", function( event ) {
		if ( event.altKey && event.keyCode === $.ui.keyCode.BACKSPACE ) {
			var panelId = tabs.find( ".ui-tabs-active" ).remove().attr( "aria-controls" );
			//$( "#" + panelId ).remove();
			tabs.tabs( "refresh" );
		}
	});
	
	tabs.tabs({beforeActivate:function( event, ui ){
		var name	= ui.newTab.find("a").html();
		var doc		= $("#"+TABS_ID).tabs("option",name);
		if(doc!=null){editor.setSession(doc);}
	}});
	
	exports.editFile("","");
}

exports.getEditor = function( cb )
{
	return editor;
}

exports.editFile = function( name,data )
{
	console.log("editor.editfile()");
	
	if("string"==typeof name)
	{
		if(name.length<=0)
		{
			name = "new"+counter;
		}
	}
	else
	{
		name = name.toString();
	}
	
	if("string"==typeof data)
	{
		if(data.length<=0)
		{
			data = "";
		}
	}
	else
	{
		data = data.toString();
	}

	addTab( name );
	var doc = ace.createEditSession( data );
	var mode = getMode( name, data );
	doc.setMode( mode );
	editor.setSession( doc );
	
	tabs.tabs( "option", name, doc ); // TODO: use unique key name to store editing session, file name could conflict
	
	return;
}

function getMode(name,data)
{
	name.toLowerCase();
	if( name.lastIndexOf(".js") >0 )
	{
		return "ace/mode/javascript";
	}
	
	if( name.lastIndexOf(".css") > 0 )
	{
		return "ace/mode/css";
	}
	
	if( name.lastIndexOf(".xml") > 0 )
	{
		return "ace/mode/xml";
	}
	
	if( name.lastIndexOf(".htm") > 0 )
	{
		return "ace/mode/html";
	}
	
	if( name.lastIndexOf(".html") > 0 )
	{
		return "ace/mode/html";
	}
	
	if( name.lastIndexOf(".json") > 0 )
	{
		return "ace/mode/json";
	}
	
	return "";
}

function addTab( name )
{
	console.log("editor addTab()");
	var li = $( TAB_TEMPLATE.replace( /#\{href\}/g, "#" + ACE_ID ).replace( /#\{label\}/g, name ) );
	tabs.find( ".ui-tabs-nav" ).append( li );
	//tabs.append( "<div id='" + id + "'><p>" + tabContentHtml + "</p></div>" );
	tabs.tabs( "refresh" );
	tabs.tabs( "option", "active", -1 );
}

function delTab( name )
{
	console.log("editor delTab()");
	counter--;
}

function addSession( name, doc )
{

}


});