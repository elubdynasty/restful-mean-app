const mongoose = require('mongoose');
//Schema for database
const uniqueValidator = require('mongoose-unique-validator');//from 3rd party package of unique validator npm install --save mongoose-unique-validator

const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true}, //please see Mongoose docs for info
  password: {type: String, required: true}
});

userSchema.plugin(uniqueValidator); //the plugin will validate the email if it's already exists

module.exports = mongoose.model('User', userSchema); //constructor f(x)
