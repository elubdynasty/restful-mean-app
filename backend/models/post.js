const mongoose = require('mongoose');
//Schema for database

const postSchema = mongoose.Schema({
  title: {type: String, required: true}, //please see Mongoose docs for info
  content: {type: String, required: true},
  imagePath: {type: String, required: true}, //Added imagePath to the schema (to add images into the database)
  creator: { type: mongoose.Schema.Types.ObjectId,ref: 'User',required: true } //this data type will be an id //info who created this post
  //we can do this by fetching userId from the token

});

module.exports = mongoose.model('Post', postSchema); //constructor f(x)
