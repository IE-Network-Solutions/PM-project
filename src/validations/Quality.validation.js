const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createQualityValidation = {
    body: Joi.object().keys({

    }),
};

module.exports = {
    createQualityValidation
}