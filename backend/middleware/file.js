const multer = require('multer');

const MIME_TYPE_MAP = {
  "image/png": 'png',
  "image/jpeg": 'jpg',
  "image/jpg": 'jpg'
};

//handles incoming post requests

//configure how multer does store things
const storage = multer.diskStorage({
  destination: (req, file, cb) => { //path where the image file will be stored
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let errror = new Error('Invalid mime type');
    if(isValid) {
      error = null;
    }
    cb(error, 'images'); //'backend/images' for local dev only

  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-'); //extract the name of the file
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

//multer will now try to extract a single file from the incoming request

module.exports = multer({storage: storage}).single('image');
