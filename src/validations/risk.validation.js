const Joi = require('joi');
const { objectId } = require('./custom.validation');

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

const getRisks = {
    query: Joi.object().keys({
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const getRiskByProjectId = {
    params: Joi.object().keys({
        projectId: Joi.string().custom(objectId),
    }),
};

const getAllCriticalRisks = {
    query: Joi.object().keys({
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};



const getRisk = {
    params: Joi.object().keys({
        riskId: Joi.string().custom(objectId),
    }),
};

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

const deleteRisk = {
    params: Joi.object().keys({
        riskId: Joi.string().custom(objectId),
    }),
};

const moveRiskToIssue = {
    params: Joi.object().keys({
        riskId: Joi.string().custom(objectId),
    }),
};

const getRisksByDate = {
    query: Joi.object().keys({
        startDate: Joi.date().iso().required(),
        endDate: Joi.date().iso().required(),
    }),
};
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
