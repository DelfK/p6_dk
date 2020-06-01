// import multer to manage uploading of files
const multer = require('multer');

// save the extension with the mime_types to use it later in the filename
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// manage how to store the files with diskStorage
const storage = multer.diskStorage({
  // configuring where to save the image files
  destination: (req, file, callback) => {
    // images uploaded are saved in the static folder /images
    callback(null, 'images');
  },

  // setting the filename
  filename: (req, file, callback) => {
    // if the original filname has spaces, replaces them with '_'
    const name = file.originalname.split(' ').join('_');
    // save the extension in const extension
    const extension = MIME_TYPES[file.mimetype];
    
    const date = new Date();
    // save the current daye to add it to the filename
    const currentDate = date.getFullYear() + '-' + date.getMonth() + '-' + date.getUTCDate();

    // check if the original filename has an extension
    if (file.originalname.split('.')[1]){
      // if yes just add the current date to the name
      callback(null, currentDate + '_' + name);
    } else {
      // if no, add the currentDate and the extension to the name
      callback(null,  currentDate + '_' + name + '.' + extension);
    }
    
  }
});

module.exports = multer({storage: storage}).single('image');