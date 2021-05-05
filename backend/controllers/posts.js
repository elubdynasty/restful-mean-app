const Post = require('../models/post');

exports.createPost = (req,res,next) => { /*/api/posts*/ //taking out from ''
  //Create a new post and store it in the dbase
  const url = req.protocol + '://' + req.get('host');  //protocol is a prop. of req w/c returns whether we're accessing the server w/ HTTP or HTTPS
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename, //an imagepath to be stored in the dbase
    creator: req.userData.userId
  });  //req.body;
  console.log(post);

  post.save().then(createdPost=>{
    res.status(201).json({
      message: 'Post added successfully',
      //postId: createdPost._id
      post: {
     //Shortcut for the ff
        //title: createdPost.title,
        //content: createdPost.content,
        //imagePath: createdPost.imagePath is ...createdPost
        ...createdPost, //spread operators to copy all prop. of another obj. and then you simply add/overwrite some selected props.
        id: createdPost._id

      }
    });
  })  //method provided by Mongoose
  .catch(error => {
    return res.status(500).json({
      message: 'Creating a post failed!' //returning error msgs on the server
    });
  });
}

exports.editPost = (req,res,next) => { //get the path requested by adding the filter or middleware
  let imagePath = req.body.imagePath;
  if(req.file){
    const url = req.protocol + '://' + req.get('host');
    imagePath=url + '/images/' + req.file.filename;
  }

  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });

  console.log(post);

  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post) //.update() provided by Mongoose, similar to delete f(x) on mongoose but it needs 2nd arg where the new obj I wanted to store
  .then(result => {
    //console.log(result);
    if(result.n>0){
      res.status(200).json({
        message: 'Update Successful!'
      });
    }else {
      res.status(401).json({
        message: 'Not authorized!'
      });
    }
  })
  .catch(error => { //this will trigger when something's wrong technically
    return res.status(500).json({
      message: "Couldn't update post!" //returning error msgs on the server
    });
  });
}

exports.readPosts = (req,res,next) => { //get the path requested by adding the filter or middleware
 //res.send('Hello from Express');
//.find() provided by Mongoose
  const pageSize =+ req.query.pagesize; //plus sign because need to parse into number from string
  const currentPage =+ req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if(pageSize && currentPage){
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
    }
    postQuery.then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(error => { //this will trigger when something's wrong technically
      return res.status(500).json({
        message: 'Fetching posts failed!' //returning error msgs on the server
      });
    });

}

exports.readPostbyId = (req,res,next)=> {
  Post.findById(req.params.id)
  .then(post=>{
    if(post){
      res.status(200).json(post);
    } else{
      res.status(404).json({message: 'Post not found'});
    }
  });
}

exports.deletePost = (req,res,next) => {
 Post.deleteOne({_id: req.params.id, creator: req.userData.userId})
 .then(result => {
   console.log(result);
   if(result.n>0){
     res.status(200).json({
       message: 'Deletion Successful!'
     });
   }else {
     res.status(401).json({
       message: 'Not authorized!'
     });
   }
 });
}
