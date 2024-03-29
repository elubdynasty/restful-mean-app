//this app.js holds express framework
//Tool to be use in creating routes
const path = require('path');
const express = require('express');
//const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts'); //import the post routes
const userRoutes = require('./routes/user'); //import the user routes

const app = express();
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images'))); //any requests targeting /images will be allowed to continue. 'backend/images' path for local dev only
//app.use(bodyParser.urlencoded({ extended: false }));

//static access to the angular folder
app.use('/', express.static(path.join(__dirname,'angular')));

mongoose.connect('mongodb+srv://blueleo09:' + process.env.MONGO_ATLAS_PW+ '@cluster0-idic2.mongodb.net/node-angular') //?retryWrites=true&w=majority
  .then(() => {
    console.log('Connected to database');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

/*app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );

  next();
});*/

app.use('/api/posts',postsRoutes); //making express aware of it as re-organizing the HTTP methods file
//filter the req going to /api/posts & only req where the url or the path of the url
//starts with that, will be 4warded into the postsRoutes file & routing setup
app.use('/api/user',userRoutes);
app.use((req,res,next) => { //to serve an angular app for any requests targeting this
  res.sendFile(path.join(__dirname,'angular','index.html'));
});

module.exports = app;
