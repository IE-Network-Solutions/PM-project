const Joi = require('joi');
const { objectId } = require('./custom.validation');
/**
 * @module upload
 */
/**
 * Schema for uploading a file.
 * @type {object}
 * @property {object} query - Query parameters.
 * @property {string} query.fieldname - Field name of the uploaded file (required).
 * @property {string} query.originalname - Original name of the uploaded file (required).
 * @property {string} query.encoding - Encoding of the uploaded file (required).
 * @property {string} query.mimetype - MIME type of the uploaded file (required).
 * @property {number} query.size - Size of the uploaded file in bytes (required).
 */
const uploadFile = {
  query : Joi.object().keys({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().required(),
    size: Joi.number().required(),
  })
}

/**
 * Function to validate a file object using the uploadFile schema.
 * @param {object} file - File object to validate.
 * @returns {boolean} - Returns true if the file object is valid, otherwise false.
 */
const validateFile = (file) => {
  const { error } = uploadFile.validate({ file });
  return error ? false : true;
};

module.exports = {
  validateFile
}
