const Joi = require('joi');
const { objectId } = require('./custom.validation');
/**
 * @module risk
 */
/**
 * Schema for creating a risk.
 * @type {object}
 * @property {object} body - Request body.
 * @property {string} body.riskDescription - Description of the risk (required).
 * @property {string} body.causedBy - Cause of the risk (required).
 * @property {string} body.consequences - Consequences of the risk (required).
 * @property {string} body.probability - Probability of the risk (required).
 * @property {string} body.riskOwner - Owner of the risk (required).
 * @property {string} body.status - Status of the risk (required, valid values: 'Closed', 'Open').
 * @property {string} body.impact - Impact of the risk (required).
 * @property {string} body.control - Control measures for the risk (required).
 * @property {string} body.controlOwner - Owner of the control measures (required).
 * @property {string} body.residualProbability - Residual probability of the risk (required).
 * @property {string} body.residualImpact - Residual impact of the risk (required).
 * @property {string} [body.projectId] - ID of the project (custom object ID).
 */
const createRisk = {
    body: Joi.object().keys({
        riskDescription: Joi.string().required(),
        causedBy: Joi.string().required(),
        consequences: Joi.string().required(),
        probability: Joi.string().required(),
        riskOwner: Joi.string().required(),
        status: Joi.string().valid('Closed', 'Open').required(),
        impact: Joi.string().required(),
        control: Joi.string().required(),
        controlOwner: Joi.string().required(),
        residualProbability: Joi.string().required(),
        residualImpact: Joi.string().required(),
        // riskRate: Joi.string().required(),
        // residualRiskRate: Joi.string().required(),
        projectId: Joi.string().custom(objectId),
    }),
};

/**
 * Schema for querying risks.
 * @type {object}
 * @property {object} query - Query parameters.
 * @property {string} query.sortBy - Field to sort by.
 * @property {number} query.limit - Maximum number of results to return per page (integer).
 * @property {number} query.page - Page number (integer).
 */
const getRisks = {
    query: Joi.object().keys({
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};
/**
 * Schema for getting risks by project ID.
 * @type {object}
 * @property {object} params - Path parameters.
 * @property {string} params.projectId - ID of the project (custom object ID).
 */
const getRiskByProjectId = {
    params: Joi.object().keys({
        projectId: Joi.string().custom(objectId),
    }),
};
/**
 * Schema for querying all critical risks.
 * @type {object}
 * @property {object} query - Query parameters.
 * @property {string} query.sortBy - Field to sort by.
 * @property {number} query.limit - Maximum number of results to return per page (integer).
 * @property {number} query.page - Page number (integer).
 */
const getAllCriticalRisks = {
    query: Joi.object().keys({
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};
/**
 * Schema for getting a single risk by ID.
 * @type {object}
 * @property {object} params - Path parameters.
 * @property {string} params.riskId - ID of the risk (custom object ID).
 */
const getRisk = {
    params: Joi.object().keys({
        riskId: Joi.string().custom(objectId),
    }),
};
/**
 * Schema for updating a risk.
 * @type {object}
 * @property {object} params - Path parameters.
 * @property {string} params.riskId - ID of the risk (custom object ID).
 * @property {object} body - Request body.
 * @property {string} body.riskDescription - Description of the risk (required).
 * @property {string} body.causedBy - Cause of the risk (required).
 * @property {string} body.consequences - Consequences of the risk (required).
 * @property {string} body.probability - Probability of the risk (required).
 * @property {string} body.riskOwner - Owner of the risk (required).
 * @property {string} body.status - Status of the risk (required).
 * @property {string} body.impact - Impact of the risk (required).
 * @property {string} body.control - Control measures for the risk (required).
 * @property {string} body.controlOwner - Owner of the control measures (required).
 * @property {string} body.residualProbability - Residual probability of the risk (required).
 * @property {string} body.residualImpact - Residual impact of the risk (required).
 * @property {string} [body.projectId] - ID of the project (custom object ID).
 */
const updateRisk = {
    params: Joi.object().keys({
        riskId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        riskDescription: Joi.string().required(),
        causedBy: Joi.string().required(),
        consequences: Joi.string().required(),
        probability: Joi.string().required(),
        riskOwner: Joi.string().required(),
        status: Joi.string().required(),
        impact: Joi.string().required(),
        control: Joi.string().required(),
        controlOwner: Joi.string().required(),
        residualProbability: Joi.string().required(),
        residualImpact: Joi.string().required(),
        projectId: Joi.string().custom(objectId),
    })
        .min(1),
};
/**
 * Schema for deleting a risk.
 * @type {object}
 * @property {object} params - Path parameters.
 * @property {string} params.riskId - ID of the risk (custom object ID).
 */
const deleteRisk = {
    params: Joi.object().keys({
        riskId: Joi.string().custom(objectId),
    }),
};
/**
 * Schema for moving a risk to an issue.
 * @type {object}
 * @property {object} params - Path parameters.
 * @property {string} params.riskId - ID of the risk (custom object ID).
 */
const moveRiskToIssue = {
    params: Joi.object().keys({
        riskId: Joi.string().custom(objectId),
    }),
};

/**
 * Schema for querying risks by date range.
 * @type {object}
 * @property {object} query - Query parameters.
 * @property {Date} query.startDate - Start date of the date range (ISO format, required).
 * @property {Date} query.endDate - End date of the date range (ISO format, required).
 */
const getRisksByDate = {
    query: Joi.object().keys({
        startDate: Joi.date().iso().required(),
        endDate: Joi.date().iso().required(),
    }),
};
/**
 * Schema for getting all risks and issues by project ID.
 * @type {object}
 * @property {object} params - Path parameters.
 * @property {string} params.projectId - ID of the project (custom object ID).
 */
const getAllRiskAndIssuesByProjectId = {
    params: Joi.object().keys({
        projectId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    createRisk,
    getRisks,
    getRisk,
    getRiskByProjectId,
    updateRisk,
    deleteRisk,
    moveRiskToIssue,
    getAllCriticalRisks,
    getRisksByDate,
    getAllRiskAndIssuesByProjectId
};
