/* 
*	project.js
*	
*	Project Explorer show files list for projects using treeview.
*
*	
*/
require(["debug"]);

console.log("project.js");

define(function(require, exports, module){

var callback_dbclick = null;

module.exports.init = function( ){

	console.log("project.init()");
	
	//$("#project-explorer").treeview(); 
	/*
	$("#project-explorer").treeview( {
		persist: "location",
		collapsed: true,
		unique: true
	});
	*/	
};

module.exports.openProject = function( html )
{
	console.log("project.openProject");
	$("#project-explorer").html(html);
	$("#project-explorer").treeview({
		animated: "fast",
		collapsed: true,
		unique: true,
		//persist: "cookie",
		toggle: function() {
			//window.console && console.log("%o was toggled", this);
		}
	});	
	$("#projects span.file").dblclick( dblclick );
	$("#projects span").click( click );	
}

module.exports.setOnDbClick = function(func)
{
	callback_dbclick = func;
}

function dblclick( event )
{
	console.log("project dblclick()");
	var path = [];
	var element	= event.currentTarget;
	var filename = $(element).html();
	do{
		element = element.parentElement; // span -> li -> ul -> li
		var tag = element.tagName;
		tag = tag.toUpperCase();
		if(tag == "LI")
		{
			var name = $(element).children("span").html();
			path.push(name);
			continue;
		}
	}while( tag=="UL" || tag=="LI" );
	
	path.reverse();
	var filepath = path.join('/');
	if("function" == typeof callback_dbclick)
	{
		callback_dbclick(filename,filepath);
	}
}

function click( event )
{
	//debug(event.currentTarget);
	//$(event.currentTarget).css( {"color":"blue"});
}

function select( element )
{

}

module.exports.get = function(){
	return $("#project-explorer").html();
};
	
});
