const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    
    const date = new Date();
    const currentDate = date.getFullYear() + '-' + date.getMonth() + '-' + date.getUTCDate();
    if (file.originalname.split('.')[1]){
      callback(null, currentDate + '_' + name);
    } else {
      callback(null,  currentDate + '_' + name + '.' + extension);
    }
    
  }
});

module.exports = multer({storage: storage}).single('image');