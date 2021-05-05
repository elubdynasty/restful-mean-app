const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); //creating a new user upon request

exports.createUser =  (req,res,next) => {
  //Create a new user and store it in the dbase
  bcrypt.hash(req.body.password, 10)
  .then(hash =>{
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save()
    .then(result=>{
      res.status(201).json({
        message: 'User created!',
        result: result
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Invalid authentication credentials!' //returning error msgs from the server once it received invalid user acct.
      });
    });
  });
}


exports.userLogin = (req,res,next) => {
  let fetchedUser;
  User.findOne({email: req.body.email})
  .then(user => {
    console.log(user);
    if(!user){
      return res.status(401).json({
        message: 'Auth failed'
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result => {
    console.log(result);
    if(!result){
      return res.status(401).json({
        message: 'Auth failed'
      });
    }
    const token = jwt.sign(
      {email: fetchedUser.email, userId: fetchedUser._id}, //id can be decoded (it's not encrypted)
      process.env.JWT_KEY,
      {expiresIn: '1h'}
    );
    //console.log(token);
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id //Passing the user id to the front-end (2/4/2020)
    });
  })
  .catch(err => {
    //console.log(err);
    return res.status(401).json({
      message: 'Invalid authentication credentials!' //returning error msgs on the server
    });
  });
}
