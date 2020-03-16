const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');
const PostController = require('../controllers/posts');

//The multer logic has been transferred to middleware folder

router.post('',
  checkAuth, //verify the token before extracting the file. This add route protected by auth
  extractFile, PostController.createPost); //the router logic has been transferred to posts.js controller

router.put('/:id',
  checkAuth, //verify the token before extracting the file. This edit route now protected by auth
  extractFile, PostController.editPost);

router.get('', PostController.readPosts);

router.get('/:id',PostController.readPostbyId);


//get the path requested by adding the filter or middleware

router.delete('/:id',
checkAuth, //this delete route now protected by auth
PostController.deletePost);

module.exports = router;
