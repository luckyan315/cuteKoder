/*
*	project.js
*
*	
*
*/

var fs = require('fs');

var APP_DIR 	= "./public/";
var USER_DIR	= "./developers/";

exports.loadProject = function( user, prjs )
{
	console.log("Project.loadProject()");	
	
	var re = new Object();
	re["projects"] = new Object();
	
	if( "string" != typeof user || user == null ) return re;

	for(var prj in prjs)
	{
		var path = USER_DIR + user + "/apps/" + prjs[prj];
		fld	= readFolder(path);
		re["projects"][prjs[prj]] = fld;		
	}
	return re;
}

exports.loadFile = function( user, name, callback )
{
	console.log("Project.loadFile('"+name+"')");
	
	var path = USER_DIR + user + "/apps/" + name;
	
	var text = "";
	fs.readFile( path , function (err, data) {
		if (err) throw err;
		callback(data);
	});
}

function readFolder(dir)
{
	var data = new Object();
	function walk( path , obj )
	{
		var dirList = fs.readdirSync(path);
		dirList.forEach( function(item)
		{
			if(fs.statSync(path + '/' + item).isDirectory())
			{
				obj[item] = new Object();
				walk( path+'/'+item, obj[item] );
			}
			else
			{
				obj[item] = item;
			}
		});
	}
	walk( dir, data );
	return data;
}
