const Joi = require('joi');
const { objectId } = require('./custom.validation');
/**
 * @module issue
 */
/**
 * Validation schema for creating an issue.
 * @type {Object}
 * @property {Object} body - Request body object.
 * @property {string} body.riskDescription - Description of the risk (required).
 * @property {string} body.causedBy - Cause of the risk (required).
 * @property {string} body.consequences - Consequences of the risk (required).
 * @property {string} body.riskOwner - Owner of the risk (required).
 * @property {string} body.status - Status of the risk (required, should be either 'Closed' or 'Open').
 * @property {string} body.impact - Impact of the risk (required).
 * @property {string} body.control - Control measures for the risk (required).
 * @property {string} body.controlOwner - Owner of the control measures (required).
 * @property {string} body.residualImpact - Residual impact of the risk (required).
 * @property {string} body.projectId - ID of the project associated with the issue.
 */

  const createIssue = {
      body: Joi.object().keys({
          riskDescription: Joi.string().required(),
          causedBy: Joi.string().required(),
          consequences: Joi.string().required(),
          riskOwner: Joi.string().required(),
          status: Joi.string().valid('Closed', 'Open').required(),
          impact: Joi.string().required(),
          control: Joi.string().required(),
          controlOwner: Joi.string().required(),
          residualImpact: Joi.string().required(),
          projectId: Joi.string().custom(objectId),
      }),
  };
/**
 * Validation schema for getting issues.
 * @type {Object}
 * @property {Object} query - Query parameters object.
 * @property {string} [query.id] - ID of the issue.
 * @property {string} [query.riskDescription] - Description of the risk.
 * @property {string} [query.causedBy] - Cause of the risk.
 * @property {string} [query.consequences] - Consequences of the risk.
 * @property {string} [query.riskOwner] - Owner of the risk.
 * @property {string} [query.status] - Status of the risk.
 * @property {string} [query.impact] - Impact of the risk.
 * @property {string} [query.control] - Control measures for the risk.
 * @property {string} [query.controlOwner] - Owner of the control measures.
 * @property {string} [query.residualImpact] - Residual impact of the risk.
 */
const getIssues = {
    query: Joi.object().keys({
        id: Joi.string(),
        riskDescription: Joi.string(),
        causedBy: Joi.string(),
        consequences: Joi.string(),
        riskOwner: Joi.string(),
        status: Joi.string(),
        impact: Joi.string(),
        control: Joi.string(),
        controlOwner: Joi.string(),
        residualImpact: Joi.string()
    }),
};
/**
 * Validation schema for getting a single issue by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.issueId - ID of the issue to retrieve.
 */
const getIssue = {
    params: Joi.object().keys({
        issueId: Joi.string().custom(objectId),
    }),
};
/**
 * Validation schema for getting issues by project ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.projectId - ID of the project to retrieve issues for.
 */
const getIssueByProjectId = {
    params: Joi.object().keys({
        projectId: Joi.string().custom(objectId),
    }),
};
/**
 * Validation schema for updating an issue by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.issueId - ID of the issue to update.
 * @property {Object} body - Request body object.
 * @property {string} body.riskDescription - Description of the risk (required).
 * @property {string} body.causedBy - Cause of the risk (required).
 * @property {string} body.consequences - Consequences of the risk (required).
 * @property {string} body.riskOwner - Owner of the risk (required).
 * @property {string} body.status - Status of the risk (required).
 * @property {string} body.impact - Impact of the risk (required).
 * @property {string} body.control - Control measures for the risk (required).
 * @property {string} body.controlOwner - Owner of the control measures (required).
 * @property {string} body.residualImpact - Residual impact of the risk (required).
 */
const updateIssue = {
    params: Joi.object().keys({
        issueId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        riskDescription: Joi.string().required(),
        causedBy: Joi.string().required(),
        consequences: Joi.string().required(),
        riskOwner: Joi.string().required(),
        status: Joi.string().required(),
        impact: Joi.string().required(),
        control: Joi.string().required(),
        controlOwner: Joi.string().required(),
        residualImpact: Joi.string().required()
    })
        .min(1),
};
/**
 * Validation schema for deleting an issue by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.issueId - ID of the issue to delete.
 */
const deleteIssue = {
    params: Joi.object().keys({
        issueId: Joi.string().custom(objectId),
    }),
};
/**
 * Validation schema for getting issues by date range.
 * @type {Object}
 * @property {Object} query - Query parameters object.
 * @property {string} query.startDate - Start date of the range (required, ISO format).
 * @property {string} query.endDate - End date of the range (required, ISO format).
 */
const getIssuesByDate = {
    query: Joi.object().keys({
        startDate: Joi.date().iso().required(),
        endDate: Joi.date().iso().required(),
    }),
};
/**
 * Validation schema for getting issues by project ID and date range.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.projectId - ID of the project to retrieve issues for.
 * @property {Object} query - Query parameters object.
 * @property {string} query.startDate - Start date of the range (required, ISO format).
 * @property {string} query.endDate - End date of the range (required, ISO format).
 */
const getIssueByProjectIdByDate = {
    params: Joi.object().keys({
        projectId: Joi.string().custom(objectId),
    }),
    query: Joi.object().keys({
        startDate: Joi.date().iso().required(),
        endDate: Joi.date().iso().required(),
    }),
};

module.exports = {
    createIssue,
    getIssues,
    getIssue,
    updateIssue,
    deleteIssue,
    getIssueByProjectIdByDate,
    getIssueByProjectId,
    getIssuesByDate,
};
