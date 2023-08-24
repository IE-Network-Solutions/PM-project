const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createIssue = {
    body: Joi.object().keys({
        riskDescription: Joi.string().required(),
        causedBy: Joi.string().required(),
        consequences: Joi.string().required(),
        riskOwner: Joi.string().required(),
        status: Joi.string().valid('Closed', 'Open').required(),
        impact: Joi.string().required(),
        control: Joi.string().valid("Avoided", "Mitigated", "Transfered", "Accepted").required(),
        controlOwner: Joi.string().required(),
        residualImpact: Joi.string().required(),
        projectId: Joi.string().custom(objectId),
    }),
};

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

const getIssue = {
    params: Joi.object().keys({
        issueId: Joi.string().custom(objectId),
    }),
};

const getIssueByProjectId = {
    params: Joi.object().keys({
        projectId: Joi.string().custom(objectId),
    }),
};

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

const deleteIssue = {
    params: Joi.object().keys({
        issueId: Joi.string().custom(objectId),
    }),
};

const getIssuesByDate = {
    query: Joi.object().keys({
        startDate: Joi.date().iso().required(),
        endDate: Joi.date().iso().required(),
    }),
};
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
