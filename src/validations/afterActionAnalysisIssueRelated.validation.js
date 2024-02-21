const Joi = require('joi');
const { objectId } = require('./custom.validation');
/**
 * @module afterActionAnalysisIssueRelated
 */
/**
 * Validation schema for creating issues related to an after action analysis.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.afterActionAnalysisId - ID of the after action analysis.
 * @property {Object} body - Request body object.
 * @property {Array} body.relatedIssuedId - Array of related issue IDs.
 * @property {Array} body.name - Array of issue names.
 */
const createAfterActionAnalysisIssueRelated = {
    params: Joi.object().keys({
        afterActionAnalysisId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        relatedIssuedId: Joi.array().required(),
        name: Joi.array().required(),
    }),
};
/**
 * Validation schema for getting issues related to an after action analysis.
 * @type {Object}
 * @property {Object} query - Query parameters object.
 * @property {string} [query.afterActionAnalysisId] - ID of the after action analysis.
 * @property {string} [query.issueRelatedId] - ID of the related issue.
 */
const getActionAnalysisIssueRelated = {
    query: Joi.object().keys({
        afterActionAnalysisId: Joi.string(),
        issueRelatedId: Joi.string(),
    }),
};
/**
 * Validation schema for getting an action analysis issue related by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.actionAnalysisIssueRelatedId - ID of the action analysis issue related to retrieve.
 */
const getActionAnalysisIssueRelatedById = {
    params: Joi.object().keys({
        actionAnalysisIssueRelatedId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    createAfterActionAnalysisIssueRelated,
    getActionAnalysisIssueRelated,
    getActionAnalysisIssueRelatedById,
};
