"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
  uid:String,
  name: String,
  password: String,
  email: String,
  tel:String,
  grade:{type:String, default: "O"}, /* '0' is normal, '1' is advanced, '9' is admin */
  avatar:String,
  date:{type:Date, default: Date.now}
});

mongoose.model('User', UserSchema);
