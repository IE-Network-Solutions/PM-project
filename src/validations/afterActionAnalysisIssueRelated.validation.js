const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createAfterActionAnalysisIssueRelated = {
    params: Joi.object().keys({
        actionAnalysisIssueRelatedId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        issueRelatedId: Joi.array().required(),
    }),
};

const getActionAnalysisIssueRelated = {
    query: Joi.object().keys({
        afterActionAnalysisId: Joi.string(),
        issueRelatedId: Joi.string(),
    }),
};

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
