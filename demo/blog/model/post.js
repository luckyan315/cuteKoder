var mongodb = require('./db');

exports = module.exports = Post = function(name, title, post){
  this.name = name;
  this.title = title;
  this.post = post;
};

(function(){
  this.save = function(cb){
    var date = new Date();
    var time = {
      date: date,
      year: date.getFullYear(),
      month: date.getFullYear() + "-" + (date.getMonth() + 1),
      day: date.getFullYear() + "-" + (date.getMonth() +1) + "-" + date.getDate(),
      minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() +
        " " + date.getHours() + ":" + date.getMinutes()
    };

    var post = {
      name: this.name,
      time: time,
      title: this.title,
      post: this.post
    };

    mongodb.open(function(err, db){
      if( err ){
        return cb(err);
      }

      db.collection('post', function(err, collection){
        if( err ){
          mongodb.close();
          return cb(err);
        }

        collection.insert(post, {safe: true}, function(err, post){
          mongodb.close();
          cb(null); //insert succeed 
        });
      });

    });
  };
}).call(Post.prototype);

Post.get = function(name, cb){
  mongodb.open(function(err, db){
    if( err ){
      return cb(err);
    }

    db.collection('post', function(err, collection){
      if( err ){
        mongodb.close();
        return cb(err);
      }

      var query = {};
      if( name ){
        query.name = name;
      }

      collection.find(query).sort({time: -1}).toArray(function(err, docs){
        mongodb.close();
        if( err ){
          cb(err, null);
        }

        cb(null, docs); 
      });
    });

  });
};