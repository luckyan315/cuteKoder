var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  password: String,
  email: String
});

mongoose.model('User', UserSchema);
