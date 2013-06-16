var mongodb = require('./db');

exports = module.exports = User = function(user){
  this.name = user.name;
  this.password = user.password;
  this.email = user.email;
};

(function(){
  this.save = function(cb){
    var user = {
      name: this.name,
      password: this.password,
      email: this.email
    };

    mongodb.open(function(err, db){
      if( err ){
        return cb(err);
      }
      db.collection('users', function (err, collection){
        if( err ){
          mongodb.close();
          return cb(err);
        }
        collection.insert(user, {safe: true}, function(err, user){
          mongodb.close();
          cb(err, user); //if success , return error state and user info
        });
      });
    });
  };
}).call(User.prototype);

User.get = function(name, cb){
  mongodb.open(function(err, db){
    if( err ){
      return cb(err);
    }

    db.collection('users', function(err, collection){
      if( err ){
        mongodb.close();
        return cb(err);
      }

      collection.findOne({name: name}, function(err, doc){
        mongodb.close();
        if( doc ){
          var user = new User(doc);
          cb(err, user); //if success, return user info
        } else {
          cb(err, null); //if fail, return null
        }
      });
    });

  });    
};