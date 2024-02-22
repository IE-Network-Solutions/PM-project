const Joi = require('joi');
const { objectId } = require('./custom.validation');
/**
 * @module LLComment
*/
/**
 * Validation schema for creating a comment for a lessons learned.
 * @type {Object}
 * @property {Object} body - Request body object.
 * @property {string} body.userId - ID of the user creating the comment.
 * @property {string} body.comment - Content of the comment (required).
 * @property {string} body.id - ID of the lessons learned to which the comment belongs.
 */
const createLLComment = {
    body: Joi.object().keys({
        userId: Joi.string().custom(objectId),
        comment: Joi.string().required(),
        id: Joi.string().custom(objectId),
    }),
};
/**
 * Validation schema for getting comments for lessons learned.
 * @type {Object}
 * @property {Object} query - Query parameters object.
 * @property {string} [query.id] - ID of the comment.
 * @property {string} [query.userId] - ID of the user who created the comment.
 * @property {string} [query.comment] - Content of the comment.
 * @property {string} [query.LLId] - ID of the lessons learned to which the comment belongs.
 * @property {string} [query.date] - Date of the comment.
 */
const getLLComments = {
    query: Joi.object().keys({
        id: Joi.string(),
        userId: Joi.string(),
        comment: Joi.string(),
        LLId: Joi.string(),
        date: Joi.string(),
    }),
};
/**
 * Validation schema for getting a single comment for a lessons learned by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.commentId - ID of the comment to retrieve.
 */
const getLLComment = {
    params: Joi.object().keys({
        commentId: Joi.string().custom(objectId),
    }),
};
/**
 * Validation schema for updating a comment for a lessons learned by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.commentId - ID of the comment to update.
 * @property {Object} body - Request body object.
 * @property {string} body.comment - Content of the comment (required).
 * @property {string} body.date - Date of the comment (required).
 */
const updateLLComment = {
    params: Joi.object().keys({
        commentId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        comment: Joi.string().required(),
        date: Joi.string().required(),
    })
        .min(1),
};
/**
 * Validation schema for deleting a comment for a lessons learned by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.commentId - ID of the comment to delete.
 */
const deleteLLComment = {
    params: Joi.object().keys({
        commentId: Joi.string().custom(objectId),
    }),
};
/**
 * Validation schema for getting individual lessons learned by lessons learned ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.LLId - ID of the lessons learned to retrieve individual lessons learned for.
 */
const getIndividualLLByLLId = {
    params: Joi.object().keys({
        LLId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    createLLComment,
    getLLComments,
    getLLComment,
    updateLLComment,
    deleteLLComment,
    getIndividualLLByLLId
};
