
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var AuthorSchema = new Schema({
  name: {
    first: String,
    last: String,
    full: String
  },
  contact: {
    email: String,
    twitter: String,
    google: String
  },
  photo: String
});

var CommentSchema = new Schema({
  commenter: String,
  body: String,
  posted: Date
});

var ArticleSchema = new Schema({
  author: ObjectId,
  title: String,
  contents: String,
  published: Date,
  comments: [CommentSchema]
});

var Author = mongoose.model('Author', AuthorSchema);
var Article = mongoose.model('Article', ArticleSchema);

mongoose.connect('mongodb://localhost:27017/upandrunning', function(err){
  if( err ){
    console.log('Could not connect to mongo');
  }

  var newAuthor = new Author();
  newAuthor.name = {
    first: "guangln",
    last: "an",
    full: "guanglin an"
  };
  newAuthor.contact = {
    email: "lucky315.an@gmail.com",
    twitter: "",
    google: ""
  };
  newAuthor.photo = "";
  
  newAuthor.save(function(err){
    if( err ){
      console.log('could not save author');
    } else {
      console.log('Author saved!');
    }

    Author.find(function(err, doc){
      console.log(doc);
    });

  });
});