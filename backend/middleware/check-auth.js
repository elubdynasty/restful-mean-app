//check whether the user is authenticated/authorized to CRUD the App
//Verify the incoming token created by jwt


const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => { //authorization middleware
  try {   //check if there's an authorization header
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken= jwt.verify(token, process.env.JWT_KEY); //pass an argument, and that arg is the token parsed from the incoming req
    req.userData = {email: decodedToken.email, userId: decodedToken.userId}; //ExpressJS gives us an ability of easily adding new pieces of data. For ex, userData is the new field
    next();
  } catch (err){
    res.status(401).json({ message: "You are not authenticated!" })
  }
};
