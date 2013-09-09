"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Member = new Schema({
	uid:String,
	read:{type:Boolean, default:true},
	write:{type:Boolean, default:false},
	execute:{type:Boolean, default:false}
	});

var ProjectSchema = new Schema({
  pid:String,
  url:String,
  name:String,
  own:String,
  path:String,
  createDate:{type:Date, default: Date.now},
  visibility:{type:Boolean, default:true},
  prjtype:{type:String, default:'OPENSOURCE'},
  members:[Member],
  lastAccess:Date,
  description:String
  
});

mongoose.model('Project', ProjectSchema);
