/* ***********************************
*  	debug.js
* 	@brief 	provide debug features
*
* 	@author  Wayland
*
************************************* */

function debugObject(obj)
{
	console.log( "Object>>>>>>>>>>>>" );
	for(var each in obj) 
	{
		console.log( each + " = " + obj[each] );
		/*
		if(obj.hasOwnProperty(each)) 
		{
			alert( each + " = " + obj[each] );
		}
		else 
		{
			alert( "prototype." +  each + " = " + obj[each] );
		}
		*/
	}
	console.log( "Object<<<<<<<<<<<<" );
}

debug = debugObject;


/*

(function(){

	if( "function" != typeof(this.log) )
	{
		alert("debug.js");
		this.log = alert;
	}

	this.debug = function( obj )
	{
		switch( typeof obj )
		{
		case "string":
			log(obj);
		case "object":
			debugObject(obj);
			break;
		case "function":
			log(obj);
		default:
			log(obj);
		}
	}

	function debugObject(obj)
	{
		log( ("Object>>>>>>>>>>>>" );
		for(var each in obj) 
		{
			if(obj.hasOwnProperty(each)) 
			{
				log(each + " = " + obj[each]);
			}
			else 
			{
				log("prototype." +  each + " = " + obj[each]);
			}
		}
		log("Object<<<<<<<<<<<<");
	}
	
	function getAllPropertyNames(obj) 
	{
        var props = [];
        do {
            props = props.concat(Object.getOwnPropertyNames(obj));
        } while (obj = Object.getPrototypeOf(obj));
        return props;
    }


}).call(window);

*/