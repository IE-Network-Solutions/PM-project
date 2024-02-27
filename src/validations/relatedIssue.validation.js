const Joi = require('joi');
const { objectId } = require('./custom.validation');
/**
 * @module relatedIssues
 */
/**
 * Schema for creating a related issue.
 * @type {object}
 * @property {object} body - Request body.
 * @property {string} body.name - Name of the related issue (required).
 * @property {string} [body.afterActionAnalysisId] - ID of the related action analysis.
 */
const createRelatedIssue = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        afterActionAnalysisId: Joi.string().custom(objectId),
    }),
};
/**
 * Schema for getting related issues.
 * @type {object}
 * @property {object} query - Query parameters.
 * @property {string} [query.name] - Name of the related issue.
 */
const getRelatedIssues = {
    query: Joi.object().keys({
        name: Joi.string(),
    }),
};

/**
 * Schema for getting a related issue by ID.
 * @type {object}
 * @property {object} params - URL parameters.
 * @property {string} params.relatedIssueId - ID of the related issue.
 */
const getRelatedIssue = {
    params: Joi.object().keys({
        relatedIssueId: Joi.string().custom(objectId),
    }),
};

/**
 * Schema for updating a related issue by ID.
 * @type {object}
 * @property {object} params - URL parameters.
 * @property {string} params.relatedIssueId - ID of the related issue.
 * @property {object} body - Request body.
 * @property {string} body.name - Name of the related issue (required).
 */
const updateRelatedIssueById = {
    params: Joi.object().keys({
        relatedIssueId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        name: Joi.string().required(),
    })
        .min(1),
};
/**
 * Schema for deleting a related issue by ID.
 * @type {object}
 * @property {object} params - URL parameters.
 * @property {string} params.relatedIssueId - ID of the related issue.
 */
const deleteRelatedIssueById = {
    params: Joi.object().keys({
        relatedIssueId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    createRelatedIssue,
    getRelatedIssues,
    getRelatedIssue,
    updateRelatedIssueById,
    deleteRelatedIssueById
};
