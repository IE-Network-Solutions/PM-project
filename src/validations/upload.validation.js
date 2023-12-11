const Joi = require('joi');
const { objectId } = require('./custom.validation');

const uploadFile = {
  query : Joi.object().keys({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().required(),
    size: Joi.number().required(),
  })
}

const validateFile = (file) => {
  const { error } = uploadFile.validate({ file });
  return error ? false : true;
};
