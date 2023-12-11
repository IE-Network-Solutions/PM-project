const path = require('path');
const multer = require('multer');
const { validateFile } = require('../validations/upload.validation');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './../public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // Use the validateFile function from Joi to perform file validation
  const isValid = validateFile(file);

  if (isValid) {
    // Accept the file
    cb(null, true);
  } else {
    // Reject the file with an error message
    cb(new Error('Invalid file'), false);
  }
};

exports.uploadOptions = multer({ storage: storage , fileFilter: fileFilter});
