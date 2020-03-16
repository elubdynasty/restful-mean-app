//implement login & Signup routes on the back-end
const express = require('express');
const UserController = require('../controllers/user');

const router = express.Router();

router.post('/signup', UserController.createUser); //the routing logic on the 2nd arg has been transferred to controllers user.js file

router.post('/login', UserController.userLogin);

module.exports = router;
