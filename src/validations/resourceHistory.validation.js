const Joi = require('joi');
const { objectId } = require('./custom.validation');
/**
 * @module resourceHistory
 */
/**
 * Schema for creating a resource history entry.
 * @type {object}
 * @property {object} body - Request body.
 * @property {string} body.action - Action performed (required).
 * @property {string} body.projectId - ID of the project (required).
 * @property {string} body.taskId - ID of the task (required).
 * @property {string} body.userId - ID of the user (required).
 */
const createResourceHistory = {
    body: Joi.object().keys({
         action: Joi.string().required(),
        projectId: Joi.string().required(),
        taskId: Joi.string().required(),
        userId: Joi.string().required(),
    }),
};


module.exports = {
    createResourceHistory,

};
