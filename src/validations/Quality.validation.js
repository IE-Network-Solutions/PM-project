const Joi = require('joi');
const { objectId } = require('./custom.validation');
/**
 * @module quality
 */
/**
 * Validation schema for creating quality.
 * @type {Object}
 */
const createQualityValidation = {
    body: Joi.object().keys({

    }),
};

module.exports = {
    createQualityValidation
}
