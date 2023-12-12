
const multer = require("multer");

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
  };

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const isValid = FILE_TYPE_MAP[file.mimetype];
      let uploadError = new Error('invalid Image Type ');
      if (isValid) {
        uploadError = null;
      }
      cb(uploadError, './uploads');
    },
    filename: function (req, file, cb) {
      const fileName = file.originalname.split(' ').join('-');
      const extention = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}-${Date.now()}.${extention}`);
    },
  });
 exports.uploadOptions = multer({ storage: storage });
