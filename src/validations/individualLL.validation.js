const Joi = require('joi');
const { objectId } = require('./custom.validation');
/**
 * @module individualLL
 */
/**
 * Validation schema for creating an individual lesson learned.
 * @type {Object}
 * @property {Object} body - Request body object.
 * @property {string} body.LLOwnerName - Name of the lesson learned owner (required).
 * @property {string} body.LLOwnerId - ID of the lesson learned owner (required).
 * @property {string} body.problem - Description of the problem (required).
 * @property {string} body.impact - Description of the impact (required).
 * @property {string} body.lessonLearnedText - Text of the lesson learned (required).
 * @property {string} body.lessonLearnedId - ID of the lesson learned (required).
 */
const createIndividualLL = {
    body: Joi.object().keys({
        LLOwnerName: Joi.string().required(),
        LLOwnerId: Joi.string().required(),
        problem: Joi.string().required(),
        impact: Joi.string().required(),
        lessonLearnedText: Joi.string().required(),
        lessonLearnedId: Joi.required().required()
    }),
};
/**
 * Validation schema for getting individual lesson learneds.
 * @type {Object}
 * @property {Object} query - Query parameters object.
 * @property {string} [query.LLOwnerName] - Name of the lesson learned owner.
 * @property {string} [query.LLOwnerId] - ID of the lesson learned owner.
 * @property {string} [query.problem] - Description of the problem.
 * @property {string} [query.impact] - Description of the impact.
 * @property {string} [query.lessonLearnedText] - Text of the lesson learned.
 * @property {string} [query.IindividualLLId] - ID of the individual lesson learned.
 */
const getIndividualLLs = {
    query: Joi.object().keys({
        LLOwnerName: Joi.string(),
        LLOwnerId: Joi.string(),
        problem: Joi.string(),
        impact: Joi.string(),
        lessonLearnedText: Joi.string(),
        IindividualLLId: Joi.string()
    }),
};
/**
 * Validation schema for getting an individual lesson learned by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.individualLLId - ID of the individual lesson learned to retrieve.
 */
const getIndividualLLById = {
    params: Joi.object().keys({
        individualLLId: Joi.string().custom(objectId),
    }),
};
/**
 * Validation schema for updating an individual lesson learned by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.individualLLId - ID of the individual lesson learned to update.
 * @property {Object} body - Request body object.
 * @property {string} body.LLOwnerName - Name of the lesson learned owner (required).
 * @property {string} body.LLOwnerId - ID of the lesson learned owner (required).
 * @property {string} body.problem - Description of the problem (required).
 * @property {string} body.impact - Description of the impact (required).
 * @property {string} body.lessonLearnedText - Text of the lesson learned (required).
 */
const updateIndividualLLById = {
    params: Joi.object().keys({
        individualLLId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        LLOwnerName: Joi.string().required(),
        LLOwnerId: Joi.string().required(),
        problem: Joi.string().required(),
        impact: Joi.string().required(),
        lessonLearnedText: Joi.string().required(),
    })
        .min(1),
};
/**
 * Validation schema for deleting an individual lesson learned by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.individualLLId - ID of the individual lesson learned to delete.
 */
const deleteIndividualLLById = {
    params: Joi.object().keys({
        individualLLId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    createIndividualLL,
    getIndividualLLs,
    getIndividualLLById,
    updateIndividualLLById,
    deleteIndividualLLById,
};
