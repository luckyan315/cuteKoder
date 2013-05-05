/*
*	ide.js
*
*	Entry point of IDE	
*
*/

console.log("ide.js");
define(function(require, exports, module){

	var URL = window.location.protocol + "//" + window.location.host + window.location.pathname.split("/").slice(0,-1).join("/");

	// initialize editor view
	var editor = require("editor");
	editor.init();

	// initialize project view
	var prj = require("project");
	prj.init();
	prj.setOnDbClick(loadFile);
	
	// load project
	var file = "/project";
	$.get( URL+file,function(data){ 
		prj.openProject(data);
	});

	function loadFile(name,path)
	{
		$.post(URL+"/loadfile",{"file":path},function(data)
		{
			editor.editFile(name,data);
		});
	}


  var socket = io.connect('http://localhost');

  socket.emit('sdk-init', { path: '/developers/wayland/apps' });

  
});